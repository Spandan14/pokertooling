import Box from "@mui/material/Box";
import type { Hand } from "../range_mgr/types";
import { handSerializer } from "../range_mgr/utils/hand_utils";

interface TileInfoProps {
  hand: Hand;
  tileSize: number;

  strategyColors: Map<string, string>;
  determineTileColor: (hand: Hand) => string;
  determineTileDisabled: (hand: Hand) => boolean;
}

export const TileInfo: React.FC<TileInfoProps> = (props: TileInfoProps) => {
  return (
    <div>
      <Box
        sx={{
          height: props.tileSize * 2.0 + 2,
          width: props.tileSize * 3.0 + 3,
          alignItems: 'flex-end',
          margin: '0.5px',
          justifyContent: 'flex-end',
          padding: 0.4,
          display: 'flex',
          color: 'white',
          border: '1px solid #f1dede',
          background: props.determineTileColor(props.hand),
          position: 'absolute',
          top: -1,
          left: -1,
          pointerEvents: 'none',
          zIndex: 1000,
        }}
        className={props.determineTileDisabled(props.hand) ? "grid-item disabled-tile" : "grid-item"}>
        <p className={"inria-sans-light tile-text"}>{handSerializer(props.hand)}</p>
      </Box>
    </div>
  );
}
