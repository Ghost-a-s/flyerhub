import axios from "axios";
export const api = axios.create({ baseURL: "/api", headers: { "Content-Type": "application/json" } });
export function apiError(error: unknown) { if (axios.isAxiosError(error)) return (error.response?.data as { error?: string } | undefined)?.error ?? "Request failed."; return error instanceof Error ? error.message : "Request failed."; }
