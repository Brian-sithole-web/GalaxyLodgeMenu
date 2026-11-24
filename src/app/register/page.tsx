import { AuthScreen } from "@/components/auth/AuthScreen";
import { NeedHelpButton } from "@/components/auth/NeedHelpButton";
import { RegisterForm } from "@/components/auth/RegisterForm";

/** Page in src/app/register. Sign-up card with the same logo and field layout. */
export default function RegisterPage() {
  return (
    <AuthScreen>
      <h1 className="auth-heading">Sign Up</h1>
      <p className="auth-subtitle">Enter your credentials to continue</p>
      <RegisterForm />
      <NeedHelpButton />
    </AuthScreen>
  );
}
