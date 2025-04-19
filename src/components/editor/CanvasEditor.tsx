import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Transformer, Image } from 'react-konva';
import AlignmentGuides from './AlignmentGuides';
import { useShapeManager } from '@/hooks/useShapeManager';
import { useHistory } from '@/hooks/useHistory';
import { ShapeRenderer } from './ShapeRenderer';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { MockupSelector } from './MockupSelector';
import { LayerPanel } from './LayerPanel';

import { ExportDialog, ExportType } from './ExportDialog';
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
import { getExportPixelRatio } from '@/lib/utils';
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
  const designableAreaRef = useRef(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  // State for alignment guides
  const [guides, setGuides] = useState({ vertical: [], horizontal: [] });
  const [activeShape, setActiveShape] = useState(null);
  const SNAP_THRESHOLD = 10; // Distance in pixels to trigger snapping

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

    // Special handling for clipart
    if (type === 'clipart') {
      // Verify the image is valid
      if (!(properties.image instanceof HTMLImageElement)) {
        console.error('Invalid image for clipart:', properties.image);
        return; // Don't add invalid clipart
      }
    }

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
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  };

  const handleExport = (format: string, quality: number, filename: string, exportType: ExportType) => {
    if (stageRef.current) {
      // Store original states
      const designableAreaVisible = designableAreaRef.current?.visible();
      const backgroundVisible = backgroundImageRef.current?.visible();
      const originalSelectedId = selectedId;

      // Temporarily clear selection to avoid showing selection guidelines in export
      if (transformerRef.current) {
        transformerRef.current.nodes([]);
      }
      setSelectedId(null);

      // Apply visibility changes based on export type
      if ((exportType === 'no-dots' || exportType === 'no-background') && designableAreaRef.current) {
        designableAreaRef.current.visible(false);
      }

      if (exportType === 'no-background' && backgroundImageRef.current) {
        backgroundImageRef.current.visible(false);
      }

      // Get the configured export resolution
      const pixelRatio = getExportPixelRatio();

      // Force a redraw to ensure selection is cleared in the exported image
      stageRef.current.batchDraw();

      let dataURL;

      // For 'no-background' export type, crop to just the designable area
      if (exportType === 'no-background') {
        // Calculate crop dimensions based on designable area
        const cropX = designableArea.x;
        const cropY = designableArea.y;
        const cropWidth = designableArea.size;
        const cropHeight = designableArea.size;

        // Generate the image with cropping
        dataURL = stageRef.current.toDataURL({
          mimeType: format === 'jpeg' ? 'image/jpeg' : 'image/png',
          quality: format === 'jpeg' ? quality / 100 : 1,
          pixelRatio,
          x: cropX,
          y: cropY,
          width: cropWidth,
          height: cropHeight
        });
      } else {
        // Generate the full image for other export types
        dataURL = stageRef.current.toDataURL({
          mimeType: format === 'jpeg' ? 'image/jpeg' : 'image/png',
          quality: format === 'jpeg' ? quality / 100 : 1,
          pixelRatio
        });
      }

      // Restore original visibility
      if (designableAreaRef.current) {
        designableAreaRef.current.visible(designableAreaVisible);
      }

      if (backgroundImageRef.current) {
        backgroundImageRef.current.visible(backgroundVisible);
      }

      // Restore original selection if there was one
      if (originalSelectedId) {
        setSelectedId(originalSelectedId);
      }

      // Trigger download
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${filename}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Calculate alignment guides for the active shape
  const calculateGuides = (activeNode) => {
    if (!activeNode) return { vertical: [], horizontal: [] };

    // Get active shape dimensions
    const activeX = activeNode.x();
    const activeY = activeNode.y();
    const activeWidth = activeNode.width ? activeNode.width() : (activeNode.radius ? activeNode.radius() * 2 : 0);
    const activeHeight = activeNode.height ? activeNode.height() : (activeNode.radius ? activeNode.radius() * 2 : 0);

    // Points to check for alignment
    const activeLeft = activeX;
    const activeRight = activeX + activeWidth;
    const activeTop = activeY;
    const activeBottom = activeY + activeHeight;
    const activeMiddleX = activeX + activeWidth / 2;
    const activeMiddleY = activeY + activeHeight / 2;

    const verticalGuides = [];
    const horizontalGuides = [];

    // Add guides for designable area
    const designLeft = designableArea.x;
    const designRight = designableArea.x + designableArea.size;
    const designTop = designableArea.y;
    const designBottom = designableArea.y + designableArea.size;
    const designMiddleX = designableArea.x + designableArea.size / 2;
    const designMiddleY = designableArea.y + designableArea.size / 2;

    // Check for alignment with designable area
    // Vertical alignments (left, center, right)
    if (Math.abs(activeLeft - designLeft) < SNAP_THRESHOLD) {
      verticalGuides.push(designLeft);
    }
    if (Math.abs(activeMiddleX - designMiddleX) < SNAP_THRESHOLD) {
      verticalGuides.push(designMiddleX);
    }
    if (Math.abs(activeRight - designRight) < SNAP_THRESHOLD) {
      verticalGuides.push(designRight);
    }

    // Horizontal alignments (top, middle, bottom)
    if (Math.abs(activeTop - designTop) < SNAP_THRESHOLD) {
      horizontalGuides.push(designTop);
    }
    if (Math.abs(activeMiddleY - designMiddleY) < SNAP_THRESHOLD) {
      horizontalGuides.push(designMiddleY);
    }
    if (Math.abs(activeBottom - designBottom) < SNAP_THRESHOLD) {
      horizontalGuides.push(designBottom);
    }

    // Check for alignment with other shapes
    shapes.forEach(shape => {
      // Skip the active shape itself
      if (shape.id === activeNode.id()) return;
      if (shape.visible === false) return;

      // Get shape dimensions
      const shapeX = shape.x;
      const shapeY = shape.y;
      const shapeWidth = shape.width || (shape.radius ? shape.radius * 2 : 0);
      const shapeHeight = shape.height || (shape.radius ? shape.radius * 2 : 0);

      // Points to check for alignment
      const shapeLeft = shapeX;
      const shapeRight = shapeX + shapeWidth;
      const shapeTop = shapeY;
      const shapeBottom = shapeY + shapeHeight;
      const shapeMiddleX = shapeX + shapeWidth / 2;
      const shapeMiddleY = shapeY + shapeHeight / 2;

      // Vertical alignments (left, center, right)
      if (Math.abs(activeLeft - shapeLeft) < SNAP_THRESHOLD) {
        verticalGuides.push(shapeLeft);
      }
      if (Math.abs(activeMiddleX - shapeMiddleX) < SNAP_THRESHOLD) {
        verticalGuides.push(shapeMiddleX);
      }
      if (Math.abs(activeRight - shapeRight) < SNAP_THRESHOLD) {
        verticalGuides.push(shapeRight);
      }
      if (Math.abs(activeLeft - shapeRight) < SNAP_THRESHOLD) {
        verticalGuides.push(shapeRight);
      }
      if (Math.abs(activeRight - shapeLeft) < SNAP_THRESHOLD) {
        verticalGuides.push(shapeLeft);
      }

      // Horizontal alignments (top, middle, bottom)
      if (Math.abs(activeTop - shapeTop) < SNAP_THRESHOLD) {
        horizontalGuides.push(shapeTop);
      }
      if (Math.abs(activeMiddleY - shapeMiddleY) < SNAP_THRESHOLD) {
        horizontalGuides.push(shapeMiddleY);
      }
      if (Math.abs(activeBottom - shapeBottom) < SNAP_THRESHOLD) {
        horizontalGuides.push(shapeBottom);
      }
      if (Math.abs(activeTop - shapeBottom) < SNAP_THRESHOLD) {
        horizontalGuides.push(shapeBottom);
      }
      if (Math.abs(activeBottom - shapeTop) < SNAP_THRESHOLD) {
        horizontalGuides.push(shapeTop);
      }
    });

    // Remove duplicates
    const uniqueVertical = [...new Set(verticalGuides)];
    const uniqueHorizontal = [...new Set(horizontalGuides)];

    return { vertical: uniqueVertical, horizontal: uniqueHorizontal };
  };

  // Handle drag start - identify the active shape
  const handleDragStart = (e) => {
    // Only set active shape if we're not in an input field
    const activeElement = document.activeElement;
    const isInputActive = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.getAttribute('role') === 'textbox'
    );

    if (!isInputActive) {
      setActiveShape(e.target);
      // Clear guides initially
      setGuides({ vertical: [], horizontal: [] });
    }
  };

  // Handle drag move - calculate and update guides
  const handleDragMove = (e) => {
    // Skip if no active shape (could happen if drag started in input)
    if (!activeShape) return;

    // Calculate guides based on current position
    const guides = calculateGuides(e.target);
    setGuides(guides);

    // Apply snapping if needed
    const node = e.target;
    const nodeWidth = node.width ? node.width() : (node.radius ? node.radius() * 2 : 0);
    const nodeHeight = node.height ? node.height() : (node.radius ? node.radius() * 2 : 0);

    // Snap to vertical guides
    guides.vertical.forEach(guideX => {
      const nodeLeft = node.x();
      const nodeRight = nodeLeft + nodeWidth;
      const nodeMiddleX = nodeLeft + nodeWidth / 2;

      // Snap left edge
      if (Math.abs(nodeLeft - guideX) < SNAP_THRESHOLD) {
        node.x(guideX);
      }
      // Snap center
      else if (Math.abs(nodeMiddleX - guideX) < SNAP_THRESHOLD) {
        node.x(guideX - nodeWidth / 2);
      }
      // Snap right edge
      else if (Math.abs(nodeRight - guideX) < SNAP_THRESHOLD) {
        node.x(guideX - nodeWidth);
      }
    });

    // Snap to horizontal guides
    guides.horizontal.forEach(guideY => {
      const nodeTop = node.y();
      const nodeBottom = nodeTop + nodeHeight;
      const nodeMiddleY = nodeTop + nodeHeight / 2;

      // Snap top edge
      if (Math.abs(nodeTop - guideY) < SNAP_THRESHOLD) {
        node.y(guideY);
      }
      // Snap middle
      else if (Math.abs(nodeMiddleY - guideY) < SNAP_THRESHOLD) {
        node.y(guideY - nodeHeight / 2);
      }
      // Snap bottom edge
      else if (Math.abs(nodeBottom - guideY) < SNAP_THRESHOLD) {
        node.y(guideY - nodeHeight);
      }
    });
  };

  // Handle drag end - clear guides and update state
  const handleDragEnd = () => {
    // Only process if we have an active shape
    if (activeShape) {
      // Clear guides
      setGuides({ vertical: [], horizontal: [] });
      setActiveShape(null);
      // Save the state
      pushState(shapes);
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
    // Check if the active element is an input or textarea
    const activeElement = document.activeElement;
    const isInputActive = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.getAttribute('role') === 'textbox' ||
      activeElement.isContentEditable
    );

    // If we're in an input field, don't handle keyboard shortcuts
    if (isInputActive) {
      return;
    }

    // Only handle specific keyboard shortcuts for the canvas
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
      <div className="flex items-center justify-center border rounded-md bg-card shadow-md relative">
        <Stage
          width={600}
          height={600}
          ref={stageRef}
          onClick={handleSelect}
          onTap={handleSelect}
          className='bg-gray-100 w-[600px] h-[600px] overflow-scroll rounded-lg'
          tabIndex={-1} // Prevent stage from capturing tab focus
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
              ref={designableAreaRef}
              x={designableArea.x}
              y={designableArea.y}
              size={designableArea.size}
            />

            {/* Alignment guides */}
            <AlignmentGuides
              activeShape={activeShape}
              shapes={shapes}
              designableArea={designableArea}
              guides={guides}
            />

            {shapes.map(shape => (
              <ShapeRenderer
                key={shape.id}
                shape={shape}
                onTransformEnd={handleTransformEnd}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
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

        <footer className='w-full absolute bottom-0'>
          <div className="text-center text-xs text-muted-foreground p-2">
            Powered by <a href="https://nuvocode.com" target="_blank">Nuvo Code</a>
          </div>
        </footer>
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