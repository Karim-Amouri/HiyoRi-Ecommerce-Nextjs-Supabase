import { getImageObject } from "@/lib/s3";
import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { message: "Missing image key." },
      { status: 400 },
    );
  }

  try {
    const response = await getImageObject(key);

    if (!response.Body) {
      return NextResponse.json(
        { message: "Image body was empty." },
        { status: 404 },
      );
    }

    const bodyStream = response.Body as
      | Readable
      | { transformToWebStream?: () => Promise<ReadableStream> };

    const body =
      "transformToWebStream" in bodyStream &&
      typeof bodyStream.transformToWebStream === "function"
        ? await bodyStream.transformToWebStream()
        : Readable.toWeb(bodyStream as Readable);

    const headers = new Headers();
    headers.set(
      "Content-Type",
      response.ContentType ?? "application/octet-stream",
    );
    headers.set(
      "Cache-Control",
      "public, max-age=3600, stale-while-revalidate=86400",
    );

    if (response.ContentLength !== undefined) {
      headers.set("Content-Length", response.ContentLength.toString());
    }

    return new Response(body as unknown as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch image.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
