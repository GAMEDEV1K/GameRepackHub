'use client';

import { useParams } from 'next/navigation';

export default function GamePage() {
  const params = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Game Details</h1>
      <p>Game slug: {params.slug}</p>
    </div>
  );
}
