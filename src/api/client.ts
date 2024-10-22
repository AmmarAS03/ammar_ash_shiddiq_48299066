import { Project, Tracking } from "@/types/api";

const API_BASE_URL = 'https://0b5ff8b0.uqcloud.net/api';

export class APIClient {
    private jwt: string;

    constructor(jwt: string) {
        this.jwt = jwt;
    }

    private async fetchWithAuth<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...options?.headers,
                'Authorization': `Bearer ${this.jwt}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    async getPublishedProjects(): Promise<Project[]> {
        return this.fetchWithAuth<Project[]>('/project?is_published=eq.true');
    }

    async getProjectLocations(projectId: number): Promise<Location[]> {
        return this.fetchWithAuth<Location[]>(`/location?project_id=eq.${projectId}`);
    }

    async trackParticipant(tracking: Omit<Tracking, 'id'>): Promise<Tracking> {
        return this.fetchWithAuth<Tracking>('/tracking', {
            method: 'POST',
            body: JSON.stringify(tracking),
        });
    }
}