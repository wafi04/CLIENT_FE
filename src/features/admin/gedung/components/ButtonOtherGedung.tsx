import { useState } from "react";
import { Edit, Trash, Ellipsis, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormGedung from "./FormGedung";
import { GedungForm } from "@/types/gedung";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteGedung } from "../api/ApiGedung";
import { FormGedungImage } from "./FormGedungImages";
import { GetAllGedungImage } from "../api/ApiGedungImages";

export type Option = {
  delete: boolean;
  edit: boolean;
  images: boolean;
};

export function ButtonOtherGedung({
  initialData,
  id,
}: {
  initialData?: GedungForm;
  id: string;
}) {
  const [option, setOption] = useState<Option>({
    delete: false,
    edit: false,
    images: false,
  });
  const deletes = useDeleteGedung(id);

  const handleOpen = (field: keyof Option) => {
    setOption({
      ...option,
      [field]: true,
    });
  };

  const handleClose = (field: keyof Option) => {
    setOption({
      ...option,
      [field]: false,
    });
  };

  const handleDelete = () => {
    // Add your delete logic here
    console.log("Deleting...");
    deletes.mutate();
    handleClose("delete");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleOpen("edit")}
            className="cursor-pointer">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleOpen("images")}
            className="cursor-pointer">
            <Image className="w-4 h-4 mr-2" />
            Images
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleOpen("delete")}
            className="cursor-pointer text-red-600">
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={option.delete}
        onOpenChange={() => handleClose("delete")}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              building and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleClose("delete")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog - You can replace this with your edit form */}
      <Dialog open={option.edit} onOpenChange={() => handleClose("edit")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Building</DialogTitle>
            <DialogDescription>
              Make changes to the building information here.
            </DialogDescription>
          </DialogHeader>
          <FormGedung initialData={initialData} id={id} />
        </DialogContent>
      </Dialog>

      <Dialog open={option.images} onOpenChange={() => handleClose("images")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Images</DialogTitle>
            <DialogDescription>Add Images</DialogDescription>
          </DialogHeader>
          <FormGedungImage gedungId={id} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ButtonOtherGedung;
