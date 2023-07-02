import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserProfile,
} from "@clerk/nextjs";

function MyApp() {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-xl items-center justify-center px-4 pb-36 pt-12 md:pt-24">
      <SignedIn>
        <UserProfile />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}

export default MyApp;
