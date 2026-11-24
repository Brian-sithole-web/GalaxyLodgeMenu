import { AuthScreen } from "@/components/auth/AuthScreen";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

/** Page in src/app/forgot-password. Same card chrome, used by the login link. */
export default function ForgotPasswordPage() {
  return (
    <AuthScreen>
      <h1 className="auth-title">Forgot password?</h1>
      <ForgotPasswordForm />
    </AuthScreen>
  );
}
