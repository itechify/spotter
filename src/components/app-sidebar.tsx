"use client";

import * as React from "react";
import { HomeIcon, ImportIcon, MountainIcon } from "lucide-react";

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
      title: "Import",
      url: "/import",
      icon: ImportIcon,
    },
    {
      title: "Bouldering",
      url: "/boulders",
      icon: MountainIcon,
      items: [
        {
          title: "All Boulders",
          url: "/boulders",
        },
        {
          title: "My Ticks",
          url: "/boulders/my-ticks",
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
