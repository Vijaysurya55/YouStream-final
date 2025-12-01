import React from "react";
import { Grid, } from "@mui/material";
import moment from "moment";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = { videos: any[] }

const Grids = ({ videos }: Props) => {
  const navigate = useNavigate();

  const displayDate = (date: string) => {
    const momentObject = moment(date);
    return momentObject.fromNow();
  }

  const displayViews = (views: string) => {
    const dispViews = Number(views || 0);
    if (dispViews >= 1000000) {
      return (dispViews / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (dispViews >= 1000) {
      return (dispViews / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return dispViews.toString();
  }

  const openWatch = (id: string) => {

    navigate(`/watch/${encodeURIComponent(id)}`);

    window.scrollTo(0, 0);
  }

  return (
    <Grid container spacing={2}>
      {videos.map((video: any) => {
        const id = video.id
        const thumbnailUrl =
          video?.snippet?.thumbnails?.maxres?.url ||
          video?.snippet?.thumbnails?.high?.url ||
          video?.snippet?.thumbnails?.medium?.url ||
          video?.snippet?.thumbnails?.default?.url ||
          '';

        const title = video?.snippet?.title || "Untitled";
        const channelTitle = video?.snippet?.channelTitle || "";
        const viewCount = video?.statistics?.viewCount ?? 0;
        const publishedAt = video?.snippet?.publishedAt || "";

        return (
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }} key={id}>
            <Card
            elevation={0}
              onClick={() => openWatch(String(id))}
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
              }}
            >
              <CardMedia
                component="img"
                image={thumbnailUrl}
                alt={title}
                sx={{
                  width: "100%",
                  height: { xs: 180, sm: 200, md: 220 },
                  objectFit: "cover",
                  borderRadius: "8px 8px 0 0",
                }}
              />
              <CardContent sx={{
                p: { xs: 1.5, sm: 2 },

              }}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ color: "black" }}>
                  {title}
                </Typography>

                <Typography variant="subtitle2" sx={{ color: "rgba(68, 68, 68, 0.97)" }} noWrap>
                  Channel: {channelTitle}
                </Typography>

                <Typography variant="subtitle2" sx={{ color: "grey" }} noWrap>
                  {displayViews(String(viewCount))} views • {displayDate(publishedAt)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default Grids;