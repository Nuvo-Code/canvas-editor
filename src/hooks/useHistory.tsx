import { useState, useEffect } from 'react';
import type { Shape } from '@/types/shapes';

export function useHistory(initialState: Shape[] = []) {
    const [history, setHistory] = useState<Shape[][]>([JSON.parse(JSON.stringify(initialState))]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [currentState, setCurrentState] = useState<Shape[]>(initialState);

    // Deep clone shapes to avoid reference issues
    const cloneShapes = (shapes: Shape[]): Shape[] => {
        return JSON.parse(JSON.stringify(shapes));
    };

    const pushState = (newState: Shape[]) => {
        // Don't push if the state is the same as the current one
        if (historyIndex >= 0 && JSON.stringify(newState) === JSON.stringify(history[historyIndex])) {
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