import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { saveDesign } from '@/lib/storage';
import type { Shape } from '@/types/shapes';

interface SaveDesignDialogProps {
  shapes: Shape[];
  mockupName: string;
  onSave: () => void;
}

export function SaveDesignDialog({ shapes, mockupName, onSave }: SaveDesignDialogProps) {
  const [designName, setDesignName] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!designName.trim()) {
      setError('Please enter a design name');
      return;
    }

    try {
      saveDesign(designName, shapes, mockupName);
      setOpen(false);
      setDesignName('');
      setError('');
      onSave();
    } catch (err) {
      setError('Failed to save design. Please try again.');
      console.error('Save design error:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Save Design</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Design</DialogTitle>
          <DialogDescription>
            Save your current design to load it later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="col-span-3"
              placeholder="My Awesome Design"
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save Design</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
