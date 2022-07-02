import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Section } from "lib/utils/hooks/useScrollIntoView";

import dragonfly from "assets/decorations/dragonfly.gif";
import Shark from "./water/Shark";

import goblinSwimming from "assets/npcs/goblin_swimming.gif";
import goblinSnorkling from "assets/npcs/goblin_snorkling.gif";
import swimmer from "assets/npcs/swimmer.gif";

export const Water: React.FC = () => {
  return (
    // Container
    <div
      style={{
        height: "650px",
        width: "1650px",
        left: "calc(50% - 1100px)",
        top: "calc(50% - 320px)",
      }}
      className="absolute"
    >
      <div className="h-full w-full relative">
        {/* Navigation Center Point */}
        <span
          id={Section.Water}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />

        <img
          src={dragonfly}
          className="absolute right-16 w-10 bottom-36 animate-float"
        />

        {/* <Frog /> */}
        <Shark />
        <img
          src={goblinSwimming}
          className="absolute "
          style={{
            width: `${GRID_WIDTH_PX * 5}px`,
            left: `${GRID_WIDTH_PX * 28}px`,
            top: `${GRID_WIDTH_PX * 2}px`,
          }}
        />

        <img
          src={goblinSnorkling}
          className="absolute "
          style={{
            width: `${GRID_WIDTH_PX * 3.5}px`,
            left: `${GRID_WIDTH_PX * 30}px`,
            top: `${GRID_WIDTH_PX * 12}px`,
          }}
        />

        <img
          src={swimmer}
          className="absolute "
          style={{
            width: `${GRID_WIDTH_PX * 0.85}px`,
            left: `${GRID_WIDTH_PX * 30}px`,
            top: `${GRID_WIDTH_PX * 3}px`,
            transform: "scaleX(-1)",
          }}
        />
      </div>
    </div>
  );
};
