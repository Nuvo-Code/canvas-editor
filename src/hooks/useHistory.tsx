import { useState, useEffect } from 'react';
import type { Shape } from '@/types/shapes';

export function useHistory(initialState: Shape[] = []) {
    // Initialize history with a properly cloned version of the initial state
    const initialClone = () => {
        return initialState.map(shape => {
            const clonedShape = { ...shape };
            // Preserve image references
            if (shape.image instanceof HTMLImageElement) {
                clonedShape.image = shape.image;
            }
            return clonedShape;
        });
    };

    const [history, setHistory] = useState<Shape[][]>([initialClone()]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [currentState, setCurrentState] = useState<Shape[]>(initialClone());

    // Deep clone shapes to avoid reference issues
    const cloneShapes = (shapes: Shape[]): Shape[] => {
        // Create a deep clone that preserves HTMLImageElement references
        return shapes.map(shape => {
            // Create a shallow copy of the shape
            const clonedShape = { ...shape };

            // If the shape has an image property and it's an HTMLImageElement,
            // preserve the reference instead of trying to clone it
            if (shape.image instanceof HTMLImageElement) {
                // Keep the original image reference
                clonedShape.image = shape.image;
            }

            return clonedShape;
        });
    };

    const pushState = (newState: Shape[]) => {
        // Create a version of the state without image references for comparison
        const compareState = (state: Shape[]) => {
            return state.map(shape => {
                const { image, ...rest } = shape;
                return rest;
            });
        };

        // Don't push if the state is the same as the current one (ignoring image references)
        if (historyIndex >= 0 &&
            JSON.stringify(compareState(newState)) === JSON.stringify(compareState(history[historyIndex]))) {
            return;
        }

        const clonedState = cloneShapes(newState);
        const updatedHistory = history.slice(0, historyIndex + 1);
        setHistory([...updatedHistory, clonedState]);
        setHistoryIndex(historyIndex + 1);
        setCurrentState(clonedState);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const previousState = history[newIndex];
            setCurrentState(previousState);
            return previousState;
        }
        return currentState;
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            const nextState = history[newIndex];
            setCurrentState(nextState);
            return nextState;
        }
        return currentState;
    };

    return {
        pushState,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        currentState
    };
}