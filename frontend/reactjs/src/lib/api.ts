// In production, VITE_API_URL points to your deployed backend (e.g. Render)
// In dev, the Vite proxy forwards /api/* → http://localhost:5000
const API_BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        credentials: 'include', // send session cookie with every request
        ...options,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
    message: string;
    user?: {
        _id: string;
        name: string;
        email: string;
    };
}

export const authApi = {
    register: (name: string, email: string, password: string) =>
        request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        }),

    login: (email: string, password: string) =>
        request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    logout: () =>
        request<AuthResponse>('/auth/logout', { method: 'POST' }),

    me: () =>
        request<AuthResponse>('/auth/me'),
};

// ─── Generation ──────────────────────────────────────────────────────────────

export interface IGeneration {
    _id: string;
    title: string;
    style: string;
    aspectRatio: string;
    colorScheme: string;
    imageData: string;   // data:image/jpeg;base64,...
    createdAt: string;
}

export interface GenerateRequest {
    title: string;
    style: string;
    aspectRatio: string;
    colorScheme: string;
    additionalDetails?: string;
}

export const generateApi = {
    generate: (payload: GenerateRequest) =>
        request<{ message: string; generation: IGeneration }>('/generate', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    getMyGenerations: () =>
        request<{ generations: IGeneration[] }>('/generate/my'),

    delete: (id: string) =>
        request<{ message: string }>(`/generate/${id}`, { method: 'DELETE' }),
};

