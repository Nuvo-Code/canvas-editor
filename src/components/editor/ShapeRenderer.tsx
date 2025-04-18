import { Rect, Circle, RegularPolygon, Image, Text, Star, Line, Arrow } from 'react-konva';
import type { Shape } from '@/types/shapes';

interface ShapeRendererProps {
    shape: Shape;
    onTransformEnd: (e: any) => void;
    onDragEnd: () => void;
}

export const ShapeRenderer = ({ shape, onTransformEnd, onDragEnd }: ShapeRendererProps) => {
    // Don't render if shape is not visible
    if (shape.visible === false) {
        return null;
    }

    const commonProps = {
        id: shape.id,
        x: shape.x,
        y: shape.y,
        fill: shape.fill,
        stroke: shape.stroke,
        strokeWidth: shape.strokeWidth,
        rotation: shape.rotation || 0,
        draggable: shape.locked ? false : shape.draggable,
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
        case 'polygon':
            return <RegularPolygon
                {...commonProps}
                sides={shape.numPoints || 6}
                radius={shape.radius}
            />;
        case 'star':
            return <Star
                {...commonProps}
                numPoints={shape.numPoints || 5}
                innerRadius={shape.innerRadius || shape.radius! * 0.5}
                outerRadius={shape.outerRadius || shape.radius}
            />;
        case 'line':
            return <Line
                {...commonProps}
                points={shape.points || []}
                tension={shape.tension}
                lineCap={shape.lineCap as any}
                lineJoin={shape.lineJoin as any}
                dash={shape.dash}
            />;
        case 'arrow':
            return <Arrow
                {...commonProps}
                points={shape.points || []}
                tension={shape.tension}
                lineCap={shape.lineCap as any}
                lineJoin={shape.lineJoin as any}
                dash={shape.dash}
                pointerLength={10}
                pointerWidth={10}
            />;
        case 'text':
            return (
                <Text
                    {...commonProps}
                    text={shape.text}
                    fontSize={shape.fontSize}
                    fontFamily={shape.fontFamily || 'Arial'}
                    width={shape.width}
                    height={shape.height}
                    align={shape.alignment}
                    shadowColor={shape.shadowColor}
                    shadowBlur={shape.shadowBlur}
                    shadowOffsetX={shape.shadowOffsetX}
                    shadowOffsetY={shape.shadowOffsetY}
                />
            );
        case 'image':
            return <Image
                {...commonProps}
                image={shape.image}
                width={shape.width}
                height={shape.height}
            />;
        case 'clipart':
            // Clipart is just a special type of image
            return <Image
                {...commonProps}
                image={shape.image}
                width={shape.width}
                height={shape.height}
            />;
        default:
            return null;
    }
};