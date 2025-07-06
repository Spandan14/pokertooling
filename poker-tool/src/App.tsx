import { useState } from 'react';
import './App.css'
import { RangeDisplay } from './components/Range'
import { type Action, type ACTION_TYPE_LABEL, type Hand, type PlayerAction, type Range, PlayerActionUnion } from './range_mgr/types';
import { createDefaultRange } from './range_mgr/utils/range_utils';
import { brand } from './range_mgr/brand';
import { actionSerializer } from './range_mgr/utils/action_utils';
import { handSerializer } from './range_mgr/utils/hand_utils';
import { defaultBrushPainter, defaultBrushRemover } from './range_mgr/brushes';

function App() {
  const [range, setRange] = useState<Range>(createDefaultRange());

  const brushAction: Action = {
    actionType: brand<PlayerAction, ACTION_TYPE_LABEL>(PlayerActionUnion.CALL),
    actionAmount: 1,
  };
  const brushActionFrequency = 40;

  const defaultStrategyColors = new Map<string, string>([[actionSerializer(brushAction), '#FF0000']]);
  const [strategyColors] = useState<Map<string, string>>(defaultStrategyColors);

  const tilePainter = (hand: Hand): number => {
    let strategy = range.range.get(handSerializer(hand));
    if (!strategy) {
      strategy = new Map<string, number>();
    }

    const newStrategy = defaultBrushPainter(strategy, brushAction, brushActionFrequency);

    const newRange = { ...range };
    newRange.range.set(handSerializer(hand), newStrategy);

    setRange(newRange);

    return 0;
  }

  const tileRemover = (hand: Hand): number => {
    const strategy = range.range.get(handSerializer(hand));
    if (!strategy) {
      return 0; // No strategy to remove
    }

    const newStrategy = defaultBrushRemover(strategy, brushAction, brushActionFrequency);

    const newRange = { ...range };
    newRange.range.set(handSerializer(hand), newStrategy);

    setRange(newRange);

    return 0;
  }

  const determineTileColor = (hand: Hand): string => {
    if (range.range.get(handSerializer(hand)) === undefined) {
      return '#0e1116';
    }

    const strategies = range.range.get(handSerializer(hand));
    let color = 'linear-gradient(to right, ';
    let total = 0;

    strategies?.forEach((frequency: number, action: string) => {
      const strategyColor = strategyColors.get(action);
      color += `${strategyColor} ${total}%, `;
      total += frequency;
      color += `${strategyColor} ${total}%, `;
    })

    color += `#0e1116 ${total}%)`;

    return color;
  }

  const determineTileDisabled = (hand: Hand): boolean => {
    const strategies = range.range.get(handSerializer(hand));
    if (!strategies) {
      return false;
    }

    return Array.from(strategies.values()).reduce((a, b) => a + b, 0) + brushActionFrequency > 100;
  }

  return (
    <>
      <RangeDisplay
        strategyColors={strategyColors}
        tileSize={60}
        range={range}
        setRange={setRange}
        tileClickHandler={tilePainter}
        tileRightClickHandler={tileRemover}
        determineTileColor={determineTileColor}
        determineTileDisabled={determineTileDisabled}
        rangeMode="SQUARE" />
    </>
  )
}

export default App
