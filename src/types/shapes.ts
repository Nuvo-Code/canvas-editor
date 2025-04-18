export type ShapeType = 
  | 'rectangle' 
  | 'circle' 
  | 'triangle' 
  | 'star' 
  | 'polygon' 
  | 'line' 
  | 'arrow' 
  | 'text' 
  | 'image';

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  draggable: boolean;
  visible: boolean;
  locked: boolean;
  rotation?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  align?: string;
  image?: HTMLImageElement;
  [key: string]: any; // Allow for additional properties
}

export interface ToolbarProps {
  selectedObject: Shape | undefined;
  onAddShape: (type: ShapeType, properties?: any) => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
