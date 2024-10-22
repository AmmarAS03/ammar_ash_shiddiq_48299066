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
    location_name: string;
    location_trigger: 'Location Entry' | 'QR Code Scan' | 'Both Location Entry and QR Code Scan';
    location_position: string; // Format: "(27.4975,153.013276)"
    score_points: number;
    clue: string;
    location_content: string;
}

export interface Tracking {
    id: number;
    project_id: number;
    location_id: number;
    points: number;
    username: string;
    participant_username: string;
}