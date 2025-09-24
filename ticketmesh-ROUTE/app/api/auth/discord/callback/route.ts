import { type NextRequest, NextResponse } from "next/server"
import { exchangeCodeForToken } from "@/lib/server-auth"
import { getDiscordUser, getDiscordGuilds, checkBotInGuild } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL("/?error=access_denied", request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url))
  }

  try {
    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(code)

    // Get user data
    const user = await getDiscordUser(tokenData.access_token)

    // Get user's guilds
    const guilds = await getDiscordGuilds(tokenData.access_token)

    // Check bot presence in each guild
    const guildsWithBotStatus = await Promise.all(
      guilds.map(async (guild) => ({
        ...guild,
        bot_present: await checkBotInGuild(guild.id),
      })),
    )

    // Store session data in cookies (in production, use a proper session store)
    const cookieStore = await cookies()
    cookieStore.set("discord_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in,
    })

    cookieStore.set("discord_user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in,
    })

    cookieStore.set("discord_guilds", JSON.stringify(guildsWithBotStatus), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in,
    })

    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Discord OAuth error:", error)
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url))
  }
}
