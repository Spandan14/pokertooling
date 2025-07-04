import { brand } from "./brand";
import type { Hand, Range, Strategy, PlayerPosition, HERO_POSITION_LABEL } from "./types";

// Hands
const handComparator = (a: Hand, b: Hand): number => {
    if (a.firstRank === a.secondRank) {
        return b.suited ? -1 : 1;
    }

    if (a.suited !== b.suited) {
        return a.suited ? -1 : 1;
    }

    if (a.firstRank !== b.firstRank) {
        return b.firstRank - a.firstRank;
    }

    if (a.secondRank !== b.secondRank) {
        return b.secondRank - a.secondRank;
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

export const handDeserializer = (handString: string): Hand => {
    const rank1 = handString[0];
    const rank2 = handString[1];
    const suited = handString.endsWith('s');
    const firstRank = rank1 === 'T' ? 10 : rank1 === 'J' ? 11 : rank1 === 'Q' ? 12 : rank1 === 'K' ? 13 : rank1 === 'A' ? 14 : parseInt(rank1);
    const secondRank = rank2 === 'T' ? 10 : rank2 === 'J' ? 11 : rank2 === 'Q' ? 12 : rank2 === 'K' ? 13 : rank2 === 'A' ? 14 : parseInt(rank2);

    // key! really important because of how hands are serialized
    return suited ? { firstRank, secondRank, suited } : { secondRank, firstRank, suited };
}

export const generateAllHands = (): Hand[] => {
    const hands: Hand[] = [];
    for (let firstRank = 2; firstRank <= 14; firstRank++) {
        for (let secondRank = 2; secondRank <= 14; secondRank++) {
            if (firstRank === secondRank) {
                // Pocket pairs
                hands.push({ firstRank, secondRank, suited: false });
            } else {
                // suit determination
                hands.push({ firstRank, secondRank, suited: firstRank > secondRank });
            }
        }
    }
    return hands;
}



// Ranges
const defaultRangeBuilder: () => Range = () => {
    const range: Map<string, Strategy[]> = new Map();

    // Initialize the range with all possible hands
    const allHands = generateAllHands();
    allHands.forEach(hand => {
        range.set(handSerializer(hand), []);
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

export const createDefaultRange = defaultRangeBuilder;

