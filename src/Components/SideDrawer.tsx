import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, Typography, Button, Stack, Skeleton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import logo from "../assets/YouStream.jpg";
import { fetchCategories } from "../api/youtubeApi";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCategory } from "../redux/category/categoryActions.ts";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "../redux/rootReducer";
import { signOutAll } from "../redux/auth/authThunk";

interface Props {
    open: boolean;
    onClose: () => void;
}

const SideDrawer = ({ open, onClose }: Props) => {
    const [categories, setCategories] = useState<{ id: string; title: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const [category, setCategory] = useState("")

    const auth = useSelector((s: RootState) => s.auth);
    const user = auth?.user;

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const categories = await fetchCategories();
                const assignableCategories = Array.isArray(categories)
                    ? categories.filter((category: any) => category?.snippet?.assignable)
                    : [];
                const maxItems = 10;
                const list = assignableCategories.slice(0, maxItems).map((category: any) => ({
                    id: category.id,
                    title: category.snippet?.title ?? "Unknown",
                }));
                setCategories(list);
            } catch (err) {
                console.warn("Failed fetching categories", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleClickCategory = (id: string, title: string) => {
        setCategory(title)
        dispatch(setSelectedCategory(id || null, title || null));
        onClose();
        navigate("/", { replace: true });
    };

    const handleLogout = async () => {
        try {
            await dispatch(signOutAll());
        } catch (e) {
            console.error("logout failed", e);
        } finally {
            onClose();
            navigate("/", { replace: true });
        }
    };


    return (
        <div>
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width: { xs: 240, sm: 280, md: 300 },
                        background: "white",
                        backdropFilter: "blur(6px)",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        px: 2,
                        py: 1.25,
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <IconButton onClick={onClose} size="small" aria-label="close">
                                <MenuIcon />
                            </IconButton>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar src={logo} alt="YouStream" sx={{ width: 42, height: 42 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    YouStream
                                </Typography>
                            </Box>


                        </Box>
                        <Box>
                            {user ? (
                                <Stack spacing={0.3}>
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                        Hi, {user.name ? user.name.split(" ")[0].charAt(0).toUpperCase() + user.name.split(" ")[0].slice(1) : user.email}
                                    </Typography>

                                </Stack>
                            ) : (
                                <Stack spacing={0.3}>
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                        Hi, there stranger
                                    </Typography>

                                    <Button
                                        component={Link}
                                        to="/login"
                                        size="small"
                                        onClick={onClose}
                                        sx={{
                                            color: "primary.main",
                                            p: 0,
                                            minWidth: 0,

                                        }}
                                    >
                                        Login
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: "lightgrey", mb: 1 }} />

                    <List sx={{ mb: 1 }}>
                        
                        <ListItem 
                            sx={{
                                px: 0,
                                py: 1,
                                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                                transition: "0.2s",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                navigate('/profile')
                                onClose();
                            }}
                        >
                            
                            <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItem>
                    </List>

                    <Divider sx={{ borderColor: "lightgrey", mb: 1 }} />

                    <Typography
                        variant="subtitle2"
                        sx={{
                            textAlign: "center",
                            mb: 1,
                            letterSpacing: 1.5,
                            color: "rgba(0,0,0,0.6)",
                        }}
                    >
                        EXPLORE
                    </Typography>

                    <Box sx={{
                        flex: 1,
                        overflowY: "auto",
                        pr: 1,
                        scrollBehavior: "smooth",
                        "&::-webkit-scrollbar": { display: "none" },
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                    }}>
                        <List>
                            {loading && Array.from({length:16}).map(()=>(
                                <>
                                    <ListItem><Skeleton variant="text" width="100%" /></ListItem>
                                </>
                            ))}

                            {!loading &&
                                categories.map((cat) => (
                                    <ListItem
                                        key={cat.id}
                                        sx={{
                                            bgcolor: category === cat.title ? "rgba(0,0,0,0.06)" : "white",
                                            px: 0,
                                            py: 1,
                                            "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                                            transition: "0.15s",
                                            cursor: "pointer",

                                        }}
                                        onClick={() => handleClickCategory(cat.id, cat.title)}
                                    >
                                        <ListItemText primary={cat.title} />
                                    </ListItem>
                                ))}

                            {!loading && categories.length === 0 && (
                                <ListItem>
                                    <ListItemText primary="No categories found" />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                    <Divider sx={{ borderColor: "lightgrey", mb: 1 }} />
                    {user &&

                        <Button
                            onClick={handleLogout}
                            size="small"
                            sx={{
                                color: "black",
                                p: 0,
                                minWidth: 0,

                            }}
                        >
                            LOGOUT
                        </Button>
                    }
                </Box>
            </Drawer>
        </div>
    );
};

export default SideDrawer;