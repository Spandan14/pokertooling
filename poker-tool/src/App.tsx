import { useState } from 'react';
import './App.css'
import { RangeDisplay } from './components/Range'
import { type Hand, type Range } from './range_mgr/types';
import { createDefaultRange } from './range_mgr/utils/range_utils';
import { handSerializer } from './range_mgr/utils/hand_utils';
import { defaultBrushPainter, defaultBrushRemover } from './range_mgr/brushes';
import { useRangePainterContext } from './contexts/UseRangePainterContext';
import { BrushSelector } from './components/BrushSelector';
import Grid from '@mui/material/Grid';

function App() {
  const [range, setRange] = useState<Range>(createDefaultRange());

  const {
    brushAction,
    brushFrequency,
    strategyColors,
  } = useRangePainterContext();

  const tilePainter = (hand: Hand): number => {
    if (!brushAction || brushFrequency <= 0) {
      return 0; // No action to paint
    }

    let strategy = range.range.get(handSerializer(hand));
    if (!strategy) {
      strategy = new Map<string, number>();
    }

    const newStrategy = defaultBrushPainter(strategy, brushAction, brushFrequency);

    const newRange = { ...range };
    newRange.range.set(handSerializer(hand), newStrategy);

    setRange(newRange);

    return 0;
  }

  const tileRemover = (hand: Hand): number => {
    if (!brushAction || brushFrequency <= 0) {
      return 0; // No action to remove
    }

    const strategy = range.range.get(handSerializer(hand));
    if (!strategy) {
      return 0; // No strategy to remove
    }

    const newStrategy = defaultBrushRemover(strategy, brushAction, brushFrequency);

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

    return Array.from(strategies.values()).reduce((a, b) => a + b, 0) + brushFrequency > 100;
  }

  return (
    <Grid container spacing={8}>
      <Grid size={8}>
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
      </Grid>
      <Grid size={4}>
        <BrushSelector />
      </Grid>
    </Grid>
  )
}

export default App
