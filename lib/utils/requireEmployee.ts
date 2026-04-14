import { redirect } from 'next/navigation';
import { getCurrentUser } from './getCurrentUser';

export async function requireEmployee() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    if (user.role !== 'employee') {
        redirect('/');
    }

    return user;
}
