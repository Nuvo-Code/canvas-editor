import { Rect, Circle, RegularPolygon, Image, Text } from 'react-konva';
import type { Shape } from '@/hooks/useShapeManager';

interface ShapeRendererProps {
    shape: Shape;
    onTransformEnd: (e: any) => void;
    onDragEnd: () => void;
}

export const ShapeRenderer = ({ shape, onTransformEnd, onDragEnd }: ShapeRendererProps) => {
    const commonProps = {
        id: shape.id,
        x: shape.x,
        y: shape.y,
        fill: shape.fill,
        draggable: shape.draggable,
        onTransformEnd,
        onDragEnd,
    };

    switch (shape.type) {
        case 'rectangle':
            return <Rect {...commonProps} width={shape.width} height={shape.height} />;
        case 'circle':
            return <Circle {...commonProps} radius={shape.radius} />;
        case 'triangle':
            return <RegularPolygon {...commonProps} sides={3} radius={shape.radius} />;
        case 'text':
            return (
                <Text
                    {...commonProps}
                    text={shape.text}
                    fontSize={shape.fontSize}
                    fontFamily={shape.fontFamily}
                    width={shape.width}
                    height={shape.height}
                />
            );
        case 'image':
            return <Image {...commonProps} image={shape.image} width={shape.width} height={shape.height} />;
        default:
            return null;
    }
};