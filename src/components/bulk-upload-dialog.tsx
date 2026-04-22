import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload } from "lucide-react";
import { useBulkAddSites } from "@/hooks/use-sites";
import { toast } from "sonner";

interface Row {
  name: string;
  url: string;
  siteId: string;
  siteKey: string;
  color?: string;
}

export function BulkUploadDialog() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bulk = useBulkAddSites();

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
    const parsed: Row[] = json
      .map((r) => ({
        name: String(r.name ?? r.Name ?? "").trim(),
        url: String(r.url ?? r.URL ?? r.Url ?? "")
          .trim()
          .replace(/^https?:\/\//, "")
          .replace(/\/$/, ""),
        siteId: String(r.siteId ?? r["site id"] ?? r.site_id ?? r.id ?? r.ID ?? "").trim(),
        siteKey: String(r.siteKey ?? r["site key"] ?? r.site_key ?? r.key ?? r.Key ?? "").trim(),
        color: r.color || r.Color ? String(r.color ?? r.Color).trim().toLowerCase() : undefined,
      }))
      .filter((r) => r.name && r.url && r.siteId && r.siteKey);
    setRows(parsed);
    if (!parsed.length) toast.error("No valid rows. Expected columns: name, url, site id, site key, color");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const confirm = () => {
    if (!rows.length) return;
    bulk.mutate(rows, {
      onSuccess: () => {
        toast.success(`Imported ${rows.length} website${rows.length === 1 ? "" : "s"}`);
        setRows([]);
        setFileName("");
        setOpen(false);
      },
    });
  };

  const reset = () => {
    setRows([]);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileSpreadsheet className="mr-1 h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk import from Excel</DialogTitle>
        </DialogHeader>

        {!rows.length ? (
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 px-6 py-12 text-center transition-colors hover:bg-muted"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm font-medium text-foreground">
              Drop your .xlsx file here, or click to browse
            </div>
            <div className="text-xs text-muted-foreground">
              Expected columns: <code>name</code>, <code>url</code>, <code>site id</code>, <code>site key</code>, <code>color</code>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              {fileName} — {rows.length} row{rows.length === 1 ? "" : "s"} parsed
            </div>
            <div className="max-h-64 overflow-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">URL</th>
                    <th className="px-3 py-2 text-left">Site ID</th>
                    <th className="px-3 py-2 text-left">Site Key</th>
                    <th className="px-3 py-2 text-left">Color</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-3 py-1.5">{r.name}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">{r.url}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">{r.siteId}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">{r.siteKey}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">{r.color ?? "none"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <DialogFooter>
          {rows.length > 0 && (
            <Button variant="ghost" onClick={reset}>
              Choose another file
            </Button>
          )}
          <Button onClick={confirm} disabled={!rows.length}>
            Import {rows.length || ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
