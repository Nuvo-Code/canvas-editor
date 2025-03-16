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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  Aligment: {ucwords(selectedObject.alignment)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col justify-center items-center w-32">
                <RadioGroup value={selectedObject.alignment} onValueChange={(value) => onUpdate('alignment', value)}>
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