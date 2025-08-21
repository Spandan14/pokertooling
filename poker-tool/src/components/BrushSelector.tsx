import React, { useEffect, useState } from "react";
import { useRangePainterContext } from "../contexts/UseRangePainterContext";
import { actionSerializer } from "../range_mgr/utils/action_utils";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import { SliderPicker } from "react-color";
import type { Action, ACTION_TYPE_LABEL, PlayerAction } from "../range_mgr/types";
import { brand } from "../range_mgr/brand";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import { NumberField } from "@base-ui-components/react/number-field";
import { COLOR_PALETTE_SIZE } from "../contexts/RangePainterContextProvider";

// interface BrushSelectorProps { }

export const BrushSelector: React.FC = () => {
  const {
    brushAction,
    setBrushAction,
    brushFrequency,
    setBrushFrequency,
    strategyColors,
    setStrategyColors,
    palette,
  } = useRangePainterContext();

  const [currentPaletteIndex, setCurrentPaletteIndex] = useState<number>(1);
  const [color, setColor] = useState<string>(palette[0]);

  const colorChangeHandler = (color: { hex: string }) => {
    setColor(color.hex);
    const newStrategyColors = new Map(strategyColors);
    newStrategyColors.set(actionSerializer(brushAction), color.hex);
    setStrategyColors(newStrategyColors);
  }

  const updateColorFromActionChange = (newAction: Action) => {
    if (strategyColors.has(actionSerializer(newAction))) {
      setColor(strategyColors.get(actionSerializer(newAction))!);
      return;
    }

    // update strategy colors to use this default color 
    setColor(palette[currentPaletteIndex]);

    const newStrategyColors = new Map(strategyColors);
    newStrategyColors.set(actionSerializer(newAction), palette[currentPaletteIndex]);
    setStrategyColors(newStrategyColors);

    setCurrentPaletteIndex((currentPaletteIndex + 1) % COLOR_PALETTE_SIZE);
  }

  const handleBrushActionTypeChange = (event: SelectChangeEvent) => {
    const newAction: Action = {
      actionType: brand<PlayerAction, ACTION_TYPE_LABEL>(event.target.value as PlayerAction),
      actionAmount: brushAction.actionAmount,
    };

    setBrushAction(newAction);
    updateColorFromActionChange(newAction);
  }

  const handleBrushActionValueChange = (value: number | null) => {
    if (value !== null) {
      const newAction: Action = {
        ...brushAction,
        actionAmount: value
      };

      setBrushAction(newAction);
      updateColorFromActionChange(newAction);
    }
  }

  const frequencyMarks = [
    { value: 0, label: '0%' },
    { value: 50, label: '50%' },
    { value: 100, label: '100%' }
  ];

  return (
    <Stack direction="column" spacing={5} style={{ color: '#f0f0f0' }}>
      <SliderPicker
        color={color}
        onChangeComplete={colorChangeHandler}
        onChange={(color) => setColor(color.hex)}
      />
      <Stack direction="row" spacing={3} alignItems="center">
        <Select
          value={brushAction ? brushAction.actionType : ''}
          onChange={handleBrushActionTypeChange}
          label="Action Type"
          style={{ minWidth: 120, color: '#f0f0f0', backgroundColor: '#333' }}
        >
          <MenuItem value="CALL">Call</MenuItem>
          <MenuItem value="RAISE">Raise</MenuItem>
          <MenuItem value="FOLD">Fold</MenuItem>
          <MenuItem value="CHECK">Check</MenuItem>
          <MenuItem value="BET">Bet</MenuItem>
        </Select>
        <NumberField.Root defaultValue={5} min={0} max={100} step={1} onValueChange={handleBrushActionValueChange}>
          <NumberField.ScrubArea>
            <label>
              Amount
            </label>
            <NumberField.ScrubAreaCursor>
              <CursorGrowIcon />
            </NumberField.ScrubAreaCursor>
          </NumberField.ScrubArea>

          <NumberField.Group>
            <NumberField.Decrement>
              <MinusIcon />
            </NumberField.Decrement>
            <NumberField.Input />
            <NumberField.Increment>
              <PlusIcon />
            </NumberField.Increment>
          </NumberField.Group>
        </NumberField.Root>
      </Stack>

      <Slider
        value={brushFrequency}
        marks={frequencyMarks}
        onChange={(_, value) => setBrushFrequency(value as number)}
        step={1}
        min={0}
        max={100}
        sx={{
          '& .MuiSlider-markLabel': {
            color: '#f0f0f0',
          },
        }}
      />

    </Stack>
  );
}

// SOURCE: https://base-ui.com/react/components/number-field
function CursorGrowIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="26"
      height="14"
      viewBox="0 0 24 14"
      fill="black"
      stroke="white"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </svg>
  );
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.6"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H5M10 5H5M5 5V0M5 5V10" />
    </svg>
  );
}

function MinusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.6"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H10" />
    </svg>
  );
}
