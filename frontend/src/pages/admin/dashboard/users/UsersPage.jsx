import { lazy, Suspense } from 'react';
import Loading from '../../../../components/Loading';
import { Users } from "../../../../components/admin/dashboard/users/Users";

// const Users = lazy(() => import ('../../../../components/admin/dashboard/users/Users'));

export default function UsersPage() {
    return (
        <Suspense fallback={<Loading />}>
            <Users />
        </Suspense>
    );
};
