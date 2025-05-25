// app/listening-tests/[id]/page.tsx

"use client";
import { useParams } from 'next/navigation';
import listeningTests from '../../../../../data/listening.json';
import ListeningTest from '@/components/TestComponent/listeningTest/ListeningTest';
import Link from 'next/link';

export default function ListeningTestPage() {
    const params = useParams();
    const testId = params.id as string;

    // Find the selected test
    const test = listeningTests.listeningTests.find(t => t.id === testId);

    if (!test) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl text-error">Test not found</h1>
                <Link href="/listening" className="btn btn-primary mt-4">
                    Back to Tests
                </Link>
            </div>
        );
    }

    return <ListeningTest test={test} />;
}