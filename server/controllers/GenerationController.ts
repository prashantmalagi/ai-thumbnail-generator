import { Request, Response } from 'express';
import sharp from 'sharp';
import Generation from '../models/Generation.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (candidate.length <= maxCharsPerLine) {
            current = candidate;
        } else {
            if (current) lines.push(current);
            current = word;
        }
    }
    if (current) lines.push(current);
    return lines;
}

/** Renders an SVG text overlay that is composited onto the image by sharp. */
function buildTextOverlay(title: string, colorScheme: string): Buffer {
    const textColors: Record<string, string> = {
        Vibrant: '#00e5ff',
        Warm:    '#ffbb00',
        Cool:    '#7dd3fc',
        Nature:  '#4ade80',
        Neon:    '#e879f9',
        Dark:    '#ffffff',
    };
    const textColor = textColors[colorScheme] ?? '#ffffff';

    // Responsive font size + line length based on title length
    const len = title.length;
    const { fontSize, maxChars } =
        len <= 15 ? { fontSize: 100, maxChars: 15 } :
        len <= 30 ? { fontSize: 80,  maxChars: 20 } :
        len <= 50 ? { fontSize: 64,  maxChars: 28 } :
                   { fontSize: 52,  maxChars: 35 };

    const lines = wrapText(title.toUpperCase(), maxChars);
    const lineHeight = fontSize * 1.25;
    const totalTextH = lines.length * lineHeight;
    // Place text slightly below vertical centre (YouTube lower-third feel)
    const startY = (720 - totalTextH) / 2 + fontSize * 0.85 + 40;

    const tspans = lines
        .map((line, i) =>
            `<text
                x="640" y="${startY + i * lineHeight}"
                text-anchor="middle"
                font-family="Impact, Arial Black, sans-serif"
                font-size="${fontSize}"
                font-weight="900"
                fill="${textColor}"
                stroke="rgba(0,0,0,0.95)"
                stroke-width="${Math.round(fontSize * 0.07)}"
                paint-order="stroke fill"
                filter="url(#ds)"
                letter-spacing="3"
            >${escapeXml(line)}</text>`
        )
        .join('\n');

    const svg = `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="ds" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="12"
                              flood-color="rgba(0,0,0,0.9)"/>
            </filter>
        </defs>
        ${tspans}
    </svg>`;

    return Buffer.from(svg);
}

// ── Prompt builder – asks for background/composition only, NO text ────────────
function buildPrompt(
    title: string,
    style: string,
    colorScheme: string,
    additionalDetails?: string
): string {
    const styleDescriptions: Record<string, string> = {
        bold:         'dramatic cinematic background, high contrast lighting, bold graphic elements, no text',
        minimalist:   'clean minimal abstract background, soft gradients, geometric shapes, no text',
        photo:        'photorealistic background scene, natural lighting, professional composition, no text',
        illustration: 'hand-drawn painterly illustration background, vibrant artwork, no text',
        tech:         'futuristic tech background, glowing neon circuits, dark sleek aesthetic, no text',
    };

    const colorDescriptions: Record<string, string> = {
        Vibrant: 'vibrant cyan and hot pink color palette',
        Warm:    'warm orange and golden yellow color palette',
        Cool:    'cool blue and icy cyan color palette',
        Nature:  'natural forest green and emerald color palette',
        Neon:    'neon purple and magenta color palette',
        Dark:    'deep dark charcoal and grey color palette',
    };

    const styleDesc = styleDescriptions[style] ?? styleDescriptions['bold'];
    const colorDesc = colorDescriptions[colorScheme] ?? colorDescriptions['Vibrant'];

    let prompt =
        `YouTube thumbnail background for a video about "${title}". ` +
        `${styleDesc}. ${colorDesc}. ` +
        `No text, no letters, no words anywhere in the image. ` +
        `Visually striking, 16:9 aspect ratio, fills the entire canvas.`;

    if (additionalDetails?.trim()) {
        prompt += ` ${additionalDetails}`;
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

        // 1. Build background-only prompt
        const prompt = buildPrompt(
            title,
            style || 'bold',
            colorScheme || 'Vibrant',
            additionalDetails
        );

        const pollinationsUrl =
            `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
            `?model=flux&width=1280&height=720&enhance=true&nologo=true`;

        // 2. Fetch background image from Pollinations
        const imageResponse = await fetch(pollinationsUrl);
        if (!imageResponse.ok) {
            throw new Error(`Pollinations error: ${imageResponse.status} ${imageResponse.statusText}`);
        }

        const rawBuffer = Buffer.from(await imageResponse.arrayBuffer());

        // 3. Composite accurate title text on top using sharp + SVG
        const textOverlay = buildTextOverlay(title, colorScheme || 'Vibrant');

        const finalBuffer = await sharp(rawBuffer)
            .resize(1280, 720)
            .composite([{ input: textOverlay, top: 0, left: 0 }])
            .jpeg({ quality: 92 })
            .toBuffer();

        const imageData = `data:image/jpeg;base64,${finalBuffer.toString('base64')}`;

        // 4. Persist to MongoDB
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
