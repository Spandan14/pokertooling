import type { Action } from "./types";
import { actionSerializer } from "./utils/action_utils";

export const defaultBrushPainter = (strategy: Map<string, number>, action: Action, actionFrequency: number): Map<string, number> => {
    if (Array.from(strategy.values()).reduce((a, b) => a + b, 0) + actionFrequency > 100) {
        return strategy; // Prevents exceeding 100% frequency
    }

    const newStrategy = new Map<string, number>(strategy);
    const actionKey = actionSerializer(action);

    if (newStrategy.has(actionKey)) {
        newStrategy.set(actionKey, newStrategy.get(actionKey)! + actionFrequency);
    } else {
        newStrategy.set(actionKey, actionFrequency);
    }

    return newStrategy;
}

export const defaultBrushRemover = (strategy: Map<string, number>, action: Action, actionFrequency: number): Map<string, number> => {
    const newStrategy = new Map<string, number>(strategy);
    const actionKey = actionSerializer(action);

    if (newStrategy.has(actionKey)) {
        const currentFrequency = newStrategy.get(actionKey)!;
        if (currentFrequency > actionFrequency) {
            newStrategy.set(actionKey, currentFrequency - actionFrequency);
        } else {
            newStrategy.delete(actionKey);
        }
    }

    return newStrategy;
}

