import { brand } from "../brand";
import type { Action, ACTION_TYPE_LABEL, PlayerAction } from "../types";

export const actionSerializer = (action: Action): string => {
    return `${action.actionType}:${action.actionAmount}`;
}

export const actionDeserializer = (actionString: string): Action => {
    const [actionType, actionAmountStr] = actionString.split(':');
    const actionAmount = parseInt(actionAmountStr, 10);

    return {
        actionType: brand<PlayerAction, ACTION_TYPE_LABEL>(actionType as PlayerAction),
        actionAmount,
    };
}

export const actionComparator = (a: Action, b: Action): number => {
    const actionOrder: Record<PlayerAction, number> = {
        ALL_IN: 0,
        RAISE: 1,
        CALL: 2,
        CHECK: 3,
        FOLD: 4,
    };

    const orderA = actionOrder[a.actionType as PlayerAction];
    const orderB = actionOrder[b.actionType as PlayerAction];

    if (orderA !== orderB) {
        return orderA - orderB;
    }

    return a.actionAmount - b.actionAmount;
}


