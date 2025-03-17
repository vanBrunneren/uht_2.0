import { Card, CardContent } from '@mui/material';
import { Game } from '@/types/Game';
import { formatInTimeZone } from 'date-fns-tz';

export default function GamesByTeam({ games } : { games: Game[] }) {

    return(
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Spiele</h1>
            <div className="flex flex-col">
                {games.map((game) => (
                    <Card className="cursor-pointer transition-transform transform hover:scale-105 mb-6 shadow-lg" key={game.id}>
                        <CardContent className="p-4 text-center bg-gray-100 text-3xl">
                            <p className="font-medium mb-4">
                                {formatInTimeZone(game.start_datetime, 'Europe/Zurich', 'HH:mm')}
                            </p>
                            <div className="font-medium flex flex-row flex-1">
                                <div className={'flex flex-1 justify-end mr-4 mb-4'}>
                                    {game.team1?.name}
                                </div>
                                <div>
                                    -
                                </div>
                                <div className={'flex flex-1 justify-start ml-4'}>
                                    {game.team2?.name}
                                </div>
                            </div>
                            <p className="font-medium">
                                {game.team_1_goals} - {game.team_2_goals}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )

}
