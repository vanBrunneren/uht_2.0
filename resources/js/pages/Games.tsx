import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { formatInTimeZone } from 'date-fns-tz';
import { DeleteIcon, EditIcon } from 'lucide-react';
import { Clear, Done, TouchApp } from '@mui/icons-material';
import Button from '@mui/material/Button';
import axios from 'axios';

// Import or define the Team interface if needed
interface Team {
    id: number;
    name: string;
    category_id: number;
    groupid: number;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
    // Include other Team properties as needed
}

interface Game {
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

// For use with Inertia or API responses where relationships might be included
interface GameWithRelationships extends Game {
    team1: Team;
    team2: Team;
}

export default function Games({ games }: { games: Game[] }) {

    const updateGoalInDatabase = (gameId: number, teamNumber: number, goals: number) => {
        axios
            .post('/games/goal', {
                game_id: gameId,
                team_id: teamNumber,
                goals: goals,
            })
            .then((response) => {
                console.log('Goal updated successfully', response.data);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error updating goal:', error);
            });
    };

    const finishGame = (gameId: number) => {
        axios
            .post('/games/finish', {
                game_id: gameId
            })
            .then((response) => {
                console.log('Game finished successfully', response.data);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error updating goal:', error);
            });
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Startzeit</TableCell>
                        <TableCell>Länge</TableCell>
                        <TableCell>Team 1</TableCell>
                        <TableCell>Team 2</TableCell>
                        <TableCell>Resultat</TableCell>
                        <TableCell>Spiel beendet</TableCell>
                        <TableCell>Spiel starten</TableCell>
                        <TableCell>Bearbeiten</TableCell>
                        <TableCell>Löschen</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {games.map((game) => (
                        <TableRow key={game.id}>
                            <TableCell>{game.id}</TableCell>
                            <TableCell>{formatInTimeZone(game.start_datetime, 'Europe/Zurich', 'dd.MM.yyyy HH:mm:ss')}</TableCell>
                            <TableCell>{game.length.split('T')[1].substring(0, 8)}</TableCell>
                            <TableCell>
                                <Button variant="contained" onClick={() => updateGoalInDatabase(game.id, 1, game.team_1_goals + 1)} style={{marginRight: '8px'}}>+</Button>
                                {game.team1?.name}
                                <Button variant="contained" onClick={() => updateGoalInDatabase(game.id, 1, game.team_1_goals - 1)} style={{marginLeft: '8px'}}>-</Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" onClick={() => updateGoalInDatabase(game.id, 2, game.team_2_goals + 1)} style={{marginRight: '8px'}}>+</Button>
                                {game.team2?.name}
                                <Button variant="contained" onClick={() => updateGoalInDatabase(game.id, 2, game.team_2_goals - 1)} style={{marginLeft: '8px'}}>-</Button>
                            </TableCell>
                            <TableCell>
                                {game.team_1_goals}:{game.team_2_goals}
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => finishGame(game.id)}>
                                    {game.finished ? <Clear /> : <Done />}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <a href={'/matchview/' + game.id}>
                                    <TouchApp />
                                </a>
                            </TableCell>
                            <TableCell>
                                <a onClick={() => {}}>
                                    <EditIcon />
                                </a>
                            </TableCell>
                            <TableCell>
                                <a onClick={() => {}}>
                                    <DeleteIcon />
                                </a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
