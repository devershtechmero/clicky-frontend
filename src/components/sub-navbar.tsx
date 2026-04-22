import { RotateCw } from "lucide-react";
import { AddSiteDialog } from "./add-site-dialog";
import { BulkUploadDialog } from "./bulk-upload-dialog";
import { Button } from "./ui/button";

export function SubNavbar() {
  return (
    <div className="border-b border-border bg-card/60">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <AddSiteDialog />
          <BulkUploadDialog />
        </div>
        <Button type="button" variant="outline" size="icon" onClick={() => window.location.reload()}>
          <RotateCw className="h-4 w-4" />
          <span className="sr-only">Refresh page</span>
        </Button>
      </div>
    </div>
  );
}
