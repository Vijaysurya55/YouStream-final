import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  CardMedia,
  Grid,
  Skeleton
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/rootReducer";
import { useNavigate } from "react-router-dom";
import { signOutAll } from "../redux/auth/authThunk";
import { getLikedVideos, getLikedVideosLocal, getSubscribedChannels, getSubscribedChannelsLocal } from "../api/youtubeApi";
import Grids from "../Components/Grid";

const ProfilePage = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const auth = useSelector((s: RootState) => s.auth);
  const user = auth?.user;
  const accessToken = auth?.token;
  const provider = auth?.provider

  const [likedVideos, setLikedVideos] = useState([]);
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  const [likedLoading, setLikedLoading] = useState(false);
  const [subscribedLoading, setSubscribedLoading] = useState(false)
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserLikedVideos = async () => {
      if (!user || (provider === 'google' && !accessToken)) {
        return;
      }
      setLikedLoading(true);
      setError(null);
      try {
        let videos = [];
        if (provider === "google") {
          const response = await getLikedVideos(accessToken!);
          videos = response.data?.items || [];

        } else if (provider === 'local') {
          videos = await getLikedVideosLocal(user.email);
        }

        setLikedVideos(videos);

      } catch (err: any) {
        console.error("Failed to fetch liked videos:", err);
        setError(err?.message ?? "Failed to fetch liked videos");
      } finally {
        setLikedLoading(false);

      }
    };

    fetchUserLikedVideos();

    const fetchUserSubscribedChannels = async () => {
      if (!user || (provider === 'google' && !accessToken)) {
        return;
      }
      setSubscribedLoading(true);

      setError(null);

      try {
        let channels = [];
        if (provider === 'google') {
          const response = await getSubscribedChannels(accessToken!);
          // console.log(response)
          channels = response.map((item: any) => {
            // console.log(item)
            return {
              id: item.snippet.resourceId.channelId,
              snippet: item.snippet,
            };
          }) || [];
          // console.log(channels)
        } else if (provider === 'local') {
          channels = await getSubscribedChannelsLocal(user.email);
        }

        setSubscribedChannels(channels);

      } catch (err: any) {
        console.error("Failed to fetch subscribed channels:", err);
        setError(err?.message ?? "Failed to fetch subscribed channels");
      } finally {
        setSubscribedLoading(false);
      }
    };
    fetchUserSubscribedChannels();

  }, [provider, user?.email, accessToken]);


  if (!user) return null;

  const email = user?.email || "";
  const name = user?.name || user?.email || "You";
  const avatar = user?.avatar || "";

  const handleSignOut = async () => {
    try {
      await dispatch(signOutAll());
      navigate("/");
    } catch (e) {
      console.error("Sign out failed", e);
    }
  };
  const loadSkeleton = () => {
    return (
      Array.from({ length: 16 }).map((_, i) => (
        <Box key={i} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Skeleton variant="rectangular" sx={{ width: "100%", pt: "56.25%", borderRadius: 1 }} />
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
      ))
    )
  }

  if (error)
    return (<Typography variant="h5">{error}</Typography>)

  return (
    <Box p={2}>
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
      <Card>
        <CardContent sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <Avatar src={avatar} sx={{ width: 84, height: 84, bgcolor: "primary.main" }}>
            {!avatar && (name || email).charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ minWidth: 0, flex: "1 1 auto" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button variant="outlined" color="inherit" onClick={() => navigate("/settings")}>
              Settings
            </Button>
            <Button variant="contained" color="primary" onClick={handleSignOut}>
              Sign out
            </Button>

          </Box>
        </CardContent>
      </Card>

      <Divider variant="fullWidth" sx={{ mt: 2, mb: 2 }} />
      <Typography variant="h5" gutterBottom>Liked Videos</Typography>
      {(likedLoading) && loadSkeleton()

      }
      {likedVideos.length > 0
        ? <Grids videos={likedVideos} />
        : <Typography variant="subtitle1" gutterBottom>No videos found</Typography>
      }


      <Divider variant="fullWidth" sx={{ mt: 2, mb: 2 }} />

      <Typography variant="h5" gutterBottom>Subscribed Channels</Typography>
      {(subscribedLoading) && loadSkeleton()
      }
      {
        subscribedChannels.length > 0
          ? <Grid container spacing={2}>
            {subscribedChannels.map((channel: any) => {
              const id = channel.id;
              const channelTitle = channel?.snippet?.title || "";
              const description = channel?.snippet?.description || ""

              const thumbnailUrl =
                channel?.snippet?.thumbnails?.high?.url ||
                channel?.snippet?.thumbnails?.medium?.url ||
                channel?.snippet?.thumbnails?.default?.url ||
                '';


              return (
                <Grid  size={{ xs: 12, sm: 12, md: 6, lg: 3 }} key={id}>
                  <Card
                    elevation={0}
                    onClick={() => navigate(`/channel/${id}`)}
                    role="button"
                    tabIndex={0}
                    sx={{
                      borderRadius: 3,
                      backdropFilter: "blur(6px)",
                      border: "lightgrey",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "scale(1.04)",
                        bgcolor: 'rgba(68, 68, 68, 0.10)'
                      },
                      outline: "none",
                      minHeight: 320,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={thumbnailUrl}
                      alt={channelTitle}
                      sx={{
                        width: "100%",
                        height: { xs: 180, sm: 200, md: 220 },
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0",
                      }}
                    />
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ color: "black" }}>
                        {channelTitle}
                      </Typography>

                      <Typography variant="subtitle2" sx={{
                        color: "rgba(68, 68, 68, 0.97)",
                      }} >
                        {description.length > 40 ? description.slice(0, 40) + '...seemore' : description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          : <Typography variant="subtitle1" gutterBottom>No channels found</Typography>

      }

    </Box>
  );
};

export default ProfilePage;
