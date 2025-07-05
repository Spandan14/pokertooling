import type { Branded } from './brand';

export const PlayerPositionUnion = {
    SB: 'SB',
    BB: 'BB',
    UTG: 'UTG',
    UTG1: 'UTG+1',
    UTG2: 'UTG+2',
    LJ: 'LJ',
    HJ: 'HJ',
    CO: 'CO',
    BTN: 'BTN',
} as const;

export const PlayerActionUnion = {
    FOLD: 'FOLD',
    CALL: 'CALL',
    RAISE: 'RAISE',
    CHECK: 'CHECK',
    ALL_IN: 'ALL_IN',
} as const;

type PlayerPosition = typeof PlayerPositionUnion[keyof typeof PlayerPositionUnion];
type PlayerAction = typeof PlayerActionUnion[keyof typeof PlayerActionUnion];

type HISTORICAL_POSITION_LABEL = 'HistoricalPosition';
type HERO_POSITION_LABEL = 'HeroPosition';

type HistoricalPosition = Branded<PlayerPosition, HISTORICAL_POSITION_LABEL>;
type HeroPosition = Branded<PlayerPosition, HERO_POSITION_LABEL>;

type ACTION_TYPE_LABEL = 'ActionType';

type ActionType = Branded<PlayerAction, ACTION_TYPE_LABEL>;

interface Action {
    actionType: ActionType;
    actionAmount: number;
}

interface HistoryAction {
    playerPosition: HistoricalPosition;
    playerAction: Action;
}

interface History {
    playerCount: number;
    historyActions: HistoryAction[];
}

interface Hand {
    firstRank: number;
    secondRank: number;
    suited: boolean;
}

interface Range {
    heroPosition: HeroPosition;
    history: History;
    actions: Action[];
    range: Map<string, Map<string, number>>;
}

export type {
    PlayerPosition,
    PlayerAction,
    HISTORICAL_POSITION_LABEL,
    HERO_POSITION_LABEL,
    HistoricalPosition,
    HeroPosition,
    ACTION_TYPE_LABEL,
    ActionType,
    Action,
    HistoryAction,
    History,
    Hand,
    Range,
}
