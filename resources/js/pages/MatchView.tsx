import { useEffect, useState } from 'react';
import axios from 'axios';

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

const MatchView = ({ game }: { game: Game }) => {

    const [timeLeft, setTimeLeft] = useState<number>(480);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    // Game score state (initialized from game props)
    const [team1Goals, setTeam1Goals] = useState<number>(game?.team_1_goals || 0);
    const [team2Goals, setTeam2Goals] = useState<number>(game?.team_2_goals || 0);

    useEffect(() => {
        let timerId: NodeJS.Timeout | null = null;

        if (isRunning && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            // Timer finished logic here
        }

        // Cleanup interval on unmount or when timer state changes
        return () => {
            if (timerId) clearInterval(timerId);
        };
    }, [isRunning, timeLeft]);

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Timer controls
    const startTimer = () => setIsRunning(true);
    const pauseTimer = () => setIsRunning(false);
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(480); // Reset to 8 minutes
    };

    // Time adjustment controls
    const addMinute = () => {
        setTimeLeft(prev => prev + 60);
    };

    const subtractMinute = () => {
        setTimeLeft(prev => (prev >= 60) ? prev - 60 : prev);
    };

    const addSecond = () => {
        setTimeLeft(prev => prev + 1);
    };

    const subtractSecond = () => {
        setTimeLeft(prev => (prev > 0) ? prev - 1 : 0);
    };

    // Goal controls
    const addGoal = (team: 1 | 2) => {
        if (team === 1) {
            setTeam1Goals(prev => prev + 1);
            // Optional: Send API request to update score in backend
            updateGoalInDatabase(game.id, 1, team1Goals + 1);
        } else {
            setTeam2Goals(prev => prev + 1);
            // Optional: Send API request to update score in backend
            updateGoalInDatabase(game.id, 2, team2Goals + 1);
        }
    };

    const removeGoal = (team: 1 | 2) => {
        if (team === 1 && team1Goals > 0) {
            setTeam1Goals(prev => prev - 1);
            // Optional: Send API request to update score in backend
            updateGoalInDatabase(game.id, 1, team1Goals - 1);
        } else if (team === 2 && team2Goals > 0) {
            setTeam2Goals(prev => prev - 1);
            // Optional: Send API request to update score in backend
            updateGoalInDatabase(game.id, 2, team2Goals - 1);
        }
    };

    const updateGoalInDatabase = (gameId: number, teamNumber: number, goals: number) => {
        axios.post('/games/goal', {
            game_id: gameId,
            team_id: teamNumber,
            goals: goals
        })
            .then(response => {
                console.log('Goal updated successfully', response.data);
            })
            .catch(error => {
                console.error('Error updating goal:', error);
            });
    };

    return (
        <div>
            <h1>Match Timer</h1>

            {/* Display the timer */}
            <div className="timer">
                <h2>{formatTime(timeLeft)}</h2>
            </div>

            {/* Timer controls */}
            <div className="controls">
                {!isRunning ? (
                    <button onClick={startTimer}>Start</button>
                ) : (
                    <button onClick={pauseTimer}>Pause</button>
                )}
                <button onClick={resetTimer}>Reset</button>
            </div>

            {/* Time adjustment controls */}
            <div className="time-adjust">
                <div className="minutes-controls">
                    <button onClick={addMinute}>+1 Min</button>
                    <button onClick={subtractMinute}>-1 Min</button>
                </div>
                <div className="seconds-controls">
                    <button onClick={addSecond}>+1 Sec</button>
                    <button onClick={subtractSecond}>-1 Sec</button>
                </div>
            </div>

            {/* Score display and controls */}
            <div className="match-score">
                <div className="team-score">
                    <h3>{game?.team1?.name}</h3>
                    <div className="score-display">
                        <span className="score">{team1Goals}</span>
                        <div className="goal-controls">
                            <button onClick={() => addGoal(1)}>+</button>
                            <button onClick={() => removeGoal(1)}>-</button>
                        </div>
                    </div>
                </div>

                <div className="score-separator">:</div>

                <div className="team-score">
                    <h3>{game?.team2?.name}</h3>
                    <div className="score-display">
                        <span className="score">{team2Goals}</span>
                        <div className="goal-controls">
                            <button onClick={() => addGoal(2)}>+</button>
                            <button onClick={() => removeGoal(2)}>-</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchView;
