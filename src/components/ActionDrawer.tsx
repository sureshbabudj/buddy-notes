import React from "react";
import { isDrawerOpenAtom } from "@/lib/store";
import { useAtom } from "jotai";
import { Button } from "@/components//ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { PropsWithChildren } from "react";

export function ActionDrawer({ children }: PropsWithChildren) {
  const [open, setOpen] = useAtom(isDrawerOpenAtom);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerHeader className="sr-only">
        <DrawerTitle>Actions</DrawerTitle>
        <DrawerDescription>
          Actions that can be performed on current page.
        </DrawerDescription>
      </DrawerHeader>
      <DrawerContent>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
