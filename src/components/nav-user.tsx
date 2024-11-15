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
          <div className="flex pb-2">
            <UserButton />
            {open && (
              <div className="flex w-full flex-col text-center">
                <div className="font-medium">{user?.username}</div>
                <div className="text-sm text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>
            )}
          </div>
        </SignedIn>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

/*



*/
