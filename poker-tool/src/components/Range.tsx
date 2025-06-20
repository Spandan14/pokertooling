import './Range.css'
import '../styles/fonts.css'

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
  tileSize: number;
}

const aspectRatio = 1;

export const RangeDisplay: React.FC<RangeDisplayProps> = (props: RangeDisplayProps) => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const iso = React.useRef<Isotope | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (gridRef.current) {
        iso.current = new Isotope(gridRef.current, {
          itemSelector: '.grid-item',
          layoutMode: 'masonry',
          masonry: {
            horizontalOrder: true,
          },
        });
      }
    }, 0);

    return () => {
      clearTimeout(timeout);
      iso.current?.destroy();
    }
  }, [props.rangeMode]);

  const rangeHands = sortHands(Array.from(props.range.range.keys()));

  // const gridClass = 'grid-square';

  return (
    <div
      ref={gridRef}
      style={{
        width: props.tileSize * 13 * aspectRatio + 14,
        height: props.tileSize * 13 + 1,
        display: 'grid',
        border: '0.25px solid #f1dede',
        backgroundColor: '#f1dede',
      }}>
      {
        rangeHands.map((hand, idx) => (
          <Box
            key={idx}
            sx={{
              height: props.tileSize,
              width: props.tileSize * aspectRatio,
              alignItems: 'flex-end',
              // border: '0.25px solid white',
              margin: '0.5px',
              justifyContent: 'flex-end',
              padding: 0.4,
              display: 'flex',
              // color: hand.suited ? '#0000FF' : '#f1dede',
              color: 'white',
              backgroundColor: hand.suited ? '#0e1116' : '#0000FF',
              // backgroundColor: '#0e1116',
            }}
            className="grid-item">
            <p className={".inria-sans-light"}>{handSerializer(hand)}</p>
          </Box>
        ))
      }
    </div >
  )
}
