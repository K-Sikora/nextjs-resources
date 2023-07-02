import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <div className="flex min-h-screen items-start justify-center py-28">
    <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
  </div>
);

export default SignUpPage;
