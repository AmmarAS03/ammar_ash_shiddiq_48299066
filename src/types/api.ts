export interface Project {
    id: number;
    title: string;
    description: string;
    is_published: boolean;
    participant_scoring: 'Not Scored' | 'Number of Scanned QR Codes' | 'Number of Locations Entered';
    username: string;
    instructions: string;
    initial_clue: string;
    homescreen_display: 'Display initial clue' | 'Display all locations';
}

export interface Location {
    id: number;
    project_id: number;
    location_name: string;
    location_trigger: string;
    location_position: string;
    score_points: number;
    clue: string;
    location_content: string;
}

export interface ProjectLocation {
    id: number;
    project_id: number;
    location_name: string;
    location_trigger: string;
    location_position: string;
    score_points: number;
    clue: string;
    location_content: string;
}

export interface Tracking {
    id: number;
    project_id: number;
    location_id: number;
    username: string;
    points: number;
    participant_username: string;
}