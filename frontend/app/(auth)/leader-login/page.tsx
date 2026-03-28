import AuthForm from "@/components/AuthForm";

export default function LeaderLoginPage() {
  return (
    <AuthForm
      role="leader"
      endpoint="/api/leader/login"
      title="Team Leader Login"
      hint="Leaders can manage events, workshops, announcements, and resources."
    />
  );
}
