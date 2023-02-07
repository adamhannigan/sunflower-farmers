import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import npc from "assets/events/valentine/npcs/cupid.gif";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const Cupid: React.FC = () => {
  return (
    <MapPlacement x={-8} y={2} height={1} width={3}>
      <div className="relative w-full h-full">
        <img
          src={npc}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 30}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
