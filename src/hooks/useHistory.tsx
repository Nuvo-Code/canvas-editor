import { useState } from 'react';
import type { Shape } from './useShapeManager';

export function useHistory(initialState: Shape[] = []) {
    const [history, setHistory] = useState<Shape[][]>([initialState]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const pushState = (newState: Shape[]) => {
        const updatedHistory = history.slice(0, historyIndex + 1);
        setHistory([...updatedHistory, newState]);
        setHistoryIndex(historyIndex + 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            return history[historyIndex - 1];
        }
        return null;
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            return history[historyIndex + 1];
        }
        return null;
    };

    return {
        pushState,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1
    };
}