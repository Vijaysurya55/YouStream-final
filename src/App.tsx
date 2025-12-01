import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import Homepage from './Pages/HomePage'
const SearchPage = lazy(() => import('./Pages/SearchPage'))
// import SearchPage from './Pages/SearchPage'
const ChannelSearchPage = lazy(() => import('./Pages/ChannelSearchPage'))
// import ChannelSearchPage from './Pages/ChannelSearchPage'
const WatchPage = lazy(() => import('./Pages/WatchPage'))
// import WatchPage from './Pages/WatchPage'
const LoginPage = lazy(() => import('./Pages/LoginPage'))
// import LoginPage from './Pages/LoginPage'
const SignupPage = lazy(() => import('./Pages/SignupPage'))
// import SignupPage from './Pages/SignupPage'
const ProfilePage = lazy(() => import('./Pages/ProfilePage'))
// import NoMatchFoundRoute from './Pages/NoMatchFoundRoute'
const NoMatchFoundRoute = lazy(() => import('./Pages/NoMatchFoundRoute'))
const ChannelPage = lazy(()=> import('./Pages/ChannelPage'))
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { setAuth } from './redux/auth/authActions'
import { Box, CircularProgress } from '@mui/material'
function App() {
  const dispatch = useDispatch<any>();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem("youstream_current_auth");
      if (currentUser) {
        const parsed = JSON.parse(currentUser);
        if (parsed && (parsed.user || parsed.token || parsed.provider)) {
          dispatch(setAuth({ user: parsed.user, token: parsed.token ?? null, provider: parsed.provider ?? null }));
        }
      }
    } catch (e) {
      console.warn("Failed to restore user", e);
    } finally {
      setIsAuthInitialized(true);
    }
  }, []);


  if (!isAuthInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/search/videos/:query' element={<Suspense
          fallback={
            <Box
              display={"flex"}
              justifyContent={"center"}
              sx={{ mt: "220px" }}
            >
              <CircularProgress sx={{ color: "black" }} />
            </Box>
          }
        >
          <SearchPage />

        </Suspense>} />
        <Route path="/search/channels/:query" element={<Suspense
          fallback={
            <Box
              display={"flex"}
              justifyContent={"center"}
              sx={{ mt: "220px" }}
            >
              <CircularProgress sx={{ color: "black" }} />
            </Box>
          }
        >
          <ChannelSearchPage />

        </Suspense>} />
        <Route path="/watch/:id" element={
          <Suspense
            fallback={
              <Box
                display={"flex"}
                justifyContent={"center"}
                sx={{ mt: "220px" }}
              >
                <CircularProgress sx={{ color: "black" }} />
              </Box>
            }
          >
            <WatchPage />

          </Suspense>} />
        <Route path="/login" element={
          <Suspense
            fallback={
              <Box
                display={"flex"}
                justifyContent={"center"}
                sx={{ mt: "220px" }}
              >
                <CircularProgress sx={{ color: "black" }} />
              </Box>
            }
          >
            <LoginPage />

          </Suspense>} />
        <Route path="/signup" element={
          <Suspense
            fallback={
              <Box
                display={"flex"}
                justifyContent={"center"}
                sx={{ mt: "220px" }}
              >
                <CircularProgress sx={{ color: "black" }} />
              </Box>
            }
          >
            <SignupPage />

          </Suspense>} />
        <Route path='/profile' element={
          <Suspense
            fallback={
              <Box
                display={"flex"}
                justifyContent={"center"}
                sx={{ mt: "220px" }}
              >
                <CircularProgress sx={{ color: "black" }} />
              </Box>
            }
          >
            <ProfilePage />

          </Suspense>} />
        <Route path="/channel/:id" element={
          <Suspense
            fallback={
              <Box
                display={"flex"}
                justifyContent={"center"}
                sx={{ mt: "220px" }}
              >
                <CircularProgress sx={{ color: "black" }} />
              </Box>
            }
          >
            <ChannelPage />

          </Suspense>} />
        <Route path='*' element={
          <Suspense
            fallback={
              <Box
                display={"flex"}
                justifyContent={"center"}
                sx={{ mt: "220px" }}
              >
                <CircularProgress sx={{ color: "black" }} />
              </Box>
            }
          >
            <NoMatchFoundRoute />
          </Suspense>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App