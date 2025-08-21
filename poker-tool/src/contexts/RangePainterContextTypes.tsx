import type { Action } from "../range_mgr/types";

interface RangePainterContextInterface {
  brushAction: Action;
  setBrushAction: (action: Action) => void;

  brushFrequency: number;
  setBrushFrequency: (frequency: number) => void;

  strategyColors: Map<string, string>;
  setStrategyColors: (colors: Map<string, string>) => void;

  palette: string[];
  setPalette: (palette: string[]) => void;
}

interface RangePainterContextProviderProps {
  children: React.ReactNode;
}

export type { RangePainterContextInterface, RangePainterContextProviderProps };
