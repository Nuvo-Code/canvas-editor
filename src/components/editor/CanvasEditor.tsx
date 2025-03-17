import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Transformer, Image } from 'react-konva';
import { useShapeManager } from '@/hooks/useShapeManager';
import { useHistory } from '@/hooks/useHistory';
import { ShapeRenderer } from './ShapeRenderer';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { tshirt } from '@/lib/mockups';

export const CanvasEditor = () => {
  const [backgroundImage, setBackgroundImage] = useState(tshirt());
  const {
    shapes,
    selectedId,
    setSelectedId,
    getSelectedShape,
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

  const backgroundImageRef = useRef(null);
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
      rotation: node.rotation()
    };

    updateShape(id, updates);
    pushState(shapes);
  };

  const handleSelect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    setSelectedId(clickedOnEmpty ? null : e.target.id());
    if (clickedOnEmpty) {
      clearSelection();
    }
  };

  const clearSelection = () => {
    setSelectedId(null);
    transformerRef.current.nodes([]);
  };

  const handleExport = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "konva-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteShape(selectedId);
      pushState(shapes);
      clearSelection();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        clearSelection();
        break;
      case 'Delete':
      case 'Backspace':
        handleDelete();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const node = transformerRef.current.getStage().findOne('#' + selectedId);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else {
      clearSelection();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  return (
    <div className="flex flex-col p-4 gap-4 h-screen">
      <div className='flex justify-between items-center gap-4'>
        <Toolbar
          selectedObject={getSelectedShape()}
          onAddShape={handleShapeAdd}
          onDelete={() => handleDelete()}
          onSave={() => handleExport()}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant='outline' size="icon" className='h-full w-12 md:hidden'>
              <FontAwesomeIcon icon={faGear} size='lg' />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="hidden">
              <DrawerTitle>Properties</DrawerTitle>
              <DrawerDescription>Properties panel</DrawerDescription>
            </DrawerHeader>

            <div className='px-4 py-2'>
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
          </DrawerContent>
        </Drawer>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
        <div className="md:col-span-4 flex items-center justify-center border shadow rounded-md">
          <Stage
            width={600}
            height={600}
            ref={stageRef}
            onClick={handleSelect}
            onTap={handleSelect}
            className='bg-gray-100 w-[600px] h-[600px] overflow-scroll rounded-lg'
          >
            <Layer>
              {backgroundImage?.image && (
                <Image
                  ref={backgroundImageRef}
                  image={backgroundImage.image}
                  width={600}
                  height={600}
                />
              )}

              {shapes.map(shape => (
                <ShapeRenderer
                  key={shape.id}
                  shape={shape}
                  onTransformEnd={handleTransformEnd}
                  onDragEnd={() => pushState(shapes)}
                />
              ))}

              <Transformer
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  return newBox.width < 5 || newBox.height < 5 ? oldBox : newBox;
                }}
              />
            </Layer>
          </Stage>
        </div>

        <div className='hidden md:block'>
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
    </div>
  );
};

export default CanvasEditor;