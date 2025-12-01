import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Skeleton, Button, Divider } from "@mui/material";
import moment from "moment";
import {
  getVideoDetails,
  getRelatedVideos,
  rateVideo,
  checkSubscriptionStatus,
  subscribeToChannel,
  unsubscribe,
} from "../api/youtubeApi";
import RelatedVideoItem from "../Components/RelatedVideoItem";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { updateLocalUserLikes, toggleLocalSubscription } from "../redux/auth/authThunk";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/rootReducer";

const VideoSkeleton = () => (
  <Box>
    <Skeleton variant="rectangular" sx={{ width: "100%", pt: "56.25%", borderRadius: 1 }} />
    <Box sx={{ mt: 2 }}>
      <Skeleton width="60%" height={28} />
      <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Skeleton variant="rectangular" width={96} height={36} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={36} height={36} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={96} height={36} sx={{ borderRadius: 2 }} />
      </Box>
      <Skeleton variant="text" height={16} sx={{ mt: 2 }} />
      <Skeleton variant="text" height={16} width="95%" />
      <Skeleton variant="text" height={16} width="85%" />
    </Box>
  </Box>
);

const RelatedSkeletonList = ({ count = 6 }) => {
  const items = Array.from({ length: count });
  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {items.map((_, i) => (
        <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Skeleton variant="rectangular" width={120} height={68} sx={{ borderRadius: 1 }} />
          <Box sx={{ minWidth: 0, width: "100%" }}>
            <Skeleton width="80%" height={18} />
            <Skeleton width="60%" height={14} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const WatchPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token: accessToken, provider } = useSelector((state: RootState) => state.auth);

  const initialRating = user?.likes?.[id] || "none";
  const [userRating, setUserRating] = useState(initialRating);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const [video, setVideo] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSubscribedState, setIsSubscribedState] = useState<boolean>(false);
  const [subscriptionIdState, setSubscriptionIdState] = useState<string | null>(null);
  const [subLoading, setSubLoading] = useState(false);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  useEffect(() => {
    setUserRating(user?.likes?.[id] || "none");
  }, [user, id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const video = await getVideoDetails(id);
        setVideo(video);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load video");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoadingRelated(true);
      try {
        const items = await getRelatedVideos(id, 12);
        const filtered = items.filter((video: any) => video.id !== id);
        setRelated(filtered);
      } catch (err) {
        console.error("related error", err);
      } finally {
        setLoadingRelated(false);
      }
    })();

  }, [id]);

  useEffect(() => {
    async function initSubscription() {
      const channelId = video?.snippet?.channelId;
      if (!channelId) return;

      if (provider === "google" && accessToken) {
        try {
          const res = await checkSubscriptionStatus(accessToken, channelId);
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
      } else if (provider === "local" && user) {
        const stored = localStorage.getItem("youstream_local_user:" + user.email);
        const persisted = stored ? JSON.parse(stored) : user;
        const subs = Array.isArray(persisted.subs) ? persisted.subs : [];
        setIsSubscribedState(subs.includes(channelId));
        setSubscriptionIdState(null);
      } else {
        setIsSubscribedState(false);
        setSubscriptionIdState(null);
      }
    }

    initSubscription();
  }, [video, provider, accessToken, user]);

  const handleRating = async (rating: any) => {
    if (!user || (!accessToken && provider !== "local")) {
      navigate("/login");
      return;
    }

    setIsLoadingAction(true);

    try {
      if (provider === "google" && accessToken) {
        await rateVideo(accessToken, id, rating);
      } else if (provider === "local" && user) {
        await dispatch(updateLocalUserLikes(id, rating) as any);
      } else {
        navigate("/login");
        return;
      }

      setUserRating(rating);
    } catch (error: any) {
      console.error(error?.message ?? error);
      alert("Failed to update rating.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleSubscribeToggle = async () => {
    if (!user || (!accessToken && provider !== "local")) {
      navigate("/login");
      return;
    }

    setSubLoading(true);
    try {
      const snippet = video?.snippet || {};
      const channelId = snippet.channelId;
      if (!channelId) {
        alert("Channel information not available yet.");
        return;
      }

      if (provider === "google" && accessToken) {
        if (!isSubscribedState) {
          const res = await subscribeToChannel(accessToken as string, channelId);
          const newId = res?.id ?? null;
          setIsSubscribedState(true);
          setSubscriptionIdState(newId);
          try {
            localStorage.setItem(`yst_sub_${channelId}`, JSON.stringify({ subscriptionId: newId }));
          } catch { }
        } else {
          if (subscriptionIdState) {
            await unsubscribe(accessToken as string, subscriptionIdState);
            setIsSubscribedState(false);
            setSubscriptionIdState(null);
            try {
              localStorage.removeItem(`yst_sub_${channelId}`);
            } catch { }
          } else {
            try {
              const s = await checkSubscriptionStatus(accessToken as string, channelId);
              if (Array.isArray(s.items) && s.items.length) {
                const sid = s.items[0].id;
                await unsubscribe(accessToken as string, sid);
              }
            } catch (e) { }
            setIsSubscribedState(false);
            setSubscriptionIdState(null);
            try {
              localStorage.removeItem(`yst_sub_${channelId}`);
            } catch { }
          }
        }
      } else if (provider === "local" && user) {
        await dispatch(toggleLocalSubscription(channelId) as any);
        try {
          const stored = localStorage.getItem("youstream_local_user:" + user.email);
          if (stored) {
            const persisted = JSON.parse(stored);
            const subs: string[] = Array.isArray(persisted.subs) ? persisted.subs : [];
            setIsSubscribedState(subs.includes(channelId));
          } else {
            setIsSubscribedState((prev) => !prev);
          }
        } catch {
          setIsSubscribedState((prev) => !prev);
        }
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Subscribe toggle failed", err);
      alert("Failed to change subscription. Try again.");
    } finally {
      setSubLoading(false);
    }
  };

  const openRelated = (videoId: string) => {
    navigate(`/watch/${videoId}`);
    window.scrollTo(0, 0);
  };

  const formatViews = (nStr: string | number | undefined) => {
    const n = Number(nStr || 0);
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M views";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K views";
    return n + " views";
  };
  const formatLikes = (nStr: string | number | undefined) => {
    const n = Number(nStr || 0);
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return n + " likes";
  };

  if (!id) return <Box p={2}>No video selected</Box>;

  if (loading) {
    return (
      <Box
        p={2}
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "minmax(0, 3fr) minmax(0, 1fr)" }}
        gap={2}
        alignItems="start"
      >
        <Box sx={{ minWidth: 0 }}>
          <VideoSkeleton />
        </Box>

        <Box sx={{ minWidth: 0, maxWidth: 480 }}>
          <Typography variant="subtitle1" mb={1}>
            Related
          </Typography>
          <RelatedSkeletonList count={8} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!video) {
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
        <Typography>No video data</Typography>
      </Box>
    );
  }

  const snippet = video.snippet || {};
  const stats = video.statistics || {};

  return (
    <Box
      p={2}
      display="grid"
      gridTemplateColumns={{ xs: "1fr", md: "minmax(0, 3fr) minmax(0, 1fr)" }}
      gap={2}
      alignItems="start"
    >

      <Box sx={{ minWidth: 0 }}>
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
        <Box
          sx={{
            position: "relative",
            paddingTop: "56.25%",
            background: "#000",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <iframe
            title={snippet.title || "video player"}
            src={`https://www.youtube.com/embed/${id}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
            allowFullScreen
          />
        </Box>

        <Typography variant="h6" mt={2} sx={{ fontWeight: 700 }}>
          {snippet.title}
        </Typography>

        <Box display="flex" gap={2} alignItems="center" mt={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2">{snippet.channelTitle}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatViews(stats.viewCount)} • {moment(snippet.publishedAt).fromNow()}
            </Typography>
          </Box>

          <Box marginLeft="auto" display="flex" gap={1} alignItems="center">
            <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
              <Button
                sx={{
                  color: userRating === "like" ? "black" : "grey",
                }}
                onClick={() => handleRating(userRating === "like" ? "none" : "like")}
                disabled={isLoadingAction}
                startIcon={<ThumbUp />}
                variant="text"
              >
                <Typography variant="subtitle2">{formatLikes(stats.likeCount)}</Typography>
              </Button>
            </Box>
            <Button
              sx={{
                color: userRating === "dislike" ? "black" : "grey",
              }}
              onClick={() => handleRating(userRating === "dislike" ? "none" : "dislike")}
              disabled={isLoadingAction}
              startIcon={<ThumbDown />}
              variant="text"
            />
            <Button color={isSubscribedState ? "inherit" : "error"} variant={"contained"} onClick={handleSubscribeToggle} disabled={subLoading}>
              {isSubscribedState ? "Subscribed" : "Subscribe"}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" sx={{
          whiteSpace: "pre-line",
          maxHeight: isDescriptionExpanded ? 'none' : '6em',
          overflow: 'hidden',
        }}>
          {snippet.description}
        </Typography>
        {snippet.description.length > 200 && (
          <Button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            sx={{ mt: 1, textTransform: 'none' }}
          >
            {isDescriptionExpanded ? 'Show less' : 'Show more'}
          </Button>
        )}
      </Box>

      <Box sx={{ minWidth: 0, maxWidth: 480 }}>
        <Typography variant="subtitle1" mb={1}>
          Related
        </Typography>

        {loadingRelated && <RelatedSkeletonList count={6} />}

        {!loadingRelated && related.length === 0 && <Typography>No related videos found</Typography>}

        {!loadingRelated && related.length > 0 && (
          <Box
            sx={{
              maxHeight: "calc(100vh - 80px)",
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": {
                display: "none",
              },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              "& .related-title": {
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                whiteSpace: "normal",
              },
            }}
          >
            {related.map((video, index) => (
              <RelatedVideoItem key={index} video={video} onClick={openRelated} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default WatchPage;