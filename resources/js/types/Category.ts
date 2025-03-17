import { Team } from '@/types/Team';

export interface Category {
    id: number;
    name: string;
    teams: Team[];
    start_datetime: string;
    default_length: string;
}
