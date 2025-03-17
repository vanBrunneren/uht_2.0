import { Category } from '@/types/Category';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@mui/material';


export default function Categories({ categories }: {categories: Category[]}) {

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Kategorien</h1>
            <div className="flex flex-col">
                {categories.map((category) => (
                    <Link href={`/admin/games/${category.id}`} key={category.id}>
                        <Card className="cursor-pointer transition-transform transform hover:scale-105 mb-12 shadow-lg ">
                            <CardContent className="p-4 text-center bg-gray-100">
                                <p className="text-lg font-medium">{category.name}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );

}
