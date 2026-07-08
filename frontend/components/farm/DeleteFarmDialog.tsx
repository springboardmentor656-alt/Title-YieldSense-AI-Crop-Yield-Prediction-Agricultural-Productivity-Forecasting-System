"use client";

import {

    Dialog,

    DialogContent,

    DialogHeader,

    DialogTitle,

    DialogFooter,

} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Props {

    open: boolean;

    onClose: () => void;

    onConfirm: () => void;

}

export default function DeleteFarmDialog({

    open,

    onClose,

    onConfirm

}: Props) {

    return (

        <Dialog open={open} onOpenChange={onClose}>

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>

                        Delete Farm?

                    </DialogTitle>

                </DialogHeader>

                <p>

                    This action cannot be undone.

                </p>

                <DialogFooter>

                    <Button

                        variant="outline"

                        onClick={onClose}

                    >

                        Cancel

                    </Button>

                    <Button

                        variant="destructive"

                        onClick={onConfirm}

                    >

                        Delete

                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

    )

}