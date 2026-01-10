import React from 'react';
import { Card, CardContent, CardHeader } from './ui/Card';

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div>
                <div className="h-8 w-48 bg-accent rounded" />
                <div className="h-3 w-32 bg-accent rounded mt-2" />
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <div className="h-3 w-24 bg-accent rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-32 bg-accent rounded" />
                            <div className="h-3 w-20 bg-accent rounded mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <Card className="col-span-4 h-[400px]">
                    <CardHeader>
                        <div className="h-4 w-32 bg-accent rounded" />
                    </CardHeader>
                    <CardContent className="h-full bg-accent/10 m-4 rounded" />
                </Card>
                <Card className="col-span-3 h-[400px]">
                    <CardHeader>
                        <div className="h-4 w-32 bg-accent rounded" />
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 bg-accent/20 rounded" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
