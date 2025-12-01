import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Typography, CircularProgress, Grid,
  Card,
  CardMedia,
  CardContent,
  Skeleton,
  Button
} from "@mui/material";
import { searchChannels } from "../api/youtubeApi";
import SearchTabs from "../Components/SearchTabs";

const ChannelSearchPage = () => {
  const { query } = useParams();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  useEffect(() => {
    if (!query) return;
    (async () => {
      setLoading(true);
      try {
        const res = await searchChannels(query);
        setChannels(res.channels);
      } catch (error: any) {
        setError(error || "Error fetching channels")
      }
      finally {
        setLoading(false);
      }
    })();

  }, [query]);
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
        Channels related to: <strong>{query}</strong>
      </Typography>
      <SearchTabs />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {loading ? loadSkeleton() : (
          channels.map((channel: any) => {
            const id = channel?.id?.channelId;
            const channelTitle = channel?.snippet?.title || "";
            const description = channel?.snippet?.description || "";

            const thumbnailUrl =
              channel?.snippet?.thumbnails?.high?.url ||
              channel?.snippet?.thumbnails?.medium?.url ||
              channel?.snippet?.thumbnails?.default?.url ||
              '';

            return (
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }} key={id}>
                <Card
                  elevation={0}
                  onClick={() => navigate(`/channel/${id}`)}
                  role="button"
                  tabIndex={0}
                  sx={{
                    borderRadius: 3,
                    backdropFilter: "blur(6px)",
                    border: "1px solid lightgrey",
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
                    <Typography variant="subtitle2" sx={{ color: "rgba(68, 68, 68, 0.97)", }} >
                      {description.length > 20 ? description.slice(0, 40) + '...seemore' : description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
};

export default ChannelSearchPage;