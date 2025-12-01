import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginGoogle, loginLocal } from "../redux/auth/authThunk";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

export default function LoginPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);


  const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErr(null);

    const trimmedEmail = email.trim();
    const trimmedPass = pass.trim();
    if (!trimmedEmail) return setErr("Please enter email");
    if (!trimmedPass) return setErr("Please enter password");

    if (!isValidEmail(trimmedEmail)) {
        return setErr("Please enter a valid email address.");
    }

    if (!isValidPassword(trimmedPass)) {
        return setErr("Password must be at least 8 characters long.");
    }
    try {
      setLoading(true);
      const res = await dispatch(loginLocal(trimmedEmail, trimmedPass));
      setLoading(false);
      if (res) {
        setErr(res || "Login failed");
      } else {
          navigate("/"); 
      }
    } catch (error: any) {
      setLoading(false);
      setErr(error?.message || "Login failed");
    }
};

  const handleGoogleSuccess = async (response: any) => {
    const idToken = response?.credential;
    if (!idToken) {
      return;
    }
    const profile: any = jwtDecode(idToken);
    const tokenClient = window.google?.accounts?.oauth2?.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/youtube.force-ssl",
      callback: (tokenResp: any) => {
        const accessToken = tokenResp?.access_token;
        if (!accessToken) {
          return;
        }
        dispatch(loginGoogle({ email: profile.email, name: profile.name, idToken, accessToken }));
        navigate("/");
      }
    });
    tokenClient?.requestAccessToken();
  };

  const handleGoogleError = () => {
    setErr("Google sign-in was unsuccessful.");
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fafafa",
        p: 2,
      }}
    >
      <Paper sx={{ width: 460, maxWidth: "95%", p: 4, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Sign in to YouStream
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Welcome back — sign in to continue. You can also continue with a Google account.
        </Typography>

        <form onSubmit={submit} noValidate>
          <TextField
            label="Email"
            size="small"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            size="small"
            fullWidth
            margin="normal"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          {err && (
            <Typography color="error" fontSize={13} mt={1}>
              {err}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.6, borderRadius: 6 }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Log in"}
          </Button>
        </form>

        <Box textAlign="center" mt={3} mb={1} color="text.secondary">
          <Typography variant="body2">or continue with</Typography>
        </Box>

        <Box display="flex" justifyContent="center" mb={2}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} shape="rectangular" type="standard" size="large" theme="outline" />
        </Box>

        <Box mt={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} gap={1}>
          <Typography variant="body2">No account?</Typography>
          <Button component={Link} to="/signup" variant="text" size="small">
            Create account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}