export async function readJsonObject(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return {
        ok: false as const,
        response: Response.json(
          {
            ok: false,
            error: "JSON object body is required",
          },
          { status: 400 },
        ),
      };
    }

    return {
      ok: true as const,
      data: body as Record<string, unknown>,
    };
  } catch {
    return {
      ok: false as const,
      response: Response.json(
        {
          ok: false,
          error: "Invalid JSON body",
        },
        { status: 400 },
      ),
    };
  }
}

export function requestOrigin(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? request.headers.get("origin") ?? new URL(request.url).origin;
}
