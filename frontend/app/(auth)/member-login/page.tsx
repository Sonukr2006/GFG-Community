import AuthForm from "@/components/AuthForm";

export default function MemberLoginPage() {
  return (
    <AuthForm
      role="member"
      endpoint="/api/member/login"
      title="Member Login"
      hint="Members can register for events, workshops, and access resources."
    />
  );
}
