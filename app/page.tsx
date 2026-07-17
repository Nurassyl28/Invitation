import { redirect } from "next/navigation";

// The marketing home page was removed — the templates gallery at /demo is the entry point.
export default function HomePage() {
  redirect("/demo");
}
