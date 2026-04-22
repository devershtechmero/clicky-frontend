import { AddSiteDialog } from "./add-site-dialog";
import { BulkUploadDialog } from "./bulk-upload-dialog";

export function SubNavbar() {
  return (
    <div className="border-b border-border bg-card/60">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
        <AddSiteDialog />
        <BulkUploadDialog />
      </div>
    </div>
  );
}
