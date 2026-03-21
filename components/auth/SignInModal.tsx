"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SignIn } from "@clerk/nextjs";
import type { ReactNode } from "react";

export function SignInModal({
  children,
  open,
  onOpenChange,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-fit h-fit p-0" showCloseButton>
        <SignIn
          routing="hash"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-0 rounded-none",
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
