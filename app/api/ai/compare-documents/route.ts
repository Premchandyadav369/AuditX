import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "This feature is temporarily unavailable. Please use the Company Intelligence feature instead." },
    { status: 503 }
  )
}
