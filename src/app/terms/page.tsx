import Link from "next/link";
import { AuthScreen } from "@/components/auth/AuthScreen";

/** Page in src/app/terms. Short terms page linked from the sign-up checkbox. */
export default function TermsPage() {
  return (
    <AuthScreen>
      <article className="terms-page">
        <h1>Terms of Use</h1>
        <p>
          Galaxy Lodge Menu is the admin for The Galaxy Space restaurant menu. Use the account
          only for your own lodge or restaurant.
        </p>
        <p>
          Guest orders, payments, and staff access will follow these terms once those parts of the
          system are connected.
        </p>
        <p>
          <Link href="/register">Back to Sign Up</Link>
        </p>
      </article>
    </AuthScreen>
  );
}
