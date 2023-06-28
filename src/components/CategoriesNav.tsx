import React from "react";
import { homepageCards } from "~/constants/constants";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "~/components/ui/navigation-menu";
import Link from "next/link";
const CategoriesNav = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl items-center justify-start px-4 py-12">
      <NavigationMenu>
        <NavigationMenuList className="flex flex-wrap items-start justify-start gap-4">
          {homepageCards.map((card) => (
            <NavigationMenuItem key={card.id}>
              <NavigationMenuTrigger>{card.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid h-96 w-64 grid-cols-1 gap-4 p-4 text-white md:w-[768px] md:grid-cols-2">
                  <Link
                    href="/resources/ui-libraries"
                    className="group relative flex flex-col items-center justify-center gap-4 p-4 text-center"
                  >
                    <h3 className="z-20 text-2xl font-semibold">
                      {card.title}
                    </h3>
                    <p className="z-20 text-sm">{card.description}</p>
                    <div className="absolute left-0 top-0 z-10 h-full w-full rounded-xl bg-black/70 duration-200 group-hover:bg-black/40"></div>
                    <img
                      src="/categories/ui.jpg"
                      className="absolute left-0 top-0 h-full w-full rounded-xl object-cover"
                    />
                  </Link>
                  <div className="hidden md:block">lista</div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default CategoriesNav;
