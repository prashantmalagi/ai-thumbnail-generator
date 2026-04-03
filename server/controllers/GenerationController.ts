import { Request, Response } from 'express';
import { GoogleGenAI, Modality } from '@google/genai';
import Generation from '../models/Generation.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// Model that supports image generation with a standard AI Studio API key
const IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';

// ── Build a rich YouTuibe-thumbnail prompt from the form fields ──────────────
function buildPrompt(
    title: string,
    style: string,
    colorScheme: string,
    additionalDetails?: string
): string {
    const styleDescriptions: Record<string, string> = {
        bold: 'bold typography, high contrast colors, dramatic lighting, eye-catching graphic design, large text overlay',
        minimalist: 'clean minimal design, plenty of white space, simple geometric elements, elegant typography',
        photo: 'photorealistic, high quality photography style, natural lighting, professional photo composition',
        illustration: 'hand-drawn illustration style, artistic, creative painterly look, colorful artwork',
        tech: 'futuristic tech aesthetic, glowing neon accents, dark background, circuit-board elements, sleek modern UI feel',
    };

    const colorDescriptions: Record<string, string> = {
        Vibrant: 'vibrant cyan and hot pink color palette',
        Warm: 'warm orange and red color palette',
        Cool: 'cool blue and cyan color palette',
        Nature: 'natural green and emerald color palette',
        Neon: 'neon purple and indigo color palette',
        Dark: 'dark charcoal and grey color palette',
    };

    const styleKey = style.toLowerCase().replace(/[^a-z]/g, '').split('').slice(0, 4).join('') as string;
    const styleDesc = styleDescriptions[style] || styleDescriptions['bold'];
    const colorDesc = colorDescriptions[colorScheme] || colorDescriptions['Vibrant'];

    let prompt = `Create a professional YouTube thumbnail for a video titled "${title}". 
Style: ${styleDesc}. 
Color scheme: ${colorDesc}.
The thumbnail should be visually striking, high-resolution, 16:9 aspect ratio.
Include the video title text prominently displayed.
No borders, no frames. The image should fill the entire canvas.`;

    if (additionalDetails?.trim()) {
        prompt += `\nAdditional requirements: ${additionalDetails}`;
    }

    return prompt;
}

// ── POST /api/generate ───────────────────────────────────────────────────────
export const generateThumbnail = async (req: Request, res: Response) => {
    try {
        const { title, style, aspectRatio, colorScheme, additionalDetails } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Please login to generate thumbnails' });
        }

        const prompt = buildPrompt(title, style || 'bold', colorScheme || 'Vibrant', additionalDetails);

        // Call Gemini with image generation modality
        const response = await ai.models.generateContent({
            model: IMAGE_MODEL,
            contents: prompt,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });

        // Find the image part in the response
        const parts = response.candidates?.[0]?.content?.parts ?? [];
        const imagePart = parts.find((p: any) => p.inlineData?.data);

        if (!imagePart?.inlineData?.data) {
            console.error('Full Gemini response:', JSON.stringify(response, null, 2));
            return res.status(500).json({ message: 'Image generation failed – no image returned from Gemini' });
        }

        const base64 = imagePart.inlineData.data as string; // already a base64 string
        const mimeType = imagePart.inlineData.mimeType || 'image/jpeg';
        const imageData = `data:${mimeType};base64,${base64}`;

        // Save to DB
        const generation = await Generation.create({
            userId,
            title,
            style: style || 'bold',
            aspectRatio: aspectRatio || '16:9',
            colorScheme: colorScheme || 'Vibrant',
            additionalDetails: additionalDetails || '',
            imageData,
            prompt,
        });

        return res.status(201).json({
            message: 'Thumbnail generated successfully',
            generation: {
                _id: generation._id,
                title: generation.title,
                style: generation.style,
                aspectRatio: generation.aspectRatio,
                colorScheme: generation.colorScheme,
                imageData: generation.imageData,
                createdAt: generation.createdAt,
            },
        });

    } catch (error: any) {
        console.error('Generation error:', error);
        return res.status(500).json({
            message: error?.message || 'Server error during generation',
        });
    }
};

// ── GET /api/generate/my ─────────────────────────────────────────────────────
export const getMyGenerations = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Please login' });
        }

        const generations = await Generation.find({ userId })
            .sort({ createdAt: -1 })
            .select('-prompt'); // exclude the raw prompt to keep payload small

        return res.status(200).json({ generations });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ── DELETE /api/generate/:id ─────────────────────────────────────────────────
export const deleteGeneration = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        const { id } = req.params;

        const generation = await Generation.findOneAndDelete({ _id: id, userId });

        if (!generation) {
            return res.status(404).json({ message: 'Generation not found' });
        }

        return res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
