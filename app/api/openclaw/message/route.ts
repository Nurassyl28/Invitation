import { agentAuthErrorResponse, validateAgentAuth } from "@/lib/agent-auth";
import { readJsonObject } from "@/lib/agent-http";
import { handleOpenClawMessage } from "@/lib/openclaw-chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = validateAgentAuth(request);

  if (!auth.ok) {
    return agentAuthErrorResponse(auth);
  }

  const body = await readJsonObject(request);

  if (!body.ok) {
    return body.response;
  }

  try {
    const result = await handleOpenClawMessage(body.data);
    return Response.json(result, { status: result.ok ? 200 : result.http_status ?? 400 });
  } catch (error) {
    console.error("OpenClaw message handler failed", error);

    return Response.json(
      {
        ok: false,
        error_code: "openclaw_message_handler_failed",
        error: "openclaw_message_handler_failed",
        retryable: true,
        reply: "Техническая ошибка. Я передал запрос администратору, скоро ответим здесь.",
      },
      { status: 500 },
    );
  }
}
