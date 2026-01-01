"use server"

import { apiFetch } from "@/lib/api-client"

export async function fetchDashboardStatsAction() {
    try {
        return await apiFetch<any>("/reports/dashboard-stats");
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return null;
    }
}
