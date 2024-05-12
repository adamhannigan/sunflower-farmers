import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/regular_pawn.webp";

export const RegularPawn: React.FC = () => {
  return (
    <img
      src={image}
      style={{
        width: `${PIXEL_SCALE * 8}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
      }}
      className="absolute left-1/2 transform -translate-x-1/2"
      alt="RegularPawn"
    />
  );
};
