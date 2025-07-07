import { createContext, useState } from 'react';
import type { RangePainterContextInterface, RangePainterContextProviderProps } from './RangePainterContextTypes';
import type { Action } from '../range_mgr/types';

const RangePainterContext = createContext<RangePainterContextInterface | undefined>(undefined);

export const RangePainterContextProvider = ({ children }: RangePainterContextProviderProps) => {
  const [brushAction, setBrushAction] = useState<Action | undefined>(undefined);
  const [brushFrequency, setBrushFrequency] = useState<number>(0);
  const [strategyColors, setStrategyColors] = useState<Map<string, string>>(new Map());

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
