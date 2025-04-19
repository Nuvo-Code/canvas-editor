import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Slider } from '../../components/ui/slider';
import { Switch } from '../../components/ui/switch-simple';

interface DesignableAreaControlsProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onUpdate: (property: string, value: number | boolean) => void;
}

export const DesignableAreaControls = ({ x, y, width, height, onUpdate }: DesignableAreaControlsProps) => {
  const [lockRatio, setLockRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(width / height);

  // Update aspect ratio when width or height changes and ratio is locked
  useEffect(() => {
    if (width && height) {
      setAspectRatio(width / height);
    }
  }, [width, height]);

  // Handle width change
  const handleWidthChange = (newWidth: number) => {
    onUpdate('width', newWidth);

    // If ratio is locked, update height accordingly
    if (lockRatio && aspectRatio) {
      onUpdate('height', Math.round(newWidth / aspectRatio));
    }
  };

  // Handle height change
  const handleHeightChange = (newHeight: number) => {
    onUpdate('height', newHeight);

    // If ratio is locked, update width accordingly
    if (lockRatio && aspectRatio) {
      onUpdate('width', Math.round(newHeight * aspectRatio));
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Designable Area</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>X Position</Label>
            <Input
              type="number"
              value={x}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate('x', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Y Position</Label>
            <Input
              type="number"
              value={y}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate('y', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 py-2">
          <Switch
            id="lock-ratio"
            checked={lockRatio}
            onCheckedChange={setLockRatio}
          />
          <Label htmlFor="lock-ratio">Lock aspect ratio</Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Width</Label>
            <Input
              type="number"
              min={50}
              max={600}
              value={width}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWidthChange(parseInt(e.target.value) || 0)}
            />
            <Slider
              min={50}
              max={600}
              step={10}
              value={[width]}
              onValueChange={([value]: any) => handleWidthChange(value)}
              className="py-2"
            />
          </div>
          <div className="space-y-2">
            <Label>Height</Label>
            <Input
              type="number"
              min={50}
              max={600}
              value={height}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHeightChange(parseInt(e.target.value) || 0)}
            />
            <Slider
              min={50}
              max={600}
              step={10}
              value={[height]}
              onValueChange={([value]: any) => handleHeightChange(value)}
              className="py-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignableAreaControls;
