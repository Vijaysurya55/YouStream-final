import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrendingVideos } from '../redux/videos/videoActions';
import type { RootState } from '../redux/rootReducer';
import Grids from '../Components/Grid';
import { Box, Typography, Skeleton } from '@mui/material';
import CategoryList from '../Components/CategoryList';
import { fetchVideosByCategory } from '../api/youtubeApi';
import { setSelectedCategory } from '../redux/category/categoryActions.ts';

const SkeletonGrid = ({ count = 8 }) => {
    const items = Array.from({ length: count });
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" },
                gap: 2,
            }}
        >
            {items.map((_, i) => (
                <Box key={i} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Skeleton variant="rectangular" sx={{ width: "100%", pt: "56.25%", borderRadius: 1 }} />
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="60%" height={20} />
                </Box>
            ))}
        </Box>
    );
};

const Homepage = () => {

    const dispatch = useDispatch<any>()
    const selectedCategoryId = useSelector((state: RootState) => state.category.selectedId);
    const selectedCategory = useSelector((state: RootState) => state.category.selectedTitle);

    const [categoryVideos, setCategoryVideos] = useState([]);
    const [loadingCategoryVideos, setLoadingCategoryVideos] = useState(false);
    const [errorCategoryVideos, setErrorCategoryVideos] = useState(null);

    const store = useSelector((state: RootState) => state.videoState)

    useEffect(() => {

        if (store.trending.length === 0)
            dispatch(fetchTrendingVideos())
    }, [store.trending.length]);

    useEffect(() => {
        let scrolled = false
        const threshold = 700
        const onScroll = () => {
            if (scrolled) return
            scrolled = true
            requestAnimationFrame(() => {
                try {

                    if (store.loading || !store.nextPageToken) return
                    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold
                    if (nearBottom) {
                        dispatch(fetchTrendingVideos(store.nextPageToken))
                    }
                } finally {
                    scrolled = false
                }
            })
        }

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [store.loading]);

    useEffect(() => {
        if (!selectedCategoryId) return

        const loadCategoryVideos = async () => {
            setLoadingCategoryVideos(true)
            setErrorCategoryVideos(null)
            try {
                const videos = await fetchVideosByCategory(selectedCategoryId, 'US')
                setCategoryVideos(videos)
            } catch (err: any) {
                setErrorCategoryVideos(err.message)
            } finally {
                setLoadingCategoryVideos(false)
            }

        }

        loadCategoryVideos();
    }, [selectedCategoryId])
    
    const displayTrending = !selectedCategoryId


    const handleCategorySelect = useCallback((categoryId: string, category: string) => {
        dispatch(setSelectedCategory(categoryId || null, category || null));
    }, []);


    if (store.error) {
        return <div className="error">Error fetching videos: {store.error}</div>;
    }

    return (
        <Box padding={2} justifyContent={'center'}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',

            }}>
                <CategoryList
                    selectedCategoryId={selectedCategoryId}
                    onCategorySelect={handleCategorySelect} />
            </Box>
            {displayTrending ? (
                <>
                    <Typography variant="h5" gutterBottom>
                        Trending Videos
                    </Typography>

                    {store.loading && store.trending.length === 0 ? (
                        <SkeletonGrid count={8} />
                    ) : (
                        <Grids videos={store.trending} />
                    )}

                    {store.loading && store.trending.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <SkeletonGrid count={4} />
                        </Box>
                    )}
                </>
            ) : (
                <>
                    <Typography variant="h5" gutterBottom>
                        {selectedCategory || "Category"}
                    </Typography>

                    {loadingCategoryVideos ? (
                        <SkeletonGrid count={8} />
                    ) : errorCategoryVideos ? (
                        <Typography color="error">{errorCategoryVideos}</Typography>
                    ) : (
                        <Grids videos={categoryVideos} />
                    )}
                </>
            )}
        </Box>
    );
};


export default Homepage;