import { type Action, PlayerActionUnion } from "./types";

export const actionValidator = (action: Action): boolean => {
    if (action.actionType === PlayerActionUnion.RAISE) {
        return action.actionAmount > 0;
    }

    return action.actionAmount === 0;
}

