import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { allowedMediaTypes, validateMediaUpload } from "@/lib/media/media-policy";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  if (body.type === "blob.generate-client-token") {
    const denied = await requireAdminApiAccess(request);
    if (denied) return denied;
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "Media storage is not configured." }, { status: 503 });
  try {
    const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const denied = await requireAdminApiAccess(request);
        if (denied) throw new Error("Admin Access is required.");
        const metadata = JSON.parse(clientPayload ?? "{}") as { filename?: string; mimeType?: string; byteSize?: number };
        const validation = validateMediaUpload({ filename: metadata.filename ?? "", mimeType: metadata.mimeType ?? "", byteSize: metadata.byteSize ?? 0 });
        if (!validation.ok) throw new Error(validation.error);
        return { allowedContentTypes: allowedMediaTypes, maximumSizeInBytes: validation.maxBytes, addRandomSuffix: true, allowOverwrite: false, tokenPayload: clientPayload };
      },
      onUploadCompleted: async () => undefined
    });
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Upload authorization failed." }, { status: 400 });
  }
}
