import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import { useNavigate } from "react-router-dom";

const NoMatchFoundRoute = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)", 
        display: "flex",
        flexDirection:'row',
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            width: 120,
            height: 120,
            flexShrink: 0,
          }}
        >
          <SentimentDissatisfiedOutlinedIcon sx={{ fontSize: 56 }}  />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Page not found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            The page you're looking for doesn't exist or has been moved. Please return to the homepage.
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              size="small"
              sx={{ px: 2,
               }}
            >
              Go to Home
            </Button>
          </Box>
        </Box>
    </Box>
  );
};

export default NoMatchFoundRoute;