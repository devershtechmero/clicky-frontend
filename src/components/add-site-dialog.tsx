import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { BookmarkColor } from "@/lib/types";
import { useAddSite } from "@/hooks/use-sites";
import { toast } from "sonner";

export function AddSiteDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [siteId, setSiteId] = useState("");
  const [siteKey, setSiteKey] = useState("");
  const [color, setColor] = useState<BookmarkColor>("none");
  const addSite = useAddSite();

  const resetForm = () => {
    setName("");
    setUrl("");
    setSiteId("");
    setSiteKey("");
    setColor("none");
  };

  const submit = () => {
    if (addSite.isPending) return;

    if (!name.trim() || !url.trim() || !siteId.trim() || !siteKey.trim()) {
      toast.error("Website name, website URL, site ID, and site key are required");
      return;
    }
    const cleanUrl = url.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
    addSite.mutate(
      {
        name: name.trim(),
        url: cleanUrl,
        siteId: siteId.trim(),
        siteKey: siteKey.trim(),
        bookmarkColor: color,
      },
      {
        onSuccess: (result) => {
          if (result.meta?.ignored) {
            toast.info("Website already exists. Duplicate was ignored");
          } else {
            toast.success("Website added");
          }
          resetForm();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Unable to add website");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          Add Website
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new website</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="ws-name">Website name</Label>
            <Input id="ws-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Inc." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ws-url">Website URL</Label>
            <Input id="ws-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="acme.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ws-site-id">Site ID</Label>
            <Input id="ws-site-id" value={siteId} onChange={(e) => setSiteId(e.target.value)} placeholder="123456789" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ws-site-key">Site key</Label>
            <Input id="ws-site-key" value={siteKey} onChange={(e) => setSiteKey(e.target.value)} placeholder="site_key_abc123" />
          </div>
          <div className="space-y-1.5">
            <Label>Bookmark color</Label>
            <Select value={color} onValueChange={(v) => setColor(v as BookmarkColor)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={addSite.isPending}>Cancel</Button>
          <Button onClick={submit} disabled={addSite.isPending}>
            {addSite.isPending ? "Adding..." : "Add Website"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
