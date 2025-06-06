import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Slider } from '../../components/ui/slider';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

export type ExportType = 'complete' | 'no-dots' | 'no-background';

interface ExportDialogProps {
  onExport: (format: string, quality: number, filename: string, exportType: ExportType) => void;
}

export function ExportDialog({ onExport }: ExportDialogProps) {
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(90);
  const [filename, setFilename] = useState('my-design');
  const [exportType, setExportType] = useState<ExportType>('complete');
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    onExport(format, quality, filename, exportType);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Export</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Design</DialogTitle>
          <DialogDescription>
            Choose your export settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              Filename
            </Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilename(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Format</Label>
            <RadioGroup
              value={format}
              onValueChange={setFormat}
              className="col-span-3 flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="png" id="png" />
                <Label htmlFor="png">PNG</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jpeg" id="jpeg" />
                <Label htmlFor="jpeg">JPEG</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Export Type</Label>
            <div className="col-span-3 space-y-4">
              <Select
                value={exportType}
                onValueChange={(value: ExportType) => setExportType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select export type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Complete Design</SelectItem>
                  <SelectItem value="no-dots">Without Designable Area Dots</SelectItem>
                  <SelectItem value="no-background">Cropped Design Only</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-xs text-muted-foreground">
                {exportType === 'complete' && (
                  <p>Exports the entire design including the product background and designable area border.</p>
                )}
                {exportType === 'no-dots' && (
                  <p>Exports the design with the product background but without the designable area border.</p>
                )}
                {exportType === 'no-background' && (
                  <p>Exports only the content within the designable area, cropped to the design area boundaries.</p>
                )}
              </div>
            </div>
          </div>

          {format === 'jpeg' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Quality</Label>
              <div className="col-span-3 space-y-2">
                <Slider
                  min={10}
                  max={100}
                  step={1}
                  value={[quality]}
                  onValueChange={([value]: any) => setQuality(value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>{quality}%</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleExport}>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
