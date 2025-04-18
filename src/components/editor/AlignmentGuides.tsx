import { Line } from 'react-konva';
import type { Shape } from '../../types/shapes';

interface AlignmentGuidesProps {
  activeShape: Shape | null;
  shapes: Shape[];
  designableArea: {
    x: number;
    y: number;
    size: number;
  };
  guides: {
    vertical: number[];
    horizontal: number[];
  };
}

export const AlignmentGuides = ({ guides, designableArea }: AlignmentGuidesProps) => {
  const { vertical, horizontal } = guides;

  return (
    <>
      {/* Vertical alignment guides */}
      {vertical.map((position, index) => (
        <Line
          key={`v-${index}`}
          points={[position, designableArea.y, position, designableArea.y + designableArea.size]}
          stroke="#0096FF" // Blue color for guides
          strokeWidth={1}
          dash={[4, 3]} // Dashed line
          listening={false} // Non-interactive
        />
      ))}

      {/* Horizontal alignment guides */}
      {horizontal.map((position, index) => (
        <Line
          key={`h-${index}`}
          points={[designableArea.x, position, designableArea.x + designableArea.size, position]}
          stroke="#0096FF" // Blue color for guides
          strokeWidth={1}
          dash={[4, 3]} // Dashed line
          listening={false} // Non-interactive
        />
      ))}
    </>
  );
};

export default AlignmentGuides;
