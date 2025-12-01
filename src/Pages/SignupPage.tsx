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
import { signupLocal, loginGoogle } from "../redux/auth/authThunk";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function SignupPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    const strongPassRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return strongPassRegex.test(password);
  };

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErr(null);

    const trimmedEmail = email.trim();
    const trimmedPass = pass.trim();
    const trimmedConfirm = confirm.trim();
    if (!trimmedEmail) return setErr("Please enter email");
    if (!trimmedPass) return setErr("Please enter password");
    if (!trimmedConfirm) return setErr("Please confirm your password");

    if (!isValidEmail(trimmedEmail)) {
      return setErr("Please enter a valid email address.");
    }

    if (!isValidPassword(trimmedPass)) {
      return setErr("Password must be at least 8 characters long, contain one number, and one special character.");
    }

    if (trimmedPass !== trimmedConfirm) {
      return setErr("Passwords do not match");
    }

    try {
      setLoading(true);

      await dispatch(signupLocal(trimmedEmail, trimmedPass));
      setLoading(false);
      navigate(-1);

    } catch (error: any) {
      setLoading(false);
      setErr(error?.message || "Signup failed");
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    const idToken = response?.credential;
    if (!idToken) {
      setErr("Google sign-in failed (no credential).");
      return;
    }
    let decoded: any;
    try {
      decoded = jwtDecode(idToken);
    } catch (err) {
      console.error("Failed to decode ID token", err);
      setErr("Google sign-in failed (decode error).");
      return;
    }

    const profileEmail = decoded?.email;
    const profileName = decoded?.name;
    if (!profileEmail) {
      setErr("Could not decode email from Google response.");
      return;
    }

    const win: any = window;
    if (!win?.google?.accounts?.oauth2) {
      setErr("Google Identity library not loaded.");
      return;
    }

    const tokenClient = win.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/youtube.force-ssl",
      callback: (tokenResp: any) => {
        const accessToken = tokenResp?.access_token;
        if (!accessToken) {
          setErr("Failed to obtain access token from Google.");
          return;
        }
        dispatch(
          loginGoogle({
            email: profileEmail,
            name: profileName,
            idToken,
            accessToken,
          })
        );
        navigate(-1);
      },
    });

    tokenClient.requestAccessToken();
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
      <Paper sx={{ width: 460, maxWidth: "95%", p: 4 }} elevation={3}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Create an account
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Join YouStream — sign up with email or use Google to continue.
        </Typography>

        <form onSubmit={submit}>
          <TextField
            label="Name (optional)"
            size="small"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <TextField
            label="Confirm password"
            size="small"
            fullWidth
            margin="normal"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>

        <Box textAlign="center" mt={3} mb={1} color="text.secondary">
          <Typography variant="body2">or continue with</Typography>
        </Box>

        <Box display="flex" justifyContent="center" mb={2}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} shape="rectangular" type="standard" size="large" theme="outline" />
        </Box>

        <Box mt={2} display="flex" justifyContent="center" gap={1} sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="body2">Already have an account?</Typography>
          <Button component={Link} to="/login" variant="text" size="small">
            Sign in
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}