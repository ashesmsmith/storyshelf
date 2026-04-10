'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/actions';

export default function LogoutButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => {
                startTransition(async () => {
                    await logout();
                    router.refresh();
                });
            }}
            className="rounded-full border px-4 py-2 text-sm"
            disabled={isPending}
        >
            {isPending ? 'Logging out...' : 'Logout'}
        </button>
    );
}