import React, { lazy, Suspense, useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Button,
    TextField,
    InputAdornment,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../assets/YouStream.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/rootReducer";
const SideDrawer = lazy(() => import("./SideDrawer"))

import { signOutAll } from "../redux/auth/authThunk";

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const [query, setQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const [drawerOpen, setDrawerOpen] = useState(false)

    const auth = useSelector((s: RootState) => s.auth);
    const user = auth?.user;


    const doSearch = () => {
        const typed = query.trim();
        if (!typed) return;
        navigate(`/search/videos/${encodeURIComponent(typed)}`);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") doSearch();
    };

    const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const closeMenu = () => setAnchorEl(null);

    const handleSignOut = async () => {
        try {
            await dispatch(signOutAll());
            closeMenu();
            navigate("/");
        } catch (e) {
            console.error("signout error", e);
        }
    };

    const clearSearch = () => {
        if (query.trim())
            setQuery("")
        navigate('/')
    }

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    }

    const avatarLabel = user?.name || user?.email || "";

    return (
        <>
            <AppBar position="fixed" sx={{ bgcolor: "white", color: "black", boxShadow: 1, width: "100%" }} >
                <Toolbar sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
                    <IconButton onClick={handleDrawerToggle} size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
                        <MenuIcon />
                    </IconButton>

                    <Box onClick={clearSearch}
                        sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "inherit", mr: 2
                        }}>
                        <Box component="img" src={logo} alt="YouStream" sx={{ width: { xs: 36, sm: 48 }, height: { xs: 36, sm: 48 }, borderRadius: 1 }} />
                        {!isSmall && <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>YouStream</Typography>}
                    </Box>

                    <Box sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        px: 1
                    }}>
                        <Box sx={{
                            width: { xs: "100%", sm: "70%", md: "50%" },
                            maxWidth: 800,
                        }}>
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                bgcolor: "white",
                                borderRadius: 5,
                                border: 1,
                                borderColor: 'lightgrey'

                            }}>
                                <TextField
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    placeholder="Search"
                                    size="small"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        sx: { borderRadius: 5, "& .MuiOutlinedInput-notchedOutline": { border: "none" }, px: 1, py: { xs: 0.5, sm: 1 } },
                                        endAdornment: (<InputAdornment position="end"></InputAdornment>),
                                    }}
                                />
                                <IconButton onClick={doSearch} sx={{ px: 2 }}>
                                    <SearchIcon sx={{ color: "grey" }} />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ ml: 1, display: "flex", alignItems: "center", gap: 1 }}>

                        {!user && (
                            <Button component={Link} to="/login" variant="text" size="small">
                                Login
                            </Button>
                        )}

                        {user && (
                            <>
                                <Tooltip title={avatarLabel}>
                                    <IconButton onClick={openMenu} size="small" sx={{ ml: 1 }}>
                                        <Avatar src={""} alt={user.name || user.email}>
                                            {(user.name || user.email).charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>

                                <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} PaperProps={{ sx: { minWidth: 180 } }}>
                                    <MenuItem onClick={() => { closeMenu(); navigate("/profile"); }}>Profile</MenuItem>
                                    <MenuItem onClick={() => { closeMenu(); navigate("/settings"); }}>Settings</MenuItem>
                                    <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                    <Suspense fallback={<div></div>}>
                        {drawerOpen && (
                            <SideDrawer
                                open={drawerOpen}
                                onClose={handleDrawerToggle}
                            />
                        )}
                    </Suspense>
                </Toolbar>
            </AppBar>

            <Toolbar />
        </>
    );
}