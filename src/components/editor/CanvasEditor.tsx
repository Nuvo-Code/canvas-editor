import { useEffect, useRef } from 'react';
import { Stage, Layer, Transformer } from 'react-konva';
import { useShapeManager } from '@/hooks/useShapeManager';
import { useHistory } from '@/hooks/useHistory';
import { ShapeRenderer } from './ShapeRenderer';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';

export const CanvasEditor = () => {
  const {
    shapes,
    selectedId,
    setSelectedId,
    addShape,
    updateShape,
    deleteShape
  } = useShapeManager();

  const {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory(shapes);

  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  const handleShapeAdd = (type: string, properties = {}) => {
    const newShape = addShape(type, properties);
    pushState([...shapes, newShape]);
  };

  const handleTransformEnd = (e) => {
    const node = e.target;
    const id = node.id();
    const updates = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      ...(node.width && { width: node.width() * node.scaleX() }),
      ...(node.height && { height: node.height() * node.scaleY() }),
      ...(node.radius && { radius: node.radius() * node.scaleX() })
    };

    updateShape(id, updates);
    pushState(shapes);
  };

  const handleSelect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    setSelectedId(clickedOnEmpty ? null : e.target.id());
  };

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const node = transformerRef.current.getStage().findOne('#' + selectedId);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  return (
    <div className="flex flex-col p-4 gap-4 h-screen">
      <Toolbar
        onAddShape={handleShapeAdd}
        onDelete={() => selectedId && deleteShape(selectedId)}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div className="grid grid-cols-5 gap-4 h-full">
        <div className="col-span-4 flex items-center justify-center border shadow rounded-md">
          <div className="bg-gray-100 w-[600px] h-[600px] overflow-hidden">
            <Stage
              width={600}
              height={600}
              ref={stageRef}
              onClick={handleSelect}
              onTap={handleSelect}
            >
              <Layer>
                {shapes.map(shape => (
                  <ShapeRenderer
                    key={shape.id}
                    shape={shape}
                    onTransformEnd={handleTransformEnd}
                    onDragEnd={() => pushState(shapes)}
                  />
                ))}
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    return newBox.width < 5 || newBox.height < 5 ? oldBox : newBox;
                  }}
                />
              </Layer>
            </Stage>
          </div>
        </div>

        <PropertiesPanel
          selectedObject={shapes.find(shape => shape.id === selectedId)}
          onUpdate={(property, value) => {
            if (selectedId) {
              updateShape(selectedId, { [property]: value });
              pushState(shapes);
            }
          }}
        />
      </div>
    </div>
  );
};

export default CanvasEditor;