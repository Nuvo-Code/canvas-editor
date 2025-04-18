import { Rect } from 'react-konva';

interface DesignableAreaProps {
  x: number;
  y: number;
  size: number;
}

export const DesignableArea = ({ x, y, size }: DesignableAreaProps) => {
  return (
    <Rect
      x={x}
      y={y}
      width={size}
      height={size}
      stroke="#000000"
      strokeWidth={2}
      dash={[10, 5]} // Creates a dotted line
      fill="transparent"
      listening={false} // Makes it non-interactive
    />
  );
};

export default DesignableArea;
