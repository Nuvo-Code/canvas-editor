import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, RegularPolygon, Image, Text, Transformer } from 'react-konva';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';

// Dummy product image as a data URL
const DUMMY_PRODUCT_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%23f5f5f5"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="%23333" text-anchor="middle" dominant-baseline="middle">Product Background</text></svg>';

const CanvasEditor = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  // Load background image
  useEffect(() => {
    const image = new window.Image();
    image.src = DUMMY_PRODUCT_IMAGE;
    image.onload = () => {
      setBackgroundImage(image);
    };
  }, []);

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      // Find the selected node
      const selectedNode = transformerRef.current.getStage().findOne('#' + selectedId);
      if (selectedNode) {
        // Attach transformer to the selected node
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      // Clear transformer
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  // Save canvas state for undo/redo
  const saveCanvasState = () => {
    const newState = shapes.map(shape => ({ ...shape }));

    setHistory(prevHistory => {
      // If we're not at the end of the history, remove everything after current index
      const updatedHistory = historyIndex < prevHistory.length - 1
        ? prevHistory.slice(0, historyIndex + 1)
        : prevHistory;

      const newHistory = [...updatedHistory, newState];

      // Update history index
      setHistoryIndex(newHistory.length - 1);

      return newHistory;
    });
  };

  // Generate unique ID for shapes
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Add text to canvas
  const addText = () => {
    console.log('Adding text to canvas');
    const newText = {
      id: generateId(),
      type: 'text',
      x: 100,
      y: 100,
      text: 'Double click to edit',
      fontSize: 20,
      fontFamily: 'Arial',
      fill: '#000000',
      width: 200,
      height: 30,
      draggable: true,
    };

    const newShapes = [...shapes, newText];
    setShapes(newShapes);
    setSelectedId(newText.id);
    saveCanvasState();
    console.log('Text added to canvas');
  };

  // Add image to canvas
  const addImage = (url) => {
    // Default placeholder image as data URL if no URL is provided
    const defaultImageUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="%233498db"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">Image</text></svg>';

    const imageUrl = url || defaultImageUrl;
    const img = new window.Image();
    img.src = imageUrl;

    img.onload = () => {
      const newImage = {
        id: generateId(),
        type: 'image',
        x: 150,
        y: 150,
        image: img,
        width: img.width * 0.5,
        height: img.height * 0.5,
        draggable: true,
      };

      const newShapes = [...shapes, newImage];
      setShapes(newShapes);
      setSelectedId(newImage.id);
      saveCanvasState();
    };
  };

  // Add shape to canvas
  const addShape = (shape) => {
    console.log('Adding shape to canvas', shape);
    let newShape;

    switch (shape) {
      case 'rectangle':
        newShape = {
          id: generateId(),
          type: 'rectangle',
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          fill: '#3498db',
          draggable: true,
        };
        break;
      case 'circle':
        newShape = {
          id: generateId(),
          type: 'circle',
          x: 100,
          y: 100,
          radius: 50,
          fill: '#e74c3c',
          draggable: true,
        };
        break;
      case 'triangle':
        newShape = {
          id: generateId(),
          type: 'triangle',
          x: 100,
          y: 100,
          sides: 3,
          radius: 50,
          fill: '#2ecc71',
          draggable: true,
        };
        break;
      default:
        return;
    }

    const newShapes = [...shapes, newShape];
    setShapes(newShapes);
    setSelectedId(newShape.id);
    saveCanvasState();
  };

  // Delete selected object
  const deleteSelected = () => {
    if (!selectedId) return;

    const newShapes = shapes.filter(shape => shape.id !== selectedId);
    setShapes(newShapes);
    setSelectedId(null);
    saveCanvasState();
  };

  // Update object properties
  const updateObjectProperty = (property, value) => {
    if (!selectedId) return;

    const newShapes = shapes.map(shape => {
      if (shape.id === selectedId) {
        return { ...shape, [property]: value };
      }
      return shape;
    });

    setShapes(newShapes);
    saveCanvasState();
  };

  // Undo function
  const handleUndo = () => {
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setShapes(history[newIndex]);
  };

  // Redo function
  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setShapes(history[newIndex]);
  };

  // Download design as image
  const downloadDesign = () => {
    if (!stageRef.current) return;

    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 2,
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'product-design.png';
    link.click();
  };

  // Handle shape selection
  const handleSelect = (e) => {
    // Clear selection when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      return;
    }

    // Get the shape that was clicked
    const id = e.target.id();
    setSelectedId(id);
  };

  // Handle shape transformation
  const handleTransformEnd = (e) => {
    // Update shape after transformation
    const node = e.target;
    const id = node.id();

    const newShapes = shapes.map(shape => {
      if (shape.id === id) {
        // Get new position and size
        return {
          ...shape,
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
          scaleX: 1,
          scaleY: 1,
          rotation: node.rotation(),
        };
      }
      return shape;
    });

    setShapes(newShapes);
    saveCanvasState();
  };

  // Render shapes
  const renderShape = (shape) => {
    switch (shape.type) {
      case 'rectangle':
        return (
          <Rect
            key={shape.id}
            id={shape.id}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={shape.fill}
            draggable={shape.draggable}
            onDragEnd={saveCanvasState}
            onTransformEnd={handleTransformEnd}
          />
        );
      case 'circle':
        return (
          <Circle
            key={shape.id}
            id={shape.id}
            x={shape.x}
            y={shape.y}
            radius={shape.radius}
            fill={shape.fill}
            draggable={shape.draggable}
            onDragEnd={saveCanvasState}
            onTransformEnd={handleTransformEnd}
          />
        );
      case 'triangle':
        return (
          <RegularPolygon
            key={shape.id}
            id={shape.id}
            x={shape.x}
            y={shape.y}
            sides={3}
            radius={shape.radius}
            fill={shape.fill}
            draggable={shape.draggable}
            onDragEnd={saveCanvasState}
            onTransformEnd={handleTransformEnd}
          />
        );
      case 'text':
        return (
          <Text
            key={shape.id}
            id={shape.id}
            x={shape.x}
            y={shape.y}
            text={shape.text}
            fontSize={shape.fontSize}
            fontFamily={shape.fontFamily}
            fill={shape.fill}
            width={shape.width}
            height={shape.height}
            draggable={shape.draggable}
            onDragEnd={saveCanvasState}
            onTransformEnd={handleTransformEnd}
          />
        );
      case 'image':
        return (
          <Image
            key={shape.id}
            id={shape.id}
            x={shape.x}
            y={shape.y}
            image={shape.image}
            width={shape.width}
            height={shape.height}
            draggable={shape.draggable}
            onDragEnd={saveCanvasState}
            onTransformEnd={handleTransformEnd}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      <div className='col-span-1'>
        <Toolbar
          addText={addText}
          addImage={addImage}
          addShape={addShape}
          deleteSelected={deleteSelected}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          downloadDesign={downloadDesign}
        />
      </div>

      <div className="flex justify-center items-center col-span-3">
        <Stage
          width={600}
          height={600}
          ref={stageRef}
          onClick={handleSelect}
          onTap={handleSelect}
          className='rounded-md shadow-md'
        >
          <Layer>
            {/* Background */}
            {backgroundImage && (
              <Image
                image={backgroundImage}
                width={600}
                height={600}
              />
            )}

            {/* Shapes */}
            {shapes.map(shape => renderShape(shape))}

            {/* Transformer */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>

      <PropertiesPanel
        selectedObject={shapes.find(shape => shape.id === selectedId)}
        updateProperty={updateObjectProperty}
      />
    </div>
  );
};

export default CanvasEditor;
