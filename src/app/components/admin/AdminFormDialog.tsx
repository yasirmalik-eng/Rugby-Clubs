import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type AdminFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AdminFormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: AdminFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-zinc-950 text-white sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-white">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-sm text-gray-400">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {children}

        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
