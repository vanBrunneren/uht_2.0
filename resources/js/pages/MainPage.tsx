import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@mui/material';
import { Team } from '@/types/Team';

export default function MainPage({ teams } : { teams: Team[] }) {

    return(
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Teams</h1>
            <div className="flex flex-col">
                {teams.map((team) => (
                    <Link href={`/games/${team.id}`} key={team.id}>
                        <Card className="cursor-pointer transition-transform transform hover:scale-105 mb-6 shadow-lg ">
                            <CardContent className="p-4 text-center bg-gray-100">
                                <p className="text-lg font-medium">{team.name}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )

}
