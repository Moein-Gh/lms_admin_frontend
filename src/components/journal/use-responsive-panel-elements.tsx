import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export function useResponsivePanelElements(isMobile: boolean) {
  return {
    CloseButton: isMobile ? DrawerClose : DialogClose,
    Header: isMobile ? DrawerHeader : DialogHeader,
    Title: isMobile ? DrawerTitle : DialogTitle,
    Description: isMobile ? DrawerDescription : DialogDescription,
    Footer: isMobile ? DrawerFooter : DialogFooter
  };
}
