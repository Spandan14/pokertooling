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
