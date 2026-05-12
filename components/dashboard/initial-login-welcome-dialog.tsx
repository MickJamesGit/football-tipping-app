"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface WelcomeDialogProps {
  open: boolean;
}

const WelcomeDialog: React.FC<{ initialLogin?: boolean }> = ({
  initialLogin,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (initialLogin) {
      setIsOpen(true);
    }
  }, [initialLogin]);

  const handleClose = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to SportsTippers!</DialogTitle>
          <DialogDescription>
            <br />
            Head to the tipping menu to submit your tips for the sports
            you&#39;re registered in, or to register for a new sport.
            <br />
            <br />
            If you miss a game deadline, your tip will automatically be set to
            the away team. <br />
            <br /> The leaderboards update after each game once results are
            finalized.
            <br /> <br />
            Good luck, and happy tipping!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-center">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
