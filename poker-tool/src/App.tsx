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

  const tileClickHandlers = new Map<string, (hand: Hand, range: Range) => void>();

  const tileHandler = (hand: Hand, range: Range) => {
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

    setRange(newRange);
  }

  const allHands = generateAllHands();
  allHands.forEach(hand => {
    tileClickHandlers.set(handSerializer(hand), tileHandler);
  });

  return (
    <>
      <RangeDisplay
        tileSize={60}
        range={range}
        setRange={setRange}
        tileClickHandlers={tileClickHandlers}
        rangeMode="SQUARE" />
    </>
  )
}

export default App
