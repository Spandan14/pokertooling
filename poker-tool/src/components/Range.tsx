import './Range.css'
import '../styles/fonts.css'

import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Isotope from 'isotope-layout';
import type { Hand, Range } from '../range_mgr/types.ts';
import { handDeserializer, handSerializer, sortHands } from '../range_mgr/utils/hand_utils';
import { TileInfo } from './TileInfo.tsx';

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

  tileClickHandler: (hand: Hand) => number;
  tileRightClickHandler: (hand: Hand) => number;

  determineTileColor: (hand: Hand) => string;
  determineTileDisabled: (hand: Hand) => boolean;
}

const aspectRatio = 1;

export const RangeDisplay: React.FC<RangeDisplayProps> = (props: RangeDisplayProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const iso = useRef<Isotope | null>(null);

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

  const runTileClickHandler = (hand: Hand) => {
    props.tileClickHandler(hand);
  }

  const runTileRightClickHandler = (hand: Hand) => {
    props.tileRightClickHandler(hand);
  }

  const [tilePreviewEnabled, setTilePreviewEnabled] = useState<string | null>(null);

  return (
    <div
      ref={gridRef}
      style={{
        width: props.tileSize * 13 * aspectRatio + 14,
        height: props.tileSize * 13 + 1,
        display: 'grid',
        border: '0.25px solid #f1dede',
        backgroundColor: '#f1dede',
      }}
      onContextMenu={(e) => e.preventDefault()}>
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
              } else {
                setTilePreviewEnabled(handSerializer(hand));
              }
            }}
            onMouseLeave={() => {
              setTilePreviewEnabled(null);
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
              background: props.determineTileColor(hand),
            }}
            className={props.determineTileDisabled(hand) ? "grid-item disabled-tile" : "grid-item"}>
            {tilePreviewEnabled !== handSerializer(hand) && <p className={"inria-sans-light tile-text"}>{handSerializer(hand)}</p>}
            {tilePreviewEnabled === handSerializer(hand) && <TileInfo
              hand={hand}
              tileSize={props.tileSize}
              strategyColors={props.strategyColors}
              determineTileColor={props.determineTileColor}
              determineTileDisabled={props.determineTileDisabled} />}
          </Box>
        ))
      }
    </div >
  )
}
