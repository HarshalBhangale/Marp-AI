"use client";

import { useEffect, useState } from 'react';

export function RemainingCredits() {
    const [credits, setCredits] = useState<{remaining: number, total: number} | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCredits() {
            try {
                const response = await fetch('/api/credits', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch credits');
                }
                
                setCredits(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching credits:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch credits');
            } finally {
                setLoading(false);
            }
        }

        fetchCredits();
    }, []);

    if (loading) return <div className="text-sm text-muted-foreground">Loading credits...</div>;
    if (error) return <div className="text-sm text-red-500">Error: {error}</div>;
    if (!credits) return null;

    return (
        <div className="text-sm text-muted-foreground">
            Used credits: {credits.remaining.toLocaleString()} / {credits.total.toLocaleString()}
        </div>
    );
}