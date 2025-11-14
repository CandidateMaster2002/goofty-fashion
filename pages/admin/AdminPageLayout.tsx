
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { Role } from '../../types';

export const AdminPageLayout: React.FC = () => {
    const { currentRole } = useAppData();

    if (currentRole === Role.Customer) {
        return <Navigate to="/" replace />;
    }

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
        </main>
    );
};
