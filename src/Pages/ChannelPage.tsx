import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/rootReducer';

import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Avatar,
    Container,
    Paper,
    Button,
    Divider
} from '@mui/material';
import { fetchChannelDetails, checkSubscriptionStatus, subscribeToChannel, unsubscribe } from '../api/youtubeApi';

import { toggleLocalSubscription } from '../redux/auth/authThunk';


const ChannelPage = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, token: accessToken, provider } = useSelector((state: RootState) => state.auth);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [channelDetails, setChannelDetails] = useState<any | null>(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const [isSubscribedState, setIsSubscribedState] = useState<boolean>(false);
    const [subscriptionIdState, setSubscriptionIdState] = useState<string | null>(null);
    const [subLoading, setSubLoading] = useState(false);

    useEffect(() => {
        const getDetails = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);
            try {
                const itemsArray = await fetchChannelDetails(id);
                if (itemsArray && itemsArray.length > 0) {
                    setChannelDetails(itemsArray[0]);
                } else {
                    setError("Channel details not found.");
                }
            } catch (error: any) {
                setError(error.message ?? "Failed to fetch channel details");
            } finally {
                setLoading(false);
            }
        };

        getDetails();
    }, [id]);


    useEffect(() => {
        async function initSubscriptionStatus() {
            if (!id) return;

            if (provider === "google" && accessToken) {
                try {
                    const res = await checkSubscriptionStatus(accessToken, id);
                    if (Array.isArray(res.items) && res.items.length) {
                        setIsSubscribedState(true);
                        setSubscriptionIdState(res.items[0].id || null);
                    } else {
                        setIsSubscribedState(false);
                        setSubscriptionIdState(null);
                    }
                } catch {
                    setIsSubscribedState(false);
                    setSubscriptionIdState(null);
                }
            } else if (provider === "local" && user && user.email) {
                const stored = localStorage.getItem("youstream_local_user:" + user.email);
                const persisted = stored ? JSON.parse(stored) : user;
                const subs = Array.isArray(persisted.subs) ? persisted.subs : [];
                setIsSubscribedState(subs.includes(id));
                setSubscriptionIdState(null);
            } else {
                setIsSubscribedState(false);
                setSubscriptionIdState(null);
            }
        }

        initSubscriptionStatus();
    }, [id, provider, accessToken, user]);


    const handleSubscribeToggle = async () => {
        if (!user || (!accessToken && provider !== "local")) {
            navigate("/login");
            return;
        }

        setSubLoading(true);
        try {
            const channelId = id;
            if (!channelId) return;
            if (provider === "google" && accessToken) {
                if (!isSubscribedState) {
                    const res = await subscribeToChannel(accessToken as string, channelId);
                    setSubscriptionIdState(res?.id ?? null);
                    setIsSubscribedState(true);
                } else {
                    if (subscriptionIdState) {
                        await unsubscribe(accessToken as string, subscriptionIdState);
                        setSubscriptionIdState(null);
                        setIsSubscribedState(false);
                    } else {
                        const s = await checkSubscriptionStatus(accessToken as string, channelId);
                        if (Array.isArray(s.items) && s.items.length) {
                            await unsubscribe(accessToken as string, s.items[0].id);
                        }
                        setIsSubscribedState(false);
                    }
                }
            }
            else if (provider === "local" && user && user.email) {
                await dispatch(toggleLocalSubscription(channelId) as any);
                const stored = localStorage.getItem("youstream_local_user:" + user.email);
                if (stored) {
                    const persisted = JSON.parse(stored);
                    const subs: string[] = Array.isArray(persisted.subs) ? persisted.subs : [];
                    setIsSubscribedState(subs.includes(channelId));
                } else {
                    setIsSubscribedState((prev) => !prev);
                }
            }
        } catch (err) {
            console.error("Subscribe toggle failed", err);
            alert("Failed to change subscription status. Please try again.");
        } finally {
            setSubLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!channelDetails) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography>No channel details available.</Typography>
            </Container>
        );
    }

    const { snippet, statistics, brandingSettings } = channelDetails;
    const channelName = snippet.title;
    const subscriberCount = Number(statistics?.subscriberCount || 0).toLocaleString();
    const description = snippet.description || "No description available.";
    const avatarUrl = snippet.thumbnails?.high?.url;
    const bannerUrl = brandingSettings?.image?.bannerExternalUrl;

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Button
                size="large"
                onClick={() => navigate(-1)}
                sx={{
                    mb: 2,
                    color: "black",
                    textTransform: "none",
                    fontWeight: 'bolder',
                    bgcolor: 'rgba(0,0,0,0.05)',
                    "&:hover": { backgroundColor: "lightgrey" },
                }}
            >
                Back
            </Button>
            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                {bannerUrl && (
                    <Box
                        sx={{
                            height: 200,
                            backgroundImage: `url(${bannerUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                )}

                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                        src={avatarUrl}
                        alt={channelName}
                        sx={{ width: 100, height: 100 }}
                    />
                    <Box>
                        <Typography variant="h4" fontWeight="bold">{channelName}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {subscriberCount} subscribers
                        </Typography>

                        <Button
                            onClick={handleSubscribeToggle}
                            disabled={subLoading}
                            variant="contained"
                            color={isSubscribedState ? "inherit" : "error"}
                            sx={{ mt: 1 }}
                        >
                            {subLoading ? <CircularProgress size={24} color="inherit" /> : (
                                isSubscribedState ? "Subscribed" : "Subscribe"
                            )}
                        </Button>

                    </Box>
                </Box>

                <Divider />

                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>About</Typography>
                    <Typography variant="body1" sx={{
                        maxHeight: isDescriptionExpanded ? 'none' : '6em',
                        overflow: 'hidden',
                        display: isDescriptionExpanded ? 'block' : '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: isDescriptionExpanded ? 'none' : 3,
                    }}>
                        {description}
                    </Typography>
                    {description.length > 150 && (
                        <Button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} sx={{ mt: 1 }}>
                            {isDescriptionExpanded ? 'Show less' : 'Show more'}
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ChannelPage;
