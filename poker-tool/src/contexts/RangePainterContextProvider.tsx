import { createContext, useState } from 'react';
import type { RangePainterContextInterface, RangePainterContextProviderProps } from './RangePainterContextTypes';
import type { Action, ACTION_TYPE_LABEL, PlayerAction } from '../range_mgr/types';
import { brand } from '../range_mgr/brand';
import { actionSerializer } from '../range_mgr/utils/action_utils';

const RangePainterContext = createContext<RangePainterContextInterface | undefined>(undefined);

export const RangePainterContextProvider = ({ children }: RangePainterContextProviderProps) => {
  const defaultAction: Action = {
    actionType: brand<PlayerAction, ACTION_TYPE_LABEL>('CALL'),
    actionAmount: 0,
  };

  const defaultColor = '#FF0000';

  const defaultStrategyColors = new Map();
  defaultStrategyColors.set(actionSerializer(defaultAction), defaultColor);

  const [brushAction, setBrushAction] = useState<Action>(defaultAction);
  const [brushFrequency, setBrushFrequency] = useState<number>(20);
  const [strategyColors, setStrategyColors] = useState<Map<string, string>>(defaultStrategyColors);

  return (
    <RangePainterContext.Provider value={{
      brushAction, setBrushAction,
      brushFrequency, setBrushFrequency,
      strategyColors, setStrategyColors
    }}>
      {children}
    </RangePainterContext.Provider>
  );
}

export default RangePainterContext;
