'use client'
import { useState } from 'react';

export default function ClientCounter() {
    const [count, setCount] = useState(0);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">Client Side Counter</h2>
            <p className="text-xl text-gray-700 mt-4">Count: {count}</p>
            <button className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700" onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}