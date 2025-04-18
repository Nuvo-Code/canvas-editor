import { useState } from 'react'
import type { ShapeType, ToolbarProps } from '@/types/shapes'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleCircleSquare, faFileText, faTrash, faPaintBrush, faImage, faSmile } from '@fortawesome/free-solid-svg-icons'
import ImageInputForm from './toolbar/ImageInputForm'
import ClipartSelector from './toolbar/ClipartSelector'

export const Toolbar = ({
  selectedObject,
  onAddShape,
  onDelete,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: ToolbarProps) => {
  const [selectedColor, setSelectedColor] = useState('#000000')

  const shapes: { type: ShapeType; label: string; }[] = [
    { type: 'rectangle', label: 'Rectangle' },
    { type: 'circle', label: 'Circle' },
    { type: 'triangle', label: 'Triangle' },
    { type: 'star', label: 'Star' },
    { type: 'polygon', label: 'Polygon' },
    { type: 'line', label: 'Line' },
    { type: 'arrow', label: 'Arrow' }
  ]

  const handleShapeAdd = (type: ShapeType) => {
    const properties = {
      fill: selectedColor,
      stroke: '#000000',
      strokeWidth: 2,
      ...(type === 'rectangle' && { width: 100, height: 100 }),
      ...(type === 'circle' && { radius: 50 }),
      ...(type === 'triangle' && { radius: 50 }),
      ...(type === 'star' && { radius: 50, numPoints: 5, innerRadius: 25 }),
      ...(type === 'polygon' && { radius: 50, numPoints: 6 }),
      ...(type === 'line' && {
        points: [0, 0, 100, 100],
        fill: 'transparent',
        stroke: selectedColor,
        strokeWidth: 4,
        lineCap: 'round',
        lineJoin: 'round'
      }),
      ...(type === 'arrow' && {
        points: [0, 0, 100, 100],
        fill: 'transparent',
        stroke: selectedColor,
        strokeWidth: 4,
        lineCap: 'round',
        lineJoin: 'round'
      }),
      ...(type === 'text' && {
        text: 'Double click to edit',
        fontSize: 16,
        width: 200,
        alignment: "center",
        fill: selectedColor,
        stroke: 'transparent'
      })
    }
    onAddShape(type, properties)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => handleShapeAdd('text')}
            className="flex flex-col h-auto py-3"
          >
            <FontAwesomeIcon icon={faFileText} size='xl' />
            <span className="mt-1">Text</span>
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex flex-col h-auto py-3">
                <FontAwesomeIcon icon={faTriangleCircleSquare} size='xl' />
                <span className="mt-1">Shapes</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col justify-center items-center w-48 max-h-[300px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 w-full">
                {shapes.map(({ type, label }) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="w-full"
                    onClick={() => handleShapeAdd(type)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex flex-col h-auto py-3">
                <FontAwesomeIcon icon={faImage} size='xl' />
                <span className="mt-1">Image</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
              <ImageInputForm addImage={onAddShape} />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex flex-col h-auto py-3">
                <FontAwesomeIcon icon={faSmile} size='xl' />
                <span className="mt-1">Clipart</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
              <ClipartSelector addClipart={onAddShape} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="pt-3 border-t space-y-2">
        <h3 className="text-sm font-medium">Color</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
            >
              <span>Select Color</span>
              <div
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: selectedColor }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <Label htmlFor="color">Color Picker</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-[60px] h-[40px] p-1"
                />
                <Input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="pt-3 border-t space-y-2">
        <h3 className="text-sm font-medium">Edit</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1"
          >
            Undo
          </Button>
          <Button
            variant="outline"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1"
          >
            Redo
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={onDelete}
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={!selectedObject}
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete Selected
        </Button>
      </div>
    </div>
  )
}