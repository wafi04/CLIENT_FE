import HeaderDashboard from "@/components/layouts/HeaderDashboard";
import { ButtonCreate } from "@/components/ui/ButtonCreate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AllGedung } from "@/features/admin/gedung/components/AllGedung";
import FormGedung from "@/features/admin/gedung/components/FormGedung";

export function DashboardGedung() {
  return (
    <main>
      <HeaderDashboard
        title="Daftar Gedung"
        subTitle="Temukan gedung yang sesuai dengan kebutuhan Anda">
        <Dialog>
          <DialogTrigger asChild>
            <ButtonCreate className="w-28 text-lg">Create</ButtonCreate>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Gedung</DialogTitle>
              <DialogDescription>Form Gedung all includes</DialogDescription>
            </DialogHeader>
            <FormGedung />
          </DialogContent>
        </Dialog>
      </HeaderDashboard>
      <AllGedung />
    </main>
  );
}
