declare global {
  interface Window { google: any }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string;
if (!CLIENT_ID) {
  console.warn("Missing VITE_GOOGLE_OAUTH_CLIENT_ID in .env");
}

export async function revokeToken(accessToken: string) {
  if (!accessToken) return;
  await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
  });
}