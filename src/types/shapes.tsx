export interface Shape {
    id: string;
    type: ShapeType;
    x: number;
    y: number;
    rotation?: number;
    width?: number;
    height?: number;
    radius?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    draggable: boolean;
}

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'text' | 'image';

export interface ToolbarProps {
    onAddShape: (type: ShapeType, properties?: Partial<Shape>) => void;
    onDelete: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}