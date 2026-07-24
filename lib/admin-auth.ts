export function expectedAdminToken() {
  return process.env.ADMIN_TOKEN ?? (process.env.NODE_ENV === "production" ? "" : "dev-admin-token");
}

export function isValidAdminToken(token?: string) {
  const expectedToken = expectedAdminToken();
  return Boolean(expectedToken && token === expectedToken);
}

export function adminTokenFromHeaders(headerList: Pick<Headers, "get">) {
  const authHeader = headerList.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : "";
  const headerToken = headerList.get("x-admin-token")?.trim();

  return headerToken || bearerToken || undefined;
}

export function validateAdminRequest(request: Request, queryToken?: string) {
  const providedToken = queryToken || adminTokenFromHeaders(request.headers);

  return isValidAdminToken(providedToken);
}
