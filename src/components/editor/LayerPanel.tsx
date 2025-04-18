import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faLockOpen, faArrowUp, faArrowDown, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import type { Shape } from '@/types/shapes';

interface LayerPanelProps {
  shapes: Shape[];
  selectedId: string | null;
  onSelectShape: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  setShapes?: (shapes: Shape[]) => void; // Optional prop for drag and drop reordering
}

export const LayerPanel = ({
  shapes,
  selectedId,
  onSelectShape,
  onMoveLayer,
  onToggleVisibility,
  onToggleLock,
  setShapes
}: LayerPanelProps) => {
  // Reverse the shapes array to display in correct stacking order (top to bottom)
  const layerShapes = [...shapes].reverse();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const getLayerName = (shape: Shape) => {
    switch (shape.type) {
      case 'text':
        return `Text: ${shape.text?.substring(0, 15)}${shape.text && shape.text.length > 15 ? '...' : ''}`;
      case 'image':
        return 'Image';
      default:
        return shape.type.charAt(0).toUpperCase() + shape.type.slice(1);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';

    // Add a delay to set the drag image
    setTimeout(() => {
      const dragElement = document.getElementById(`layer-${index}`);
      if (dragElement) {
        // Create a clone of the element for the drag image
        const clone = dragElement.cloneNode(true) as HTMLElement;
        clone.style.width = `${dragElement.offsetWidth}px`;
        clone.style.height = `${dragElement.offsetHeight}px`;
        clone.style.opacity = '0.5';
        clone.style.position = 'absolute';
        clone.style.top = '-1000px';
        document.body.appendChild(clone);

        // Set the drag image
        e.dataTransfer.setDragImage(clone, 20, 20);

        // Remove the clone after a short delay
        setTimeout(() => {
          document.body.removeChild(clone);
        }, 100);
      }
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);

    if (dragIndex === dropIndex || !setShapes) return;

    // Create a copy of the reversed array
    const reorderedLayers = Array.from(layerShapes);
    // Remove the dragged item
    const [removed] = reorderedLayers.splice(dragIndex, 1);
    // Insert it at the new position
    reorderedLayers.splice(dropIndex, 0, removed);

    // Reverse back to get the original order and update the shapes
    const newShapes = [...reorderedLayers].reverse();
    setShapes(newShapes);

    // Reset drag state
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (layerShapes.length === 0) {
    return <p className="text-muted-foreground text-xs">No layers yet. Add shapes to your design.</p>;
  }

  // Version with HTML5 drag and drop
  if (setShapes) {
    return (
      <div className="space-y-2">
        {layerShapes.map((shape, index) => (
          <div
            id={`layer-${index}`}
            key={shape.id}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, index)}
            className={`flex items-center justify-between p-2 rounded-md border
              ${selectedId === shape.id ? 'bg-accent/20 border-accent' : 'border-border'}
              ${draggedIndex === index ? 'opacity-50' : ''}
              ${dragOverIndex === index ? 'border-primary border-2' : ''}
              cursor-grab active:cursor-grabbing`}
            onClick={() => onSelectShape(shape.id)}
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faGripVertical} size="sm" className="text-muted-foreground mr-2" />
              <span className="text-sm font-medium">{getLayerName(shape)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onToggleVisibility(shape.id);
                }}
              >
                <FontAwesomeIcon icon={shape.visible === false ? faEyeSlash : faEye} size="sm" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onToggleLock(shape.id);
                }}
              >
                <FontAwesomeIcon icon={shape.locked ? faLock : faLockOpen} size="sm" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback to arrow buttons if drag and drop is not enabled
  return (
    <div className="space-y-2">
      {layerShapes.map((shape, index) => (
        <div
          key={shape.id}
          className={`flex items-center justify-between p-2 rounded-md border
            ${selectedId === shape.id ? 'bg-accent/20 border-accent' : 'border-border'}`}
          onClick={() => onSelectShape(shape.id)}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{getLayerName(shape)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onToggleVisibility(shape.id);
              }}
            >
              <FontAwesomeIcon icon={shape.visible === false ? faEyeSlash : faEye} size="sm" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onToggleLock(shape.id);
              }}
            >
              <FontAwesomeIcon icon={shape.locked ? faLock : faLockOpen} size="sm" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onMoveLayer(shape.id, 'up');
              }}
              disabled={index === 0} // First item in the reversed array (top layer)
            >
              <FontAwesomeIcon icon={faArrowUp} size="sm" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onMoveLayer(shape.id, 'down');
              }}
              disabled={index === layerShapes.length - 1} // Last item in the reversed array (bottom layer)
            >
              <FontAwesomeIcon icon={faArrowDown} size="sm" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayerPanel;
