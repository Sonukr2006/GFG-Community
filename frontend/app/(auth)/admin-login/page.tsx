import AuthForm from "@/components/AuthForm";

export default function AdminLoginPage() {
  return (
    <AuthForm
      role="admin"
      endpoint="/api/admin/login"
      title="Admin Login"
      hint="Use your admin credentials to access the management dashboard."
    />
  );
}
