import { AuthScreen } from "@/components/auth/AuthScreen";
import { LoginForm } from "@/components/auth/LoginForm";

/** Page in src/app/login. The first screen of the admin: logo, then the sign-in card. */
export default function LoginPage() {
  return (
    <AuthScreen>
      <h1 className="auth-title">Log in to your account</h1>
      <LoginForm />
    </AuthScreen>
  );
}
