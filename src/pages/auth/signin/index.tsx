import LogoHeader from "@/components/LogoHeader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    IconButton,
    Divider,
    Link,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function SignInPage() {
    const navigate = useNavigate();
    const { login, isLoginPending } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "" });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    const validateForm = () => {
        const newErrors = { username: "", password: "" };
        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!username) {
            newErrors.username = "Please enter your email!";
            isValid = false;
        } else if (!emailRegex.test(username)) {
            newErrors.username = "Please enter a valid email address!";
            isValid = false;
        }

        if (!password) {
            newErrors.password = "Please enter your password!";
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters!";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await login(username, password);
            setSnackbar({
                open: true,
                message: "Login successful!",
                severity: "success",
            });
        } catch (error) {
            const errorMessage = error instanceof Error && 'response' in error 
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
                : error instanceof Error ? error.message : undefined;
            setSnackbar({
                open: true,
                message: errorMessage || "Invalid username or password.",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box
            className="h-screen flex flex-col bg-bg-light dark:bg-bg-dark justify-center items-center px-4 sm:px-0"
            sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Box sx={{ width: "100%", maxWidth: 545 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 4 }}>
                    <LogoHeader size="large" />
                    <IconButton onClick={() => navigate(-1)} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: 1,
                        borderColor: "#e0e0e0",
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>
                        Login to your account
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 3 }}>
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Email
                            </Typography>
                            <TextField
                                fullWidth
                                type="email"
                                placeholder="name@work-email.com"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={!!errors.username}
                                helperText={errors.username}
                                size="small"
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: 48,
                                    },
                                }}
                            />
                        </Box>

                        <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography variant="body2">Password</Typography>
                                <Link
                                    href="#"
                                    underline="none"
                                    sx={{ fontSize: "0.875rem", fontWeight: 500, cursor: "pointer" }}
                                >
                                    Forgot your password?
                                </Link>
                            </Box>
                            <TextField
                                fullWidth
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password}
                                size="small"
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: 48,
                                    },
                                }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isLoginPending}
                            sx={{ mt: 1, textTransform: "none", py: 1, height: 48 }}
                        >
                            {isLoginPending ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Sign in with Email"
                            )}
                        </Button>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}>
                            <Divider sx={{ flex: 1 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                OR
                            </Typography>
                            <Divider sx={{ flex: 1 }} />
                        </Box>

                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{ textTransform: "none", py: 1, display: "flex", gap: 1, height: 48 }}
                        >
                            <img src="/icon-google.png" alt="Google" style={{ width: 24, height: 24 }} />
                            <span>Sign in with Google</span>
                        </Button>
                    </Box>
                </Paper>

                <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
                    <Typography variant="body2" sx={{ display: "flex", gap: 0.5, pt: 1 }}>
                        <span>New to EvaliaX?</span>
                        <Link 
                            href="/auth/signup" 
                            underline="hover" 
                            sx={{ cursor: "pointer", fontWeight: 500 }}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/auth/signup");
                            }}
                        >
                            Create an account
                        </Link>
                    </Typography>
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}