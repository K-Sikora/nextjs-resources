import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div className="flex min-h-screen items-start justify-center py-28">
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </div>
);

export default SignInPage;
