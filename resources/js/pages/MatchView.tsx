import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { getMinutes } from 'date-fns';
import { Game } from '@/types/Game';

const MatchView = ({ game, nextId }: { game: Game, nextId: number }) => {

    const [timeLeft, setTimeLeft] = useState<number>(getMinutes(game.length) * 60);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    // Game score state (initialized from game props)
    const [team1Goals, setTeam1Goals] = useState<number>(game?.team_1_goals || 0);
    const [team2Goals, setTeam2Goals] = useState<number>(game?.team_2_goals || 0);

    useEffect(() => {
        let timerId: NodeJS.Timeout | null = null;

        if (isRunning && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
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
        setTimeLeft(getMinutes(game.length) * 60);
    };

    // Time adjustment controls
    const addMinute = () => {
        setTimeLeft((prev) => prev + 60);
    };

    const subtractMinute = () => {
        setTimeLeft((prev) => (prev >= 60 ? prev - 60 : prev));
    };

    const addSecond = () => {
        setTimeLeft((prev) => prev + 1);
    };

    const subtractSecond = () => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    };

    const addGoal = (team: 1 | 2) => {
        if (team === 1) {
            setTeam1Goals((prev) => prev + 1);
            // Optional: Send API request to update score in backend
            updateGoalInDatabase(game.id, 1, team1Goals + 1);
        } else {
            setTeam2Goals((prev) => prev + 1);
            // Optional: Send API request to update score in backend
            updateGoalInDatabase(game.id, 2, team2Goals + 1);
        }
    };

    const removeGoal = (team: 1 | 2) => {
        if (team === 1 && team1Goals > 0) {
            setTeam1Goals((prev) => prev - 1);
            // Optional: Send API request to update score in backend
            updateGoalInDatabase(game.id, 1, team1Goals - 1);
        } else if (team === 2 && team2Goals > 0) {
            setTeam2Goals((prev) => prev - 1);
            // Optional: Send API request to update score in backend
            updateGoalInDatabase(game.id, 2, team2Goals - 1);
        }
    };

    const updateGoalInDatabase = (gameId: number, teamNumber: number, goals: number) => {
        axios
            .post('/games/goal', {
                game_id: gameId,
                team_id: teamNumber,
                goals: goals,
            })
            .then((response) => {
                console.log('Goal updated successfully', response.data);
            })
            .catch((error) => {
                console.error('Error updating goal:', error);
            });
    };

    return (
        <div className={'flex flex-col justify-center items-center'} style={{height: '100vh'}}>
            <div className={'flex flex-row text-9xl'} style={{width: '100%'}}>
                <div className={'flex flex-1 justify-end mx-24 text-7xl items-center'}>
                    {game?.team1?.name}
                </div>
                <div className={'flex flex-row items-center'}>
                    <div>{team1Goals}</div>
                    <div>:</div>
                    <div>{team2Goals}</div>
                </div>
                <div className={'flex flex-1 mx-24 text-7xl items-center'}>{game?.team2?.name}</div>
            </div>
            <div className={"flex flex-row match-score"}>
                <div className={"team-score mr-8 text-4xl"}>
                    <div className="score-display">
                        <span className="score"></span>
                        <div className="goal-controls">
                            <button style={{cursor: 'pointer'}} onClick={() => addGoal(1)}>+</button>
                            <button style={{cursor: 'pointer'}} onClick={() => removeGoal(1)}>-</button>
                        </div>
                    </div>
                </div>
                <div className={"team-score ml-8 text-4xl"}>
                    <div className="score-display">
                        <span className="score"></span>
                        <div className="goal-controls">
                            <button style={{cursor: 'pointer'}} onClick={() => addGoal(2)}>+</button>
                            <button style={{cursor: 'pointer'}} onClick={() => removeGoal(2)}>-</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'timer text-9xl mt-8'}>
                <h2>{formatTime(timeLeft)}</h2>
            </div>
            <div className={"flex flex-row match-score mb-8"}>
                <div className={"team-score mr-8 text-4xl"}>
                    <button style={{cursor: 'pointer'}} onClick={addMinute}>+</button>
                    <button style={{cursor: 'pointer'}} onClick={subtractMinute}>-</button>
                </div>
                <div className={"team-score ml-8 text-4xl"}>
                    <button style={{cursor: 'pointer'}} onClick={addSecond}>+</button>
                    <button style={{cursor: 'pointer'}} onClick={subtractSecond}>-</button>
                </div>
            </div>
            <div className={"controls flex flex-row"}>
                <div className={'mr-4'}>
                    {!isRunning ? <Button variant={'contained'} onClick={startTimer}>Start</Button> : <Button variant={'contained'} onClick={pauseTimer}>Pause</Button>}
                </div>
                <div>
                    <Button variant={'contained'} onClick={resetTimer}>Reset</Button>
                </div>
            </div>
            <div>
                <img src={'https://unihockey-team-brunegg.ch/wp-content/uploads/2021/12/highflyers_logo_quadratisch_ohne_schrift.png'} className={'h-60 mt-20'} />
            </div>
            <div className={'absolute right-8 bottom-8 cursor-pointer'}>
                <Link href={`/matchview/${nextId}`} className={'absolute right-8 bottom-8 cursor-pointer'}>
                    <ArrowRight width={80} height={80} />
                </Link>
            </div>
        </div>
    );
};

export default MatchView;
