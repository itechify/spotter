"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { UserIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

export function NavUser() {
  const { open } = useSidebar();
  const { user } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SignedOut>
          <SignInButton>
            <SidebarMenuButton>
              <UserIcon />
              <span>Sign in</span>
            </SidebarMenuButton>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex gap-2 pb-2">
            <UserButton />
            {open && (
              <span className="w-full text-center font-medium">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            )}
          </div>
        </SignedIn>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

/*



*/
