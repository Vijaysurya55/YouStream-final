import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, Grid, Skeleton } from "@mui/material";
import { searchVideos } from "../api/youtubeApi";
import Grids from "../Components/Grid";
import SearchTabs from "../Components/SearchTabs";


const SearchPage = () => {
  const { query } = useParams();

  const [videos, setVideos] = useState<any>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (!query) return;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await searchVideos(query);
        setVideos(res.videos);
        setNextPageToken(res.nextPageToken || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [query]);


  useEffect(() => {
    let scrolled = false;
    const threshold = 700;

    const onScroll = () => {
      if (scrolled) return;
      scrolled = true;

      requestAnimationFrame(async () => {
        try {
          if (loading || loadingMore || !nextPageToken) return;

          const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold;

          if (nearBottom) {
            setLoadingMore(true);
            try {
              const res = await searchVideos(query, nextPageToken);
              setVideos((prev: any) => [...prev, ...(res.videos)]);
              setNextPageToken(res.nextPageToken || null);
            } catch (err: any) {
              setError(err.message);
            } finally {
              setLoadingMore(false);
            }
          }
        } finally {
          scrolled = false;
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [nextPageToken, loading, loadingMore, query]);

  const loadSkeleton = () => {
    return Array.from({ length: 8 }).map((_, i) => (
      <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }} key={i}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Skeleton variant="rectangular" sx={{ width: "100%", pt: "56.25%", borderRadius: 3 }} />
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
      </Grid>
    ));
  }
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
      <Typography variant="h5" mb={2}>
        Search results for: <strong>{query}</strong>
      </Typography>
      <SearchTabs />

      {loading ? (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {loadSkeleton()}
        </Grid>
      ) : (
        videos.length > 0 && <Grids videos={videos} />
      )}

      {error && <Box color="error.main">Error: {error}</Box>}

      {loadingMore && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress size={22} />
        </Box>
      )}
    </Box>
  );
};

export default SearchPage;