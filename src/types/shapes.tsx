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
    visible?: boolean;
    locked?: boolean;
    alignment?: string;
    // Additional properties for new shape types
    points?: number[];  // For polygon, line, arrow
    numPoints?: number; // For star, polygon
    innerRadius?: number; // For star
    outerRadius?: number; // For star
    tension?: number; // For curved lines
    lineCap?: string; // For lines and arrows
    lineJoin?: string; // For lines and arrows
    dash?: number[]; // For dashed lines
    clipartType?: string; // For clipart/stickers
    shadowColor?: string; // For shadow effects
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    // Gradient properties
    fillLinearGradientStartPoint?: { x: number, y: number };
    fillLinearGradientEndPoint?: { x: number, y: number };
    fillLinearGradientColorStops?: number[];
}

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'text' | 'image' | 'star' | 'polygon' | 'line' | 'arrow' | 'clipart';

export interface ToolbarProps {
    selectedObject: Shape | undefined;
    onAddShape: (type: ShapeType, properties?: Partial<Shape>) => void;
    onDelete: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}