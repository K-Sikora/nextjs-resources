import { useRouter } from "next/router";
import React from "react";

const ResourcePage = () => {
  const router = useRouter();

  const { resource } = router.query;
  return (
    <div className="mx-auto min-h-screen w-full max-w-screen-xl px-4 py-12 md:py-24">
      {resource}
    </div>
  );
};

export default ResourcePage;
