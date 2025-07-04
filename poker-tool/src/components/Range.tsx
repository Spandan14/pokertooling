import './Range.css'
import '../styles/fonts.css'

import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import Isotope from 'isotope-layout';
import type { Hand, Range } from '../range_mgr/types.ts';
import { handDeserializer, handSerializer, sortHands } from '../range_mgr/utils.ts';

export const RangeModeUnion = {
  SQUARE: 'SQUARE',
  MOSAIC: 'MOSAIC',
} as const;

type RangeMode = typeof RangeModeUnion[keyof typeof RangeModeUnion];

interface RangeDisplayProps {
  range: Range;
  setRange: (range: Range) => void;

  rangeMode: RangeMode;
  tileSize: number;

  tileClickHandlers: Map<string, (hand: Hand, range: Range) => void>;
}

const aspectRatio = 1;

export const RangeDisplay: React.FC<RangeDisplayProps> = (props: RangeDisplayProps) => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const iso = React.useRef<Isotope | null>(null);

  const isMouseDown = useRef(false);

  useEffect(() => {
    const handleMouseDown = () => { isMouseDown.current = true; };
    const handleMouseUp = () => { isMouseDown.current = false; };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

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

  const rangeHands = sortHands(Array.from(props.range.range.keys())
    .map(handString => handDeserializer(handString)));
  console.log('Key hands:', Array.from(props.range.range.keys()));
  console.log('Range hands:', rangeHands);
  console.log('Range hands 2: ', rangeHands.map(hand => handSerializer(hand)));

  // const gridClass = 'grid-square';

  const tileColor = (hand: Hand): string => {
    if (props.range.range.get(handSerializer(hand)) !== undefined) {
      return props.range.range.get(handSerializer(hand))?.length == 0 ? '#0e1116' : '#0000FF';
    }

    return '#0e1116';
  }

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
            onMouseDown={() => {
              const handler = props.tileClickHandlers.get(handSerializer(hand));
              if (handler) {
                handler(hand, props.range);
              }
            }}
            onMouseEnter={() => {
              if (!isMouseDown.current) {
                return;
              }

              const handler = props.tileClickHandlers.get(handSerializer(hand));
              if (handler) {
                handler(hand, props.range);
              }
            }}
            key={idx}
            sx={{
              height: props.tileSize,
              width: props.tileSize * aspectRatio,
              alignItems: 'flex-end',
              margin: '0.5px',
              justifyContent: 'flex-end',
              padding: 0.4,
              display: 'flex',
              color: 'white',
              // backgroundColor: props.range.range.get(handSerializer(hand)) ? '#0e1116' : '#0000FF',
              backgroundColor: tileColor(hand),
              // backgroundColor: hand.suited ? '#0e1116' : '#0000FF',
            }}
            className="grid-item">
            <p className={"inria-sans-light tile-text"}>{handSerializer(hand)}</p>
          </Box>
        ))
      }
    </div >
  )
}
