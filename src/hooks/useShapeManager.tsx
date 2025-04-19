import { useState } from 'react';
import { generateId } from '../lib/utils';
import type { Shape, ShapeType } from '../types/shapes';

export function useShapeManager() {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const getSelectedShape = () => shapes.find(shape => shape.id === selectedId);

    const addShape = (type: ShapeType, properties: Partial<Shape>) => {
        const newShape: Shape = {
            id: generateId(),
            type,
            x: 100,
            y: 100,
            draggable: true,
            visible: true,
            locked: false,
            ...properties
        };

        setShapes(prev => [...prev, newShape]);
        setSelectedId(newShape.id);

        return newShape;
    };

    const updateShape = (id: string, properties: Partial<Shape>) => {
        setShapes(prev =>
            prev.map(shape =>
                shape.id === id ? { ...shape, ...properties } : shape
            )
        );
    };

    const deleteShape = (id: string) => {
        setShapes(prev => prev.filter(shape => shape.id !== id));
        setSelectedId(null);
    };

    const moveLayer = (id: string, direction: 'up' | 'down') => {
        const shapeIndex = shapes.findIndex(shape => shape.id === id);
        if (shapeIndex === -1) return;

        const newShapes = [...shapes];
        if (direction === 'up' && shapeIndex < shapes.length - 1) {
            // Move up in the array means moving down in the visual stack (higher z-index)
            [newShapes[shapeIndex], newShapes[shapeIndex + 1]] =
            [newShapes[shapeIndex + 1], newShapes[shapeIndex]];
        } else if (direction === 'down' && shapeIndex > 0) {
            // Move down in the array means moving up in the visual stack (lower z-index)
            [newShapes[shapeIndex], newShapes[shapeIndex - 1]] =
            [newShapes[shapeIndex - 1], newShapes[shapeIndex]];
        }
        setShapes(newShapes);
    };

    const toggleShapeVisibility = (id: string) => {
        setShapes(prev =>
            prev.map(shape =>
                shape.id === id ? { ...shape, visible: shape.visible === false ? true : false } : shape
            )
        );
    };

    const toggleShapeLock = (id: string) => {
        setShapes(prev =>
            prev.map(shape =>
                shape.id === id ? { ...shape, locked: !shape.locked, draggable: shape.locked } : shape
            )
        );
    };

    return {
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
    };
}