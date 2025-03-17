import { Team } from '@/types/Team';

export interface Game {
    // Primary key
    id: number;

    // Foreign keys
    team_1_id: number;
    team_2_id: number;

    // Game stats
    team_1_goals: number;
    team_2_goals: number;

    // Time related fields
    length: string; // Format: "HH:MM:SS"
    start_datetime: string; // ISO format date string

    // Status
    finished: boolean;

    // Timestamps
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;

    // Relationships (included when eager loaded)
    team1?: Team;
    team2?: Team;
}
