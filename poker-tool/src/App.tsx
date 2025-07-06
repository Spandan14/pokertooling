import { useState } from 'react';
import './App.css'
import { RangeDisplay } from './components/Range'
import { type Action, type ACTION_TYPE_LABEL, type Hand, type PlayerAction, type Range, PlayerActionUnion } from './range_mgr/types';
import { createDefaultRange } from './range_mgr/utils/range_utils';
import { brand } from './range_mgr/brand';
import { actionSerializer } from './range_mgr/utils/action_utils';
import { generateAllHands, handSerializer } from './range_mgr/utils/hand_utils';

function App() {
  const [range, setRange] = useState<Range>(createDefaultRange());
  const [strategyColors, setStrategyColors] = useState<Map<string, string>>(new Map<string, string>());

  const tileClickHandlers = new Map<string, (hand: Hand) => void>();
  const tileRightClickHandlers = new Map<string, (hand: Hand) => void>();

  const tilePainter = (hand: Hand) => {
    const newRange = { ...range };
    let strategy = newRange.range.get(handSerializer(hand));
    if (!strategy) {
      strategy = new Map<string, number>();
    }

    const newAction: Action = {
      actionType: brand<PlayerAction, ACTION_TYPE_LABEL>(PlayerActionUnion.CALL),
      actionAmount: Array.from(strategy.keys()).length,
    };

    strategy.set(actionSerializer(newAction), 25);
    newRange.range.set(handSerializer(hand), strategy);

    setStrategyColors(new Map(strategyColors.entries()).set(actionSerializer(newAction), '#FF0000'));

    setRange(newRange);
  }

  const tileRemover = (hand: Hand) => {
    const newRange = { ...range };
    const strategy = newRange.range.get(handSerializer(hand));

    if (!strategy) {
      return;
    }

    const actionToRemove: Action = {
      actionType: brand<PlayerAction, ACTION_TYPE_LABEL>(PlayerActionUnion.CALL),
      actionAmount: Array.from(strategy.keys()).length - 1,
    };

    if (strategy.get(actionSerializer(actionToRemove))) {
      strategy.delete(actionSerializer(actionToRemove));
    }

    newRange.range.set(handSerializer(hand), strategy);

    setRange(newRange);
  }

  const allHands = generateAllHands();
  allHands.forEach(hand => {
    tileClickHandlers.set(handSerializer(hand), tilePainter);
    tileRightClickHandlers.set(handSerializer(hand), tileRemover);
  });


  return (
    <>
      <RangeDisplay
        strategyColors={strategyColors}
        tileSize={60}
        range={range}
        setRange={setRange}
        tileClickHandlers={tileClickHandlers}
        tileRightClickHandlers={tileRightClickHandlers}
        rangeMode="SQUARE" />
    </>
  )
}

export default App
