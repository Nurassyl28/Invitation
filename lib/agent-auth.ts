export type AgentAuthResult =
  | { ok: true }
  | { ok: false; status: number; error: string; errorCode: string };

export function validateAgentAuth(request: Request): AgentAuthResult {
  const expectedKey = process.env.AGENT_API_KEY ?? (process.env.NODE_ENV === "production" ? "" : "dev-agent-key");

  if (!expectedKey) {
    return {
      ok: false,
      status: 500,
      errorCode: "agent_api_key_not_configured",
      error: "AGENT_API_KEY is not configured",
    };
  }

  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : "";
  const headerKey = request.headers.get("x-agent-api-key")?.trim();
  const providedKey = headerKey || bearerToken;

  if (providedKey !== expectedKey) {
    return {
      ok: false,
      status: 401,
      errorCode: "invalid_agent_api_key",
      error: "Invalid agent API key",
    };
  }

  return { ok: true };
}

export function agentAuthErrorResponse(result: Exclude<AgentAuthResult, { ok: true }>) {
  return Response.json(
    {
      ok: false,
      error_code: result.errorCode,
      error: result.error,
      retryable: false,
    },
    { status: result.status },
  );
}
