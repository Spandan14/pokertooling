import './Range.css'
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import Isotope from 'isotope-layout';
import type { Range } from '../range_mgr/types.ts';
import { handSerializer, sortHands } from '../range_mgr/utils.ts';

export const RangeModeUnion = {
  SQUARE: 'SQUARE',
  MOSAIC: 'MOSAIC',
} as const;

type RangeMode = typeof RangeModeUnion[keyof typeof RangeModeUnion];

interface RangeDisplayProps {
  range: Range;
  rangeMode: RangeMode;
}

export const RangeDisplay: React.FC<RangeDisplayProps> = (props: RangeDisplayProps) => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const iso = React.useRef<Isotope | null>(null);

  useEffect(() => {
    if (gridRef.current) {
      iso.current = new Isotope(gridRef.current, {
        itemSelector: '.grid-item',
        layoutMode: 'masonry',
        masonry: {
          columnWidth: 30,
          horizontalOrder: true,
        },
      });
    }

    return () => {
      iso.current?.destroy();
    }
  }, []);

  const rangeHands = sortHands(Array.from(props.range.range.keys()));
  const widths = rangeHands.map((hand) => {
    return props.rangeMode === RangeModeUnion.SQUARE || hand.suited ? '30px' : '45px';
  })

  const heights = rangeHands.map((hand) => {
    return props.rangeMode === RangeModeUnion.SQUARE
      ? '30px'
      : ((!hand.suited && hand.firstRank !== hand.secondRank) ? '60px' : '30px');
  });

  return (
    <div ref={gridRef} className="grid">
      {rangeHands.map((hand, idx) => (
        <Box key={idx} sx={{ height: heights[idx], width: widths[idx], border: 0.5 }} className="grid-item">
          <p>{handSerializer(hand)}</p>
        </Box>
      ))}
    </div>
  )
}
