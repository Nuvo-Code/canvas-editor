import { useState } from 'react'
import type { ShapeType, ToolbarProps } from '@/types/shapes'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
import { faUndo, faRedo, faTriangleCircleSquare, faFileText, faTrash, faSquare, faPaintBrush } from '@fortawesome/free-solid-svg-icons'

export const Toolbar = ({
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
    { type: 'triangle', label: 'Triangle' }
  ]

  const handleShapeAdd = (type: ShapeType) => {
    const properties = {
      fill: selectedColor,
      ...(type === 'rectangle' && { width: 100, height: 100 }),
      ...(type === 'circle' && { radius: 50 }),
      ...(type === 'triangle' && { radius: 50 }),
      ...(type === 'text' && { text: 'Double click to edit', fontSize: 16, width: 200 })
    }
    onAddShape(type, properties)
  }

  return (
    <div className="flex items-center gap-2 p-2 border shadow rounded-md">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShapeAdd('text')}
        >
          <FontAwesomeIcon icon={faFileText} size='xl' />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <FontAwesomeIcon icon={faTriangleCircleSquare} size='xl' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col justify-center items-center w-32">
            {shapes.map(({ type, label }) => (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => handleShapeAdd(type)}
              >
                {label}
              </Button>
            ))}
          </PopoverContent>
        </Popover>

      </div>

      <Separator orientation="vertical" className="mx-2 h-6" />

      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-9 h-9"
              >
                <FontAwesomeIcon icon={faPaintBrush} size='xl' color={selectedColor} />
                <span className="sr-only">Pick color</span>
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

      <Separator orientation="vertical" className="mx-2 h-6" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <FontAwesomeIcon icon={faTrash} size='xl' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete selected</p>
        </TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-2 h-6" />

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <FontAwesomeIcon icon={faUndo} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <FontAwesomeIcon icon={faRedo} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}