import "server-only";

import { cacheLife } from "next/cache";

/**
 * Lists the artwork folder from Google Drive with a plain API key, so the folder
 * has to be shared as "Anyone with the link". The key never leaves the server:
 * the images themselves load in the browser straight from Google (see components/Gallery.tsx).
 */
export interface Artwork {
  id: string;
  name: string;
  width: number;
  height: number;
}

const API = "https://www.googleapis.com/drive/v3/files";

/** Accepts a folder link (any drive.google.com/.../folders/<id> form) or a bare id. */
export function folderId(input: string): string | null {
  const s = input.trim();
  const fromUrl = /\/folders\/([\w-]+)/.exec(s)?.[1];
  if (fromUrl) return fromUrl;
  return /^[\w-]{10,}$/.test(s) ? s : null;
}

/** Every PNG in the folder, by name. Empty when the folder or key is missing or Drive is unreachable. */
export async function listArtwork(folder: string): Promise<Artwork[]> {
  "use cache";
  cacheLife("hours");

  const id = folderId(folder);
  const key = process.env.GOOGLE_DRIVE_API_KEY;
  if (!id || !key) return [];

  const out: Artwork[] = [];
  let pageToken: string | undefined;
  try {
    do {
      const url = new URL(API);
      url.search = new URLSearchParams({
        q: `'${id}' in parents and mimeType='image/png' and trashed=false`,
        fields: "nextPageToken,files(id,name,imageMediaMetadata(width,height))",
        orderBy: "name_natural",
        pageSize: "200",
        key,
        ...(pageToken ? { pageToken } : {}),
      }).toString();
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Drive responded ${res.status}: ${await res.text()}`);
      const body = (await res.json()) as {
        nextPageToken?: string;
        files: { id: string; name: string; imageMediaMetadata?: { width?: number; height?: number } }[];
      };
      for (const f of body.files) {
        out.push({
          id: f.id,
          name: f.name.replace(/\.png$/i, ""),
          width: f.imageMediaMetadata?.width ?? 1,
          height: f.imageMediaMetadata?.height ?? 1,
        });
      }
      pageToken = body.nextPageToken;
    } while (pageToken);
  } catch (err) {
    // Throwing would cache nothing but break the page; an empty gallery is the softer failure.
    console.error("Listing artwork failed:", err);
    return [];
  }
  return out;
}
