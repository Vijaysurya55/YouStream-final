import { setAuth } from "./authActions";
import { signOut  } from "./authActions";
import { revokeToken } from "../../api/googleAuth";
import { AUTH_UPDATE_LOCAL_USER } from "./authTypes";

function saveCurrentAuth(user: any, token: string | null, provider: string | null) {
    const currentUser = { user, token, provider };
    localStorage.setItem("youstream_current_auth", JSON.stringify(currentUser));
}

export const loginLocal = (email: string, password: string) => async (dispatch: any) => {
  const key = "youstream_local_user:" + email;
  const existing = localStorage.getItem(key);
  let user;
  if (existing) {
    user = JSON.parse(existing);
  } else {
    return "Invalid credentials";
  }
  
  saveCurrentAuth(user, null, "local");
  dispatch(setAuth({ user, token: null, provider: "local" }));
};

export const signupLocal = (email: string, password: string) => async (dispatch: any) => {
  const user = {
    email,
    name: email.split("@")[0],
    likes: {},
    subs: [],
    watchlater: [],
  };
  localStorage.setItem("youstream_local_user:" + email, JSON.stringify(user));
  
  saveCurrentAuth(user, null, "local");
  dispatch(setAuth({ user, token: null, provider: "local" }));
};

export const loginGoogle = ({ email, name, idToken, accessToken }: { email: string; name?: string; idToken?: string; accessToken: string }) => async (dispatch: any) => {
  const user = {
    email,
    name: name || email.split("@")[0],
    likes: {},
    subs: [],
    watchlater: [],
  };
  saveCurrentAuth(user, accessToken, "google");
  dispatch(setAuth({ user, token: accessToken, provider: "google" }));
};

export const signOutAll = () => async (dispatch: any, getState: any) => {
  const token = getState().auth?.token;
  if (token) {
    try {
      await revokeToken(token);
    } catch {}
  }
  localStorage.removeItem("youstream_current_auth");
  dispatch(signOut());
};

export const updateLocalUserLikes = (videoId: string, rating: "like" | "dislike" | "none") => async (dispatch: any, getState: any) => {
  const currentState = getState();
  const user = { ...currentState.auth.user };
  const provider = currentState.auth.provider;
  if (provider !== "local" || !user || !user.email) {
    return;
  }
  if (rating === "none") {
    delete user.likes[videoId];
  } else {
    user.likes[videoId] = rating;
  }
  const key = "youstream_local_user:" + user.email;
  localStorage.setItem(key, JSON.stringify(user));
  saveCurrentAuth(user, null, "local");
  dispatch({
    type: AUTH_UPDATE_LOCAL_USER,
    payload: user,
  });
};

export const toggleLocalSubscription = (channelId: string) => async (dispatch: any, getState: any) => {
  const state = getState();
  const provider = state.auth?.provider;
  const user = { ...state.auth?.user };
  if (provider !== "local" || !user || !user.email) {
    return;
  }


  const subs: string[] = Array.isArray(user.subs) ? [...user.subs] : [];
  const idx = subs.indexOf(channelId);
  if (idx === -1) {
    subs.push(channelId);
  } else {
    subs.splice(idx, 1);
  }

  user.subs = subs;

  const key = "youstream_local_user:" + user.email;
  try {
    localStorage.setItem(key, JSON.stringify(user));
    saveCurrentAuth(user, null, "local");
  } catch (e) {
  }

  dispatch({
    type: AUTH_UPDATE_LOCAL_USER,
    payload: user,
  });
};