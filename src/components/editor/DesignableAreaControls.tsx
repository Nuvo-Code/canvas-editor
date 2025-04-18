import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface DesignableAreaControlsProps {
  x: number;
  y: number;
  size: number;
  onUpdate: (property: string, value: number) => void;
}

export const DesignableAreaControls = ({ x, y, size, onUpdate }: DesignableAreaControlsProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Designable Area</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>X Position</Label>
            <Input
              type="number"
              value={x}
              onChange={(e) => onUpdate('x', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Y Position</Label>
            <Input
              type="number"
              value={y}
              onChange={(e) => onUpdate('y', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <Slider
            min={100}
            max={500}
            step={10}
            value={[size]}
            onValueChange={([value]) => onUpdate('size', value)}
            className="py-4"
          />
          <Input
            type="number"
            value={size}
            onChange={(e) => onUpdate('size', parseInt(e.target.value))}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignableAreaControls;
