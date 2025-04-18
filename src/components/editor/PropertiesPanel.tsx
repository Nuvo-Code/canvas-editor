import type { Shape } from '@/types/shapes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { ucwords } from '@/lib/utils'

interface PropertiesPanelProps {
  selectedObject: Shape | undefined
  onUpdate: (property: keyof Shape, value: any) => void
}

export const PropertiesPanel = ({ selectedObject, onUpdate }: PropertiesPanelProps) => {
  if (!selectedObject) {
    return (
      <Card className="bg-background/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Select an object to edit properties
          </p>
        </CardContent>
      </Card>
    )
  }

  const renderCommonProperties = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>X Position</Label>
          <Input
            type="number"
            value={selectedObject.x}
            onChange={(e) => onUpdate('x', parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Y Position</Label>
          <Input
            type="number"
            value={selectedObject.y}
            onChange={(e) => onUpdate('y', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Rotation (degrees)</Label>
        <Slider
          min={0}
          max={360}
          step={1}
          value={[selectedObject.rotation || 0]}
          onValueChange={([value]) => onUpdate('rotation', value)}
          className="py-4"
        />
        <Input
          type="number"
          value={selectedObject.rotation || 0}
          onChange={(e) => onUpdate('rotation', parseInt(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Fill Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={selectedObject.fill || '#000000'}
            onChange={(e) => onUpdate('fill', e.target.value)}
            className="w-[60px] h-[40px] p-1"
          />
          <Input
            type="text"
            value={selectedObject.fill || '#000000'}
            onChange={(e) => onUpdate('fill', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {selectedObject.type !== 'text' && (
        <div className="space-y-2">
          <Label>Stroke</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={selectedObject.stroke || '#000000'}
              onChange={(e) => onUpdate('stroke', e.target.value)}
              className="w-[60px] h-[40px] p-1"
            />
            <Input
              type="text"
              value={selectedObject.stroke || '#000000'}
              onChange={(e) => onUpdate('stroke', e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="pt-2">
            <Label>Stroke Width</Label>
            <Slider
              min={0}
              max={10}
              step={0.5}
              value={[selectedObject.strokeWidth || 0]}
              onValueChange={([value]) => onUpdate('strokeWidth', value)}
              className="py-4"
            />
            <Input
              type="number"
              value={selectedObject.strokeWidth || 0}
              onChange={(e) => onUpdate('strokeWidth', parseFloat(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  )

  const renderSpecificProperties = () => {
    const properties = {
      rectangle: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Width</Label>
              <Input
                type="number"
                value={selectedObject.width}
                onChange={(e) => onUpdate('width', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Height</Label>
              <Input
                type="number"
                value={selectedObject.height}
                onChange={(e) => onUpdate('height', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      ),
      circle: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Radius</Label>
            <Slider
              min={1}
              max={200}
              step={1}
              value={[selectedObject.radius || 0]}
              onValueChange={([value]) => onUpdate('radius', value)}
              className="py-4"
            />
            <Input
              type="number"
              value={selectedObject.radius}
              onChange={(e) => onUpdate('radius', parseInt(e.target.value))}
            />
          </div>
        </div>
      ),
      text: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Input
              value={selectedObject.text}
              onChange={(e) => onUpdate('text', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Slider
              min={8}
              max={72}
              step={1}
              value={[selectedObject.fontSize || 16]}
              onValueChange={([value]) => onUpdate('fontSize', value)}
              className="py-4"
            />
            <Input
              type="number"
              value={selectedObject.fontSize}
              onChange={(e) => onUpdate('fontSize', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  {selectedObject.fontFamily || 'Arial'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col justify-center items-center w-48">
                <RadioGroup value={selectedObject.fontFamily || 'Arial'} onValueChange={(value: any) => onUpdate('fontFamily', value)}>
                  {['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Helvetica'].map(font => (
                    <div key={font} className="flex items-center space-x-2 w-full">
                      <RadioGroupItem value={font} id={font} />
                      <Label htmlFor={font} style={{ fontFamily: font }}>{font}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  Alignment: {ucwords(selectedObject.alignment || 'center')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col justify-center items-center w-32">
                <RadioGroup value={selectedObject.alignment || 'center'} onValueChange={(value: any) => onUpdate('alignment', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="left" />
                    <Label htmlFor="left">Left</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="center" id="center" />
                    <Label htmlFor="center">Center</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="right" id="right" />
                    <Label htmlFor="right">Right</Label>
                  </div>
                </RadioGroup>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Text Stroke</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={selectedObject.stroke || '#000000'}
                onChange={(e) => onUpdate('stroke', e.target.value)}
                className="w-[60px] h-[40px] p-1"
              />
              <Input
                type="text"
                value={selectedObject.stroke || '#000000'}
                onChange={(e) => onUpdate('stroke', e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="pt-2">
              <Label>Stroke Width</Label>
              <Slider
                min={0}
                max={10}
                step={0.5}
                value={[selectedObject.strokeWidth || 0]}
                onValueChange={([value]) => onUpdate('strokeWidth', value)}
                className="py-4"
              />
              <Input
                type="number"
                value={selectedObject.strokeWidth || 0}
                onChange={(e) => onUpdate('strokeWidth', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between">
                Text Shadow
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-4">
              <div className="space-y-2">
                <Label>Shadow Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedObject.shadowColor || '#000000'}
                    onChange={(e) => onUpdate('shadowColor', e.target.value)}
                    className="w-[60px] h-[40px] p-1"
                  />
                  <Input
                    type="text"
                    value={selectedObject.shadowColor || '#000000'}
                    onChange={(e) => onUpdate('shadowColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Shadow Blur</Label>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={[selectedObject.shadowBlur || 0]}
                  onValueChange={([value]) => onUpdate('shadowBlur', value)}
                  className="py-4"
                />
                <Input
                  type="number"
                  value={selectedObject.shadowBlur || 0}
                  onChange={(e) => onUpdate('shadowBlur', parseInt(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Shadow X Offset</Label>
                  <Input
                    type="number"
                    value={selectedObject.shadowOffsetX || 0}
                    onChange={(e) => onUpdate('shadowOffsetX', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Shadow Y Offset</Label>
                  <Input
                    type="number"
                    value={selectedObject.shadowOffsetY || 0}
                    onChange={(e) => onUpdate('shadowOffsetY', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )
    }

    return properties[selectedObject.type] || null
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="common" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="common" className="flex-1">Common</TabsTrigger>
            <TabsTrigger value="specific" className="flex-1">Specific</TabsTrigger>
          </TabsList>
          <TabsContent value="common" className="mt-4">
            {renderCommonProperties()}
          </TabsContent>
          <TabsContent value="specific" className="mt-4">
            {renderSpecificProperties()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}