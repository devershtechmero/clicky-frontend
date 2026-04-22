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
  const [color, setColor] = useState<BookmarkColor>("none");
  const addSite = useAddSite();

  const submit = () => {
    if (!name.trim() || !url.trim()) {
      toast.error("Name and URL are required");
      return;
    }
    const cleanUrl = url.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
    addSite.mutate(
      { name: name.trim(), url: cleanUrl, bookmarkColor: color },
      {
        onSuccess: () => {
          toast.success("Website added");
          setName("");
          setUrl("");
          setColor("none");
          setOpen(false);
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
            <Label htmlFor="ws-url">URL</Label>
            <Input id="ws-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="acme.com" />
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
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Add Website</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
