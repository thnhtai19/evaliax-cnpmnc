import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { Box, CircularProgress } from '@mui/material';

interface GuestRouteProps {
    children: React.ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

