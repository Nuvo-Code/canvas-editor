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
import { faTriangleCircleSquare, faFileText, faTrash, faPaintBrush, faImage, faSave } from '@fortawesome/free-solid-svg-icons'
import ImageInputForm from './toolbar/ImageInputForm'

export const Toolbar = ({
  selectedObject,
  onAddShape,
  onDelete,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: ToolbarProps) => {
  const [selectedColor, setSelectedColor] = useState('#000000')

  const shapes: { type: ShapeType; label: string; }[] = [
    { type: 'rectangle', label: 'Rectangle' },
    { type: 'circle', label: 'Circle' },
    { type: 'triangle', label: 'Triangle' }
  ]

  const handleShapeAdd = (type: ShapeType) => {
    const properties = {
      fill: selectedColor,
      ...(type === 'rectangle' && { width: 100, height: 100 }),
      ...(type === 'circle' && { radius: 50 }),
      ...(type === 'triangle' && { radius: 50 }),
      ...(type === 'text' && { text: 'Double click to edit', fontSize: 16, width: 200, alignment: "center" })
    }
    onAddShape(type, properties)
  }

  return (
    <div className="flex items-center gap-2 p-2 border shadow rounded-md w-full overflow-x-scroll no-scrollbar">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          onClick={() => handleShapeAdd('text')}
        >
          <FontAwesomeIcon icon={faFileText} size='xl' />
          Text
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <FontAwesomeIcon icon={faTriangleCircleSquare} size='xl' />
              Shapes
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col justify-center items-center w-32">
            {shapes.map(({ type, label }) => (
              <Button
                key={type}
                variant="ghost"
                className="w-full"
                onClick={() => handleShapeAdd(type)}
              >
                {label}
              </Button>
            ))}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <FontAwesomeIcon icon={faImage} size='xl' />
              Image
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <ImageInputForm addImage={onAddShape} />
          </PopoverContent>
        </Popover>
      </div>

      <span className='mx-2 text-gray-300'>|</span>

      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
              >
                <FontAwesomeIcon icon={faPaintBrush} size='xl' color={selectedColor} />
                <span className="sr-only">Pick color</span>
                Color
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
        </Tooltip>
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

      <span className='mx-2 text-gray-300'>|</span>

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={!selectedObject}
            >
              <FontAwesomeIcon icon={faTrash} size='xl' />
              <span className="sr-only">Delete</span>
              Delete
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <span className='mx-2 text-gray-300'>|</span>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          onClick={onSave}
        >
          <FontAwesomeIcon icon={faSave} />
          <span className="sr-only">Save</span>
          Save
        </Button>
      </div>
    </div>
  )
}