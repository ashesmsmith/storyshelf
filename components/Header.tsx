import { getCurrentUser } from '@/lib/utils/getCurrentUser';
import HeaderClient from './HeaderClient';

export default async function Header() {
    const user = await getCurrentUser();

    return <HeaderClient user={user} />;
}
