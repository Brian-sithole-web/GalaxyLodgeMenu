import { redirect } from "next/navigation";

/** Page in src/app. Sends the site root to the login card. */
export default function HomePage() {
  redirect("/login");
}
