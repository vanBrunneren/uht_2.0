interface Team {
    name: string;
}

export default function Teams({ teams } : { teams: Team[] }) {

    return (
        <div>
            <h1>Teams</h1>
            {teams.map((team) => (
                <div>{team.name}</div>
            ))}
        </div>
    );

}
