import { createContext, useState } from 'react';
import type { RangePainterContextInterface, RangePainterContextProviderProps } from './RangePainterContextTypes';
import type { Action, ACTION_TYPE_LABEL, PlayerAction } from '../range_mgr/types';
import { brand } from '../range_mgr/brand';
import iwanthue from 'iwanthue';
import { actionSerializer } from '../range_mgr/utils/action_utils';

const RangePainterContext = createContext<RangePainterContextInterface | undefined>(undefined);

// FIXME: put into brushselector props
export const COLOR_PALETTE_SIZE = 15;

export const RangePainterContextProvider = ({ children }: RangePainterContextProviderProps) => {
  const defaultAction: Action = {
    actionType: brand<PlayerAction, ACTION_TYPE_LABEL>('CALL' as PlayerAction),
    actionAmount: 0,
  };

  const [brushAction, setBrushAction] = useState<Action>(defaultAction);
  const [brushFrequency, setBrushFrequency] = useState<number>(20);

  const [palette, setPalette] = useState<string[]>(iwanthue(COLOR_PALETTE_SIZE));

  const defaultStrategyColors = new Map<string, string>();
  defaultStrategyColors.set(actionSerializer(defaultAction), palette[0]);

  const [strategyColors, setStrategyColors] = useState<Map<string, string>>(defaultStrategyColors);

  return (
    <RangePainterContext.Provider value={{
      brushAction, setBrushAction,
      brushFrequency, setBrushFrequency,
      strategyColors, setStrategyColors,
      palette, setPalette
    }}>
      {children}
    </RangePainterContext.Provider>
  );
}

export default RangePainterContext;
