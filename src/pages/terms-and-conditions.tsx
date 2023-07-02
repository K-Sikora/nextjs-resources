import Link from "next/link";
import React from "react";
import { buttonVariants } from "~/components/ui/button";

type Props = {};

const TermsAndConditions = (props: Props) => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12 text-justify md:py-24">
      <h1 className="mb-8 text-2xl font-bold md:text-4xl">
        Terms and Conditions
      </h1>
      <ul>
        <h3 className="mb-4 text-xl font-medium">1. Resource Sharing:</h3>
        <li>
          The Platform is a website dedicated to providing a collection of
          resources for developers. These resources, including tools, libraries,
          tutorials, starters, and other related content, are shared on the
          Platform for informational purposes. Please note that these resources
          are not owned by the Platform and are provided by various
          contributors.
        </li>
        <h3 className="my-4 text-xl font-medium">2. Use of Resources:</h3>
        <li>
          You may access and use the resources shared on the Platform for
          personal or professional purposes related to your development
          projects. However, please be aware that the Platform does not take
          responsibility for the accuracy, functionality, or suitability of
          these resources. It is your responsibility to assess and evaluate the
          resources before using them in your projects.
        </li>
        <h3 className="my-4 text-xl font-medium">3. Intellectual Property:</h3>

        <li>
          The intellectual property rights of the shared resources belong to
          their respective owners. The Platform does not claim ownership or
          rights over these resources. If you believe that your intellectual
          property rights have been infringed upon, please contact me promptly
          so that appropriate action can be taken.
        </li>
        <h3 className="my-4 text-xl font-medium">4. User Conduct:</h3>
        <li>
          When using the Platform, you agree to conduct yourself in a
          responsible and lawful manner. This includes refraining from engaging
          in activities such as unauthorized access, distribution of harmful
          content, or any other behavior that may violate applicable laws or
          infringe upon the rights of others. You have the option to delete your
          account by accessing the{" "}
          <Link
            href="/user-settings"
            className={buttonVariants({ variant: "link", size: "link" })}
          >
            Account Settings
          </Link>{" "}
          section of the Platform.
        </li>
        <h3 className="my-4 text-xl font-medium">
          5. Disclaimer of Liability:
        </h3>
        <li>
          The Platform provides the shared resources on an "as is" basis. It
          does not guarantee the accuracy, reliability, or suitability of these
          resources for your specific needs. The Platform shall not be held
          liable for any damages, losses, or consequences arising from the use
          or misuse of the shared resources.
        </li>
      </ul>
    </div>
  );
};

export default TermsAndConditions;
