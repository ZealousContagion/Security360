import { cookies } from "next/headers";

const BASE_URL = "http://localhost:5100/api";

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const isServer = typeof window === 'undefined';
    let token: string | undefined;

    if (isServer) {
        // In Next.js 15, cookies() is async
        const cookieStore = await cookies();
        token = cookieStore.get('auth_token')?.value;
    } else {
        token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...options?.headers,
        },
    });

    if (!response.ok) {
        if (response.status === 401 && !isServer) {
            window.location.href = "/auth/login";
        }
        const error = await response.text();
        throw new Error(error || "API request failed");
    }

    if (response.status === 204) return {} as T;
    return response.json();
}
