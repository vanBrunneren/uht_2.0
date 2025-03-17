import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { formatInTimeZone } from 'date-fns-tz';
import { Clear, Done, TouchApp, Delete } from '@mui/icons-material';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GameDialog from '@/GameDialog';
import { useState } from 'react';
import { Category } from '@/types/Category';
import { Game } from '@/types/Game';

export default function Games({ games, category }: { games: Game[]; category: Category | null }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    console.log(category);

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
                game_id: gameId,
            })
            .then((response) => {
                console.log('Game finished successfully', response.data);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error updating goal:', error);
            });
    };

    const destroyGame = (gameId: number) => {
        axios
            .post('/games/destroy/' + gameId)
            .then((response) => {
                console.log('Game destroyed successfully', response.data);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error updating goal:', error);
            });
    };

    return (
        <>
            <GameDialog
                open={dialogOpen}
                handleClose={() => setDialogOpen(false)}
                teams={category?.teams}
                startDateTime={category?.start_datetime}
                onGameCreated={() => window.location.reload()}
                defaultLength={category?.default_length}
            />
            <TableContainer component={Paper}>
                <div className={'mt-4 mb-8 ml-4 text-4xl'}>{category?.name}</div>
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
                                    <Button
                                        variant="contained"
                                        onClick={() => updateGoalInDatabase(game.id, 1, game.team_1_goals + 1)}
                                        style={{ marginRight: '8px' }}
                                    >
                                        +
                                    </Button>
                                    {game.team1?.name}
                                    <Button
                                        variant="contained"
                                        onClick={() => updateGoalInDatabase(game.id, 1, game.team_1_goals - 1)}
                                        style={{ marginLeft: '8px' }}
                                    >
                                        -
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => updateGoalInDatabase(game.id, 2, game.team_2_goals + 1)}
                                        style={{ marginRight: '8px' }}
                                    >
                                        +
                                    </Button>
                                    {game.team2?.name}
                                    <Button
                                        variant="contained"
                                        onClick={() => updateGoalInDatabase(game.id, 2, game.team_2_goals - 1)}
                                        style={{ marginLeft: '8px' }}
                                    >
                                        -
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    {game.team_1_goals}:{game.team_2_goals}
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => finishGame(game.id)}>{game.finished ? <Clear /> : <Done />}</Button>
                                </TableCell>
                                <TableCell>
                                    <a href={'/matchview/' + game.id}>
                                        <TouchApp />
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => destroyGame(game.id)}>
                                        <Delete />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={'absolute right-0 bottom-0'}>
                <Fab color="primary" aria-label="add" className={'absolute right-4 bottom-4'} onClick={() => setDialogOpen(true)}>
                    <AddIcon />
                </Fab>
            </div>
        </>
    );
}
