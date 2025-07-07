import type { Action } from "../range_mgr/types";

interface RangePainterContextInterface {
  brushAction: Action | undefined;
  setBrushAction: (action: Action | undefined) => void;

  brushFrequency: number;
  setBrushFrequency: (frequency: number) => void;

  strategyColors: Map<string, string>;
  setStrategyColors: (colors: Map<string, string>) => void;
}

interface RangePainterContextProviderProps {
  children: React.ReactNode;
}

export type { RangePainterContextInterface, RangePainterContextProviderProps };
