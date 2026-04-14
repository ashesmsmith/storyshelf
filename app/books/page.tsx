import { Suspense } from 'react';
import BooksClient from './BooksClient';

export default async function Page() {
    return (
        <Suspense fallback={<p className="p-6">Loading...</p>}>
            <BooksClient />
        </Suspense>
    );
}
