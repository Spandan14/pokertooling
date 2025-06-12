import './Range.css'
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import Isotope from 'isotope-layout';
import type { Hand, Range } from '../range_mgr/types.ts';
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
          horizontalOrder: true,
        },
      });
    }

    const adjustSmallSquares = () => {
      const items = document.querySelectorAll<HTMLDivElement>('.grid-item');

      items.forEach((item) => {
        const width = item.offsetWidth;
        const height = item.offsetHeight;

        // Match exactly 30x30 px
        if (width === 30 && height === 30) {
          const offset = parseInt(item.dataset.offset);

          const currentLeft = parseFloat(item.style.left || '0');
          console.log(item.dataset);
          item.style.left = `${currentLeft + offset}px`;
        }
      });
    };

    // Wait for Isotope to finish layout
    if (props.rangeMode === RangeModeUnion.MOSAIC) {
      iso.current?.on('layoutComplete', adjustSmallSquares);
      iso.current?.layout(); // trigger layout manually just in case
    }

    return () => {
      iso.current?.destroy();
    }
  }, [props.rangeMode]);

  const rangeHands = sortHands(Array.from(props.range.range.keys()));
  const widths = rangeHands.map((hand) => {
    return props.rangeMode === RangeModeUnion.SQUARE || hand.suited ? '30px' : '45px';
  })

  const heights = rangeHands.map((hand) => {
    return props.rangeMode === RangeModeUnion.SQUARE
      ? '30px'
      : ((!hand.suited && hand.firstRank !== hand.secondRank) ? '60px' : '30px');
  });

  const gridClass = props.rangeMode === RangeModeUnion.SQUARE ? 'grid-square' : 'grid-mosaic';

  // mosaic mode extra spacer insertion
  // const generateMosaic = () => {
  //   const boxes = [];
  //
  //   let i = 0;
  //   let j = 0;
  //   let k = 0;
  //   let sumWidth = 0;
  //
  //   while (i < rangeHands.length) {
  //     if (j == 13) {
  //       boxes.push(
  //         <Box key={k} sx={{ height: 30, width: 585 - sumWidth, border: 0.5 }} className="grid-item"></Box>
  //       )
  //       console.log(sumWidth);
  //       j = 0;
  //       sumWidth = 0;
  //     } else {
  //       sumWidth += parseInt(widths[i]);
  //       boxes.push(
  //         <Box key={k} sx={{ height: heights[i], width: widths[i], border: 0.5 }} className="grid-item">
  //           <p>{handSerializer(rangeHands[i])}</p>
  //         </Box>
  //       );
  //       i++;
  //       j++;
  //     }
  //     k++;
  //   }
  //
  //   return boxes;
  // }

  const calculateOffset = (hand: Hand) => {
    return (hand.firstRank - hand.secondRank - 1) * -15;
  }

  return (
    <div ref={gridRef} className={gridClass}>
      {rangeHands.map((hand, idx) => (
        <Box data-offset={calculateOffset(hand)} key={idx} sx={{ height: heights[idx], width: widths[idx], border: 0.5 }} className="grid-item">
          <p>{handSerializer(hand)}</p>
        </Box>
      ))}
    </div>
  )
}
