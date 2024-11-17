"use client";

import * as React from "react";
import { BookOpenCheckIcon, HomeIcon, MountainIcon } from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "~/lib/utils";

// Sidebar data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
    },
    {
      title: "Boulders",
      url: "/boulders",
      icon: MountainIcon,
      items: [
        {
          title: "All",
          url: "/boulders",
        },
      ],
    },
    {
      title: "Ticks",
      url: "/ticks",
      icon: BookOpenCheckIcon,
      items: [
        {
          title: "My Ticks",
          url: "/ticks",
        },
        {
          title: "Import CSV",
          url: "/ticks/import",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href={"/"}
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "w-full text-center text-xl font-semibold",
              )}
            >
              {open ? "Spotter" : "SP"}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
