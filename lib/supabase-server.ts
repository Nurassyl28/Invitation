export const SUPABASE_STORAGE_BUCKETS = {
  customerPhotos: "customer-photos",
  customerMusic: "customer-music",
  paymentReceipts: "payment-receipts",
} as const;

type SupabaseEnv = {
  url: string;
  key: string;
};

export function isSupabaseConfigured() {
  return Boolean(readSupabaseEnv());
}

export function getSupabasePublicUrl(bucket: string, objectPath: string) {
  const env = readSupabaseEnv();

  if (!env) {
    return "";
  }

  return `${env.url}/storage/v1/object/public/${bucket}/${objectPath}`;
}

export async function supabaseRest<T>(path: string, init?: RequestInit): Promise<T> {
  const env = requireSupabaseEnv();
  const response = await fetch(`${env.url}/rest/v1/${path.replace(/^\/+/, "")}`, {
    ...init,
    headers: supabaseHeaders(env, "application/json", init?.headers),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase REST ${response.status}: ${details}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text.trim()) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export async function uploadSupabaseObject(input: {
  bucket: string;
  objectPath: string;
  body: BodyInit;
  contentType: string;
}) {
  const env = requireSupabaseEnv();
  const response = await fetch(
    `${env.url}/storage/v1/object/${input.bucket}/${input.objectPath}`,
    {
      method: "PUT",
      headers: supabaseHeaders(env, input.contentType, { "x-upsert": "true" }),
      body: input.body,
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase Storage ${response.status}: ${details}`);
  }

  return {
    bucket: input.bucket,
    path: input.objectPath,
    publicUrl: input.bucket === SUPABASE_STORAGE_BUCKETS.paymentReceipts
      ? ""
      : getSupabasePublicUrl(input.bucket, input.objectPath),
  };
}

function requireSupabaseEnv(): SupabaseEnv {
  const env = readSupabaseEnv();

  if (!env) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return env;
}

function supabaseHeaders(env: SupabaseEnv, contentType: string, extraHeaders?: HeadersInit) {
  const headers = new Headers(extraHeaders);
  headers.set("apikey", env.key);
  headers.set("Content-Type", contentType);

  if (!env.key.startsWith("sb_secret_")) {
    headers.set("Authorization", `Bearer ${env.key}`);
  }

  return headers;
}

function readSupabaseEnv(): SupabaseEnv | undefined {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return undefined;
  }

  return {
    url: url.replace(/\/+$/, ""),
    key,
  };
}
