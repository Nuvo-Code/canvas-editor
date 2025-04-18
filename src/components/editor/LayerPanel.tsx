import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faLockOpen, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import type { Shape } from '@/types/shapes';

interface LayerPanelProps {
  shapes: Shape[];
  selectedId: string | null;
  onSelectShape: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
}

export const LayerPanel = ({
  shapes,
  selectedId,
  onSelectShape,
  onMoveLayer,
  onToggleVisibility,
  onToggleLock
}: LayerPanelProps) => {
  // Reverse the shapes array to display in correct stacking order (top to bottom)
  const layerShapes = [...shapes].reverse();

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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Layers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {layerShapes.length === 0 ? (
          <p className="text-muted-foreground text-sm">No layers yet. Add shapes to your design.</p>
        ) : (
          layerShapes.map((shape) => (
            <div
              key={shape.id}
              className={`flex items-center justify-between p-2 rounded-md border ${
                selectedId === shape.id ? 'bg-accent/20 border-accent' : 'border-border'
              }`}
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
                  onClick={(e) => {
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
                  onClick={(e) => {
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(shape.id, 'up');
                  }}
                  disabled={layerShapes.indexOf(shape) === layerShapes.length - 1}
                >
                  <FontAwesomeIcon icon={faArrowUp} size="sm" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(shape.id, 'down');
                  }}
                  disabled={layerShapes.indexOf(shape) === 0}
                >
                  <FontAwesomeIcon icon={faArrowDown} size="sm" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default LayerPanel;
