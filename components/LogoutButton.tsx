'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/actions';
import { emitCartUpdate } from '@/lib/utils/cartEvents';

export default function LogoutButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => {
                startTransition(async () => {
                    await logout();
                    emitCartUpdate();
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
