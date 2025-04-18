import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Transformer, Image } from 'react-konva';
import { useShapeManager } from '@/hooks/useShapeManager';
import { useHistory } from '@/hooks/useHistory';
import { ShapeRenderer } from './ShapeRenderer';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { MockupSelector } from './MockupSelector';
import { LayerPanel } from './LayerPanel';

import { ExportDialog } from './ExportDialog';
import { DesignableArea } from './DesignableArea';
import { DesignableAreaControls } from './DesignableAreaControls';
import { ProductOptions } from './ProductOptions';
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
import { tshirt, allMockups } from '@/lib/mockups';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import type { MockupProps } from '@/types/mockups';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export const CanvasEditor = () => {
  const [backgroundImage, setBackgroundImage] = useState(tshirt());
  // Fixed designable area - not editable
  const designableArea = {
    x: 150,  // Center of the 600x600 canvas, minus half the size
    y: 150,
    size: 300  // Size of the square designable area
  };

  const {
    shapes,
    setShapes,
    selectedId,
    setSelectedId,
    getSelectedShape,
    addShape,
    updateShape,
    deleteShape,
    moveLayer,
    toggleShapeVisibility,
    toggleShapeLock
  } = useShapeManager();

  const {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    currentState
  } = useHistory(shapes);

  // Sync shapes with history
  useEffect(() => {
    if (currentState && currentState !== shapes) {
      setShapes(currentState);
    }
  }, [currentState]);

  const backgroundImageRef = useRef(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  const handleShapeAdd = (type: string, properties = {}) => {
    // Set initial position to center of designable area
    const centerX = designableArea.x + (designableArea.size / 2);
    const centerY = designableArea.y + (designableArea.size / 2);

    // Estimate the size of the new shape
    const width = properties.width || (properties.radius ? properties.radius * 2 : 100);
    const height = properties.height || (properties.radius ? properties.radius * 2 : 100);

    // Calculate position so shape is centered in designable area
    const x = centerX - (width / 2);
    const y = centerY - (height / 2);

    // Create the new shape with constrained position
    const newShape = addShape(type, { ...properties, x, y });
    pushState([...shapes, newShape]);
  };

  // Keep elements within the designable area
  const constrainToDesignArea = (x, y, width, height) => {
    const designLeft = designableArea.x;
    const designRight = designableArea.x + designableArea.size;
    const designTop = designableArea.y;
    const designBottom = designableArea.y + designableArea.size;

    // Constrain x position
    let newX = x;
    if (x < designLeft) newX = designLeft;
    if (x + width > designRight) newX = designRight - width;

    // Constrain y position
    let newY = y;
    if (y < designTop) newY = designTop;
    if (y + height > designBottom) newY = designBottom - height;

    return { x: newX, y: newY };
  };

  const handleTransformEnd = (e) => {
    const node = e.target;
    const id = node.id();
    const shape = shapes.find(s => s.id === id);

    if (!shape) return;

    // Get the new position and dimensions
    const newX = node.x();
    const newY = node.y();
    const width = node.width ? node.width() : (shape.radius ? shape.radius * 2 : 100);
    const height = node.height ? node.height() : (shape.radius ? shape.radius * 2 : 100);

    // Constrain to design area
    const { x, y } = constrainToDesignArea(newX, newY, width, height);

    const updates = {
      x,
      y,
      rotation: node.rotation(),
      ...(node.width && { width: node.width() }),
      ...(node.height && { height: node.height() }),
      ...(node.radius && { radius: node.radius() })
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

  const handleExport = (format: string, quality: number, filename: string) => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({
        mimeType: format === 'jpeg' ? 'image/jpeg' : 'image/png',
        quality: format === 'jpeg' ? quality / 100 : 1,
        pixelRatio: 2 // Higher resolution
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${filename}.${format}`;
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

  const handleMockupChange = (mockup: MockupProps) => {
    setBackgroundImage(mockup);
  };





  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_300px] gap-4 h-screen p-4 bg-background text-foreground">
      {/* Left Column - Tools */}
      <div className="border rounded-md p-4 overflow-y-auto bg-card">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Design Tools</h2>
            <ThemeToggle />
          </div>

          <Toolbar
            selectedObject={getSelectedShape()}
            onAddShape={handleShapeAdd}
            onDelete={() => handleDelete()}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />

          <div className="pt-4 border-t">
            <h3 className="text-md font-medium mb-2">Product</h3>
            <MockupSelector
              onSelectMockup={handleMockupChange}
              currentMockup={backgroundImage.name}
            />
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-md font-medium mb-2">Actions</h3>
            <div className="flex flex-col gap-2">

              <ExportDialog onExport={handleExport} />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Column - Canvas */}
      <div className="flex items-center justify-center border rounded-md bg-card shadow-md">
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

            {/* Designable area with dotted border */}
            <DesignableArea
              x={designableArea.x}
              y={designableArea.y}
              size={designableArea.size}
            />

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

      {/* Right Column - Properties, Layers, Design Area */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        <div className="border rounded-md bg-card shadow-md">
          <Tabs defaultValue="layers" className="w-full p-2">
            <TabsList className="grid w-full grid-cols-2 top-0 bg-background z-10">
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
            <TabsContent value="layers" className="p-4">
              <LayerPanel
                shapes={shapes}
                selectedId={selectedId}
                onSelectShape={(id) => setSelectedId(id)}
                onMoveLayer={(id, direction) => {
                  moveLayer(id, direction);
                  pushState(shapes);
                }}
                onToggleVisibility={(id) => {
                  toggleShapeVisibility(id);
                  pushState(shapes);
                }}
                onToggleLock={(id) => {
                  toggleShapeLock(id);
                  pushState(shapes);
                }}
                setShapes={(newShapes) => {
                  console.log('Setting new shapes from drag and drop:', newShapes);
                  setShapes(newShapes);
                  pushState(newShapes);
                }}
              />
            </TabsContent>
            <TabsContent value="properties" className="p-4">
              {selectedId ? (
                <PropertiesPanel
                  selectedObject={shapes.find(shape => shape.id === selectedId)}
                  onUpdate={(property, value) => {
                    if (selectedId) {
                      updateShape(selectedId, { [property]: value });
                      pushState(shapes);
                    }
                  }}
                />
              ) : (
                <div className="text-muted-foreground text-xs">
                  Select an element to edit its properties
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Product Options Section */}
        <div className="border rounded-md bg-card shadow-md">
          <ProductOptions
            productName={`Custom ${backgroundImage.name}`}
            price={24.99}
          />
        </div>
      </div>

      {/* Mobile Drawer - Only visible on small screens */}
      <div className="md:hidden fixed bottom-4 right-4 z-10">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant='outline' size="icon" className='h-12 w-12 rounded-full shadow-lg'>
              <FontAwesomeIcon icon={faGear} size='lg' />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Properties</DrawerTitle>
              <DrawerDescription>Edit selected element properties</DrawerDescription>
            </DrawerHeader>

            <div className='px-4 py-2'>
              <Tabs defaultValue="properties" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="layers">Layers</TabsTrigger>
                </TabsList>
                <TabsContent value="properties" className="mt-4">
                  <PropertiesPanel
                    selectedObject={shapes.find(shape => shape.id === selectedId)}
                    onUpdate={(property, value) => {
                      if (selectedId) {
                        updateShape(selectedId, { [property]: value });
                        pushState(shapes);
                      }
                    }}
                  />
                </TabsContent>
                <TabsContent value="layers" className="mt-4">
                  <LayerPanel
                    shapes={shapes}
                    selectedId={selectedId}
                    onSelectShape={(id) => setSelectedId(id)}
                    onMoveLayer={(id, direction) => {
                      moveLayer(id, direction);
                      pushState(shapes);
                    }}
                    onToggleVisibility={(id) => {
                      toggleShapeVisibility(id);
                      pushState(shapes);
                    }}
                    onToggleLock={(id) => {
                      toggleShapeLock(id);
                      pushState(shapes);
                    }}
                    setShapes={(newShapes) => {
                      console.log('Setting new shapes from mobile drawer:', newShapes);
                      setShapes(newShapes);
                      pushState(newShapes);
                    }}
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-4 pt-4 border-t">
                <ProductOptions
                  productName={`Custom ${backgroundImage.name}`}
                  price={24.99}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default CanvasEditor;