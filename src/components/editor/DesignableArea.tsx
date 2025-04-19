import { forwardRef } from 'react';
import { Rect } from 'react-konva';

interface DesignableAreaProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const DesignableArea = forwardRef<any, DesignableAreaProps>(({ x, y, width, height }, ref) => {
  return (
    <Rect
      ref={ref}
      x={x}
      y={y}
      width={width}
      height={height}
      stroke="#000000"
      strokeWidth={2}
      dash={[10, 5]} // Creates a dotted line
      fill="transparent"
      listening={false} // Makes it non-interactive
    />
  );
});

export default DesignableArea;
