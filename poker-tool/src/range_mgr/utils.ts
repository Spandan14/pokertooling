import { brand } from "./brand";
import type { Hand, Range, Strategy, PlayerPosition, HERO_POSITION_LABEL } from "./types";

// Hands
const handComparator = (a: Hand, b: Hand): number => {
    // // Primary sort: by first rank (higher ranks first: A=14, K=13, etc.)
    if (a.firstRank !== b.firstRank) {
        return b.firstRank - a.firstRank;
    }

    // Secondary sort: by second rank (higher ranks first)
    if (a.secondRank !== b.secondRank) {
        return b.secondRank - a.secondRank;
    }

    // Tertiary sort: suited before offsuit for same hand
    if (a.suited !== b.suited) {
        return a.suited ? -1 : 1;
    }

    return 0;
}

export const sortHands = (hands: Hand[]): Hand[] => {
    return hands.slice().sort(handComparator);
};

const handRankToString = (rank: number): string => {
    switch (rank) {
        case 10: return 'T';
        case 11: return 'J';
        case 12: return 'Q';
        case 13: return 'K';
        case 14: return 'A';
        default: return rank.toString();
    }
}

export const handSerializer = (hand: Hand): string => {
    const higherRank = hand.firstRank > hand.secondRank ? hand.firstRank : hand.secondRank;
    const lowerRank = hand.firstRank < hand.secondRank ? hand.firstRank : hand.secondRank;

    return `${handRankToString(higherRank)}${handRankToString(lowerRank)}`
        + `${hand.firstRank === hand.secondRank ? '' : (hand.suited ? 's' : 'o')}`;
}


// Ranges
const defaultRangeBuilder: () => Range = () => {
    const range: Map<Hand, Strategy[]> = new Map();

    // Initialize the range with all possible hands
    for (let firstRank = 2; firstRank <= 14; firstRank++) {
        for (let secondRank = 2; secondRank <= 14; secondRank++) {
            if (firstRank === secondRank) {
                // Pocket pairs
                range.set({ firstRank, secondRank, suited: false }, []);
            } else {
                // suit deteermination
                range.set({ firstRank, secondRank, suited: firstRank > secondRank }, []);
            }
        }
    }

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

export const createDefaultRange = defaultRangeBuilder;

