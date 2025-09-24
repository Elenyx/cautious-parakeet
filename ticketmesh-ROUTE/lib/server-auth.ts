export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
export const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
export const DISCORD_REDIRECT_URI =
  process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || "http://localhost:3000/api/auth/discord/callback"

export async function exchangeCodeForToken(code: string) {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID!,
      client_secret: DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to exchange code for token")
  }

  return response.json()
}
