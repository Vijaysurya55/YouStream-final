import React, { useEffect, useState, useRef } from "react";
import { fetchCategories } from "../api/youtubeApi";
import {
  Chip,
  Box,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Props {
  selectedCategoryId: string | null;
  onCategorySelect: (id: string, title: string) => void;
}

const CategoryList = ({ selectedCategoryId, onCategorySelect }: Props) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);


  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCategories = await fetchCategories();

        const assignable = Array.isArray(fetchedCategories) ? fetchedCategories.filter((cat: any) => cat?.snippet?.assignable) : [];
        setCategories(assignable);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load categories");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const current = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -200 : 200;

      current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
      }
    };

    scrollContainerRef.current?.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      scrollContainerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [categories, loading]);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="120px">
        <CircularProgress size={20} />
        <Typography variant="body2" sx={{ marginLeft: 2 }}>
          Loading categories...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <Box sx={{ padding: 2, color: "error.main" }}>Error fetching data: {error}</Box>;
  }

  const allSelected = selectedCategoryId === null || selectedCategoryId === "";

  return (
    <Box sx={{ width: "100%", py: 1, bgcolor: "transparent" }}>
      <Box sx={{
        maxWidth: 1200,
        mx: "auto",
        position: "relative",
        px: { xs: 1, sm: 2 },
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}>

        <IconButton
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          sx={{ display: 'inline-flex', zIndex: 1, color: "black" }}
          aria-label="scroll left"

        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Box

          ref={scrollContainerRef}
          data-testid="scroll-container"
          sx={{
            overflowX: "auto",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              py: 1,
              flexWrap: "nowrap",
            }}
          >
            <Chip
              key={"all"}
              label={"All"}
              onClick={() => onCategorySelect("", "")}
              clickable
              color={allSelected ? "primary" : "default"}
              variant="filled"
              sx={{
                minWidth: 88,
                px: 2,
                py: 1,
                fontWeight: allSelected ? 700 : 500,
                bgcolor: allSelected ? "black" : "lightgrey",
                color: allSelected ? "white" : "black",
                borderRadius: 6,
                whiteSpace: "nowrap",
                flex: "0 0 auto",
                "&:hover": {
                  bgcolor: "black",
                  color: "white",
                },
              }}
            />

            {categories.map((category) => {
              const id = category.id;
              const title = category.snippet?.title ?? "Unknown";
              const selected = selectedCategoryId === id;
              return (
                <Chip
                  key={id}

                  label={title}
                  onClick={() => onCategorySelect(id, title)}
                  aria-pressed={selected}
                  clickable
                  variant="filled"
                  sx={{
                    minWidth: 88,
                    px: 2,
                    py: 1,
                    fontWeight: selected ? 700 : 500,
                    bgcolor: selected ? "black" : "lightgrey",
                    color: selected ? "white" : "black",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                    flex: "0 0 auto",
                    "&:hover": {
                      bgcolor: "black",
                      color: "white",
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        <IconButton
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          sx={{ display: 'inline-flex', zIndex: 1, color: "black" }}
          aria-label="scroll right"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

      </Box>
    </Box>
  );
};

export default CategoryList;
