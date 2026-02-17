import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const url = new URL("/refer", req.url);
  return NextResponse.redirect(url, 301);
}
