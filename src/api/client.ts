import { Project, Tracking, ProjectLocation } from "@/types/api";

const API_BASE_URL = "https://0b5ff8b0.uqcloud.net/api";

interface ParticipantCount {
  project_id: number;
  participant_username: string;
}

interface TrackingPayload {
  project_id: number;
  location_id: number;
  points: number;
  username: string;
  participant_username: string;
}

export class APIClient {
  private jwt: string;

  constructor(jwt: string) {
    this.jwt = jwt;
  }

  private async fetchWithAuth<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${this.jwt}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as T;
    }

    return response.json();
  }

  async getPublishedProjects(): Promise<Project[]> {
    return this.fetchWithAuth<Project[]>("/project?is_published=eq.true");
  }

  async getProjectLocations(projectId: number): Promise<ProjectLocation[]> {
    return this.fetchWithAuth<ProjectLocation[]>(
      `/location?project_id=eq.${projectId}`
    );
  }

  async trackParticipant(tracking: TrackingPayload): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tracking),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      // No need to parse response since we know it's empty
      return;
    } catch (error) {
      console.error("Tracking error:", error);
      throw error;
    }
  }

  async getProjectParticipantCount(projectId: number): Promise<number> {
    try {
        const participants = await this.fetchWithAuth<{ participant_username: string }[]>(
            `/tracking?project_id=eq.${projectId}&select=participant_username`
        );
        
        // Get unique participant usernames using Set
        const uniqueParticipants = new Set(
            participants.map(p => p.participant_username)
        );
        
        return uniqueParticipants.size;
    } catch (error) {
        console.error('Error getting participant count:', error);
        return 0;
    }
}

  async getMultipleProjectParticipantCounts(
    projectIds: number[]
  ): Promise<Record<number, number>> {
    try {
      const participants = await this.fetchWithAuth<ParticipantCount[]>(
        `/tracking?project_id=in.(${projectIds.join(
          ","
        )})&select=project_id,participant_username&distinct`
      );

      // Group by project_id and count
      const counts: Record<number, number> = {};
      projectIds.forEach((id) => {
        counts[id] = participants.filter((p) => p.project_id === id).length;
      });

      return counts;
    } catch (error) {
      console.error("Error getting participant counts:", error);
      return Object.fromEntries(projectIds.map((id) => [id, 0]));
    }
  }

  async getUserProjectPoints(
    projectId: number,
    participantUsername: string
  ): Promise<number> {
    try {
      // Get all tracking entries for this user in this project
      const trackingData = await this.fetchWithAuth<Tracking[]>(
        `/tracking?project_id=eq.${projectId}&participant_username=eq.${participantUsername}`
      );

      // Sum up all points
      const totalPoints = trackingData.reduce(
        (sum, track) => sum + track.points,
        0
      );
      return totalPoints;
    } catch (error) {
      console.error("Error getting user points:", error);
      return 0;
    }
  }

  async getUserVisitedLocations(
    projectId: number,
    participantUsername: string
  ): Promise<number> {
    try {
      // Get unique locations visited by this user in this project
      const trackingData = await this.fetchWithAuth<Tracking[]>(
        `/tracking?project_id=eq.${projectId}&participant_username=eq.${participantUsername}&select=location_id`
      );

      // Get unique location count
      const uniqueLocations = new Set(
        trackingData.map((track) => track.location_id)
      );
      return uniqueLocations.size;
    } catch (error) {
      console.error("Error getting visited locations:", error);
      return 0;
    }
  }

  async getUserVisitedLocationIds(
    projectId: number,
    participantUsername: string | null
  ): Promise<number[]> {
    try {
      const trackingData = await this.fetchWithAuth<Tracking[]>(
        `/tracking?project_id=eq.${projectId}&participant_username=eq.${participantUsername}&select=location_id`
      );
      return [...new Set(trackingData.map((track) => track.location_id))];
    } catch (error) {
      console.error("Error getting visited location IDs:", error);
      return [];
    }
  }
}
