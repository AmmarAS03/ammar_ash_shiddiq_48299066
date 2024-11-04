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

/**
 * APIClient class for handling all API communications
 *
 * Provides methods for interacting with the project API, including
 * fetching projects, tracking participants, and retrieving statistics.
 *
 * @class
 * @example
 * ```typescript
 * const client = new APIClient('your-jwt-token');
 * const projects = await client.getPublishedProjects();
 * ```
 */
export class APIClient {
  private jwt: string;

  /**
   * Creates an instance of APIClient
   * @param {string} jwt - JWT token for authentication
   */
  constructor(jwt: string) {
    this.jwt = jwt;
  }

  /**
   * Generic fetch method with authentication
   *
   * @private
   * @template T - Type of the response data
   * @param {string} endpoint - API endpoint to fetch from
   * @param {RequestInit} [options] - Fetch options
   * @returns {Promise<T>} Response data
   * @throws {Error} When the API request fails
   */
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
  /**
   * Fetches all published projects
   * @returns {Promise<Project[]>} Array of published projects
   */
  async getPublishedProjects(): Promise<Project[]> {
    return this.fetchWithAuth<Project[]>("/project?is_published=eq.true");
  }

  /**
   * Fetches locations for a specific project
   * @param {number} projectId - ID of the project
   * @returns {Promise<ProjectLocation[]>} Array of project locations
   */
  async getProjectLocations(projectId: number): Promise<ProjectLocation[]> {
    return this.fetchWithAuth<ProjectLocation[]>(
      `/location?project_id=eq.${projectId}`
    );
  }

  /**
   * Tracks a participant's visit to a location
   * @param {TrackingPayload} tracking - Tracking data payload
   * @returns {Promise<void>}
   * @throws {Error} When tracking fails
   */
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

  /**
   * Gets the number of unique participants for a project
   * @param {number} projectId - ID of the project
   * @returns {Promise<number>} Number of unique participants
   */
  async getProjectParticipantCount(projectId: number): Promise<number> {
    try {
      const participants = await this.fetchWithAuth<
        { participant_username: string }[]
      >(`/tracking?project_id=eq.${projectId}&select=participant_username`);

      // Get unique participant usernames using Set
      const uniqueParticipants = new Set(
        participants.map((p) => p.participant_username)
      );

      return uniqueParticipants.size;
    } catch (error) {
      console.error("Error getting participant count:", error);
      return 0;
    }
  }

  /**
   * Gets participant counts for multiple projects
   * @param {number[]} projectIds - Array of project IDs
   * @returns {Promise<Record<number, number>>} Map of project IDs to participant counts
   */
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

  /**
   * Gets total points for a user in a specific project
   * @param {number} projectId - ID of the project
   * @param {string} participantUsername - Username of the participant
   * @returns {Promise<number>} Total points earned
   */
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

  /**
   * Gets the number of unique locations visited by a user in a project
   * @param {number} projectId - ID of the project
   * @param {string} participantUsername - Username of the participant
   * @returns {Promise<number>} Number of unique locations visited
   */
  async getUserVisitedLocations(
    projectId: number,
    participantUsername: string
  ): Promise<number> {
    try {
      const trackingData = await this.fetchWithAuth<Tracking[]>(
        `/tracking?project_id=eq.${projectId}&participant_username=eq.${participantUsername}&select=location_id`
      );

      const uniqueLocations = new Set(
        trackingData.map((track) => track.location_id)
      );
      return uniqueLocations.size;
    } catch (error) {
      console.error("Error getting visited locations:", error);
      return 0;
    }
  }

  /**
   * Gets IDs of locations visited by a user in a project
   * @param {number} projectId - ID of the project
   * @param {string | null} participantUsername - Username of the participant
   * @returns {Promise<number[]>} Array of visited location IDs
   */
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

  /**
   * Gets participant counts for each location in a project
   * @param {number} projectId - ID of the project
   * @returns {Promise<Record<number, number>>} Map of location IDs to participant counts
   */
  async getLocationParticipantCounts(
    projectId: number
  ): Promise<Record<number, number>> {
    try {
      // Get all tracking entries for this project, selecting location_id and participant_username
      const trackingData = await this.fetchWithAuth<
        {
          location_id: number;
          participant_username: string;
        }[]
      >(
        `/tracking?project_id=eq.${projectId}&select=location_id,participant_username&distinct`
      );

      // Create a map to store counts for each location
      const locationCounts: Record<number, number> = {};

      // Group tracking data by location_id and count unique participants
      trackingData.forEach((track) => {
        if (!locationCounts[track.location_id]) {
          const uniqueParticipants = new Set(
            trackingData
              .filter((t) => t.location_id === track.location_id)
              .map((t) => t.participant_username)
          );
          locationCounts[track.location_id] = uniqueParticipants.size;
        }
      });

      return locationCounts;
    } catch (error) {
      console.error("Error getting location participant counts:", error);
      return {};
    }
  }
}
