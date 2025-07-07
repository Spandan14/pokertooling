import React from "react";
import RangePainterContext from "./RangePainterContextProvider";

export const useRangePainterContext = () => {
  const context = React.useContext(RangePainterContext);
  if (!context) {
    throw new Error("useRangePainterContext must be used within a RangePainterContextProvider");
  }
  return context;
}
