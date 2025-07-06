import './Range.css'
import '../styles/fonts.css'

import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import Isotope from 'isotope-layout';
import type { Hand, Range } from '../range_mgr/types.ts';
import { handDeserializer, handSerializer, sortHands } from '../range_mgr/utils/hand_utils';

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

  strategyColors: Map<string, string>;

  tileClickHandlers: Map<string, (hand: Hand) => void>;
  tileRightClickHandlers: Map<string, (hand: Hand) => void>;
}

const aspectRatio = 1;

export const RangeDisplay: React.FC<RangeDisplayProps> = (props: RangeDisplayProps) => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const iso = React.useRef<Isotope | null>(null);

  const mouseButtonDown = useRef<null | number>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      mouseButtonDown.current = e.button;
    };

    const handleMouseUp = () => {
      mouseButtonDown.current = null;
    };

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

  const determineTileColor = (hand: Hand): string => {
    if (props.range.range.get(handSerializer(hand)) === undefined) {
      return '#0e1116';
    }

    const strategies = props.range.range.get(handSerializer(hand));
    let color = 'linear-gradient(to right, ';
    let total = 0;

    strategies?.forEach((frequency: number, action: string) => {
      const strategyColor = props.strategyColors.get(action);
      color += `${strategyColor} ${total}%, `;
      total += frequency;
      color += `${strategyColor} ${total}%, `;
    })

    color += `#0e1116 ${total}%)`;
    return color;
  }

  const runTileClickHandler = (hand: Hand) => {
    const handler = props.tileClickHandlers.get(handSerializer(hand));
    if (handler) {
      handler(hand);
    }
  }

  const runTileRightClickHandler = (hand: Hand) => {
    const handler = props.tileRightClickHandlers.get(handSerializer(hand));
    if (handler) {
      handler(hand);
    }
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
            onMouseDown={(event) => {
              if (event.button === 0) {
                runTileClickHandler(hand);
              } else if (event.button === 2) {
                runTileRightClickHandler(hand);
              }
            }}
            onMouseEnter={() => {
              if (mouseButtonDown.current === 0) {
                runTileClickHandler(hand);
              } else if (mouseButtonDown.current === 2) {
                runTileRightClickHandler(hand);
              }
            }}
            onContextMenu={(event) => {
              event.preventDefault();
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
              background: determineTileColor(hand),
            }}
            className="grid-item">
            <p className={"inria-sans-light tile-text"}>{handSerializer(hand)}</p>
          </Box>
        ))
      }
    </div >
  )
}
