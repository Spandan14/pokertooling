import { useState } from 'react';
import './App.css'
import { RangeDisplay } from './components/Range'
import type { Hand, Range } from './range_mgr/types';
import { createDefaultRange, generateAllHands, handSerializer } from './range_mgr/utils'

function App() {
  const [range, setRange] = useState<Range>(createDefaultRange());

  const tileClickHandlers = new Map<string, (hand: Hand, range: Range) => void>();

  const tileHandler = (hand: Hand, range: Range) => {
    console.log(`Tile clicked: ${handSerializer(hand)}`);
    const newRange = { ...range };
    newRange.range.set(handSerializer(hand), ['a']);
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
