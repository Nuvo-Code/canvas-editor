import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { loadAllDesigns, deleteDesign, type SavedDesign } from '@/lib/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface LoadDesignDialogProps {
  onLoad: (design: SavedDesign) => void;
}

export function LoadDesignDialog({ onLoad }: LoadDesignDialogProps) {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDesigns(loadAllDesigns());
    }
  }, [open]);

  const handleLoad = (design: SavedDesign) => {
    onLoad(design);
    setOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this design?')) {
      deleteDesign(id);
      setDesigns(designs.filter(d => d.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Load Design</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Load Design</DialogTitle>
          <DialogDescription>
            Select a previously saved design to load.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          {designs.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No saved designs found.</p>
          ) : (
            <div className="space-y-2">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/10 cursor-pointer"
                  onClick={() => handleLoad(design)}
                >
                  <div>
                    <h3 className="font-medium">{design.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {design.mockupName} • Updated: {formatDate(design.updatedAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDelete(design.id, e)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
