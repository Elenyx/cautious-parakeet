import { getDiscordAuthUrl } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const authUrl = getDiscordAuthUrl()
  return NextResponse.redirect(authUrl)
}
