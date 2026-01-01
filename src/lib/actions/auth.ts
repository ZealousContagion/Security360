"use server"

import { apiFetch } from "@/lib/api-client"

export async function loginAction(credentials: { username: string; password: string }) {
    try {
        const response = await apiFetch<any>("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials)
        });
        return { success: true, data: response };
    } catch (error: any) {
        console.error("Login failed:", error);
        return { success: false, error: error.message };
    }
}
