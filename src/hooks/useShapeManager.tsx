import { useState } from 'react';
import { generateId } from '@/lib/utils';

export interface Shape {
    id: string;
    type: 'rectangle' | 'circle' | 'triangle' | 'text' | 'image';
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    fill?: string;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    image?: HTMLImageElement;
    draggable: boolean;
}

export function useShapeManager() {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const addShape = (type: Shape['type'], properties: Partial<Shape>) => {
        const newShape: Shape = {
            id: generateId(),
            type,
            x: 100,
            y: 100,
            draggable: true,
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

    return {
        shapes,
        selectedId,
        setSelectedId,
        addShape,
        updateShape,
        deleteShape
    };
}