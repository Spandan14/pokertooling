import { brand } from "../brand";
import type { HERO_POSITION_LABEL, PlayerPosition, Range } from "../types";
import { generateAllHands, handSerializer } from "./hand_utils";

export const createDefaultRange: () => Range = () => {
    const range: Map<string, Map<string, number>> = new Map();

    // Initialize the range with all possible hands
    const allHands = generateAllHands();
    allHands.forEach(hand => {
        range.set(handSerializer(hand), new Map<string, number>());
    });

    return {
        heroPosition: brand<PlayerPosition, HERO_POSITION_LABEL>('BTN'),
        history: {
            playerCount: 1,
            historyActions: [],
        },
        actions: [],
        range,
    };
}
