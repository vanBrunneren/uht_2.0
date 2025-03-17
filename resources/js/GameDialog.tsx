import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Team } from '@/pages/Games';
import { Alert, FormControl, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

interface GameData {
    team_1_id: number;
    team_2_id: number;
    team_1_goals: number;
    team_2_goals: number;
    length: string;
    start_datetime: string;
    finished: boolean;
}

export default function GameDialog({
   open,
   handleClose,
   teams,
   startDateTime,
   onGameCreated
}: {
    open: boolean;
    handleClose: () => void,
    teams: Team[] | undefined,
    startDateTime: string | undefined,
    onGameCreated?: () => void  // Optional callback to refresh the games list
}) {

    const [team1Id, setTeam1Id] = useState<number | null>(null);
    const [team2Id, setTeam2Id] = useState<number | null>(null);
    const [startDateTimeValue, setStartDateTimeValue] = useState<string | undefined>(startDateTime?.replace(":00.000000Z", ""));
    const [length, setLength] = useState<string | undefined>("00:10:00");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validate inputs
        if (!team1Id || !team2Id || !startDateTimeValue || !length) {
            setError("All fields are required");
            return;
        }

        if (team1Id === team2Id) {
            setError("Team 1 and Team 2 cannot be the same");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Prepare the game data object
            const gameData: GameData = {
                team_1_id: team1Id,
                team_2_id: team2Id,
                team_1_goals: 0,
                team_2_goals: 0,
                length: `${length}`,  // Ensure seconds are included
                start_datetime: new Date(startDateTimeValue).toISOString(),
                finished: false
            };

            // Get the CSRF token from the meta tag
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            // Make the API request to save the game
            await axios.post('/games/store', gameData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token || ''
                }
            });

            // Show success message
            setShowSuccess(true);

            // Call the callback function if provided
            if (onGameCreated) {
                onGameCreated();
            }

            // Reset form and close dialog
            resetForm();
            handleClose();

        } catch (err) {
            console.error('Error saving game:', err);
            setError("Failed to save the game. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTeam1Id(null);
        setTeam2Id(null);
        setStartDateTimeValue(startDateTime?.replace(":00.000000Z", ""));
        setLength("00:10:00");
    };


    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: handleSubmit,
                    },
                }}
            >
                <DialogTitle>Add Game</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <TextField
                            onChange={ (e) => setStartDateTimeValue(e.target.value) }
                            type={'datetime-local'}
                            autoFocus
                            margin="dense"
                            id="start-time"
                            name="start-time"
                            defaultValue={startDateTimeValue}
                            label="Startzeit"
                            fullWidth variant="standard" />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            onChange={ (e) => setLength(e.target.value) }
                            type={'time'}
                            margin="dense"
                            id="time"
                            name="time"
                            defaultValue={length}
                            label="Länge (hh:mm)"
                            fullWidth variant="standard" />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label-1" className={'mt-4'}>Team 1</InputLabel>
                        <Select
                            className={'mt-4'}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={team1Id}
                            label="Team 1"
                            onChange={(e) => setTeam1Id(e.target.value as number)}
                        >
                            {teams?.map((team) => (
                                <MenuItem value={team.id}>{team.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label-2" className={'mt-4'}>Team 2</InputLabel>
                        <Select
                            className={'mt-4'}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={team2Id}
                            label="Team 2"
                            onChange={(e) => setTeam2Id(e.target.value as number)}
                        >
                            {teams?.map((team) => (
                                <MenuItem value={team.id}>{team.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>Abbrechen</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Speichern...' : 'Speichern'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setShowSuccess(false)} severity="success">
                    Game successfully created!
                </Alert>
            </Snackbar>
        </>
    );
}
