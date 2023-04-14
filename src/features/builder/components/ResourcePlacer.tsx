import React, { useContext, useRef, useState } from "react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import Draggable from "react-draggable";
import classNames from "classnames";

import fruitPatch from "assets/fruit/apple/apple_tree.png";
import goldStone from "assets/resources/gold_small.png";
import ironStone from "assets/resources/iron_small.png";

import { FruitPatch } from "features/island/fruit/FruitPatch";
import { ResourceBUttons } from "./ResourceButtons";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { Stone } from "features/game/expansion/components/resources/Stone";
import { Iron } from "features/game/expansion/components/resources/Iron";
import { Gold } from "features/game/expansion/components/resources/Gold";
import { Plot } from "features/island/plots/Plot";
import { Tree } from "features/game/expansion/components/resources/Tree";
import { Layout } from "../lib/layouts";
import { Boulder } from "features/island/boulder/Boulder";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { MachineInterpreter } from "features/game/lib/gameMachine";
import { InventoryItemName } from "features/game/types/game";
import { Context } from "features/game/GameProvider";

interface ResourceProps {
  id: string;
  gameService: MachineInterpreter;
  selectedItem?: InventoryItemName;
  showTimers: boolean;
}

export const RESOURCES: Record<
  keyof Layout,
  {
    component: React.FC<ResourceProps>;
    icon: string;
    dimensions: Dimensions;
  }
> = {
  Tree: {
    component: Tree,
    icon: SUNNYSIDE.resource.tree,
    dimensions: {
      height: 2,
      width: 2,
    },
  },
  "Fruit Patch": {
    component: FruitPatch,
    icon: fruitPatch,
    dimensions: {
      height: 2,
      width: 2,
    },
  },
  "Stone Rock": {
    component: Stone,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: SUNNYSIDE.resource.small_stone,
  },
  "Iron Rock": {
    component: Iron,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: ironStone,
  },
  "Gold Rock": {
    component: Gold,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: goldStone,
  },
  "Crop Plot": {
    component: Plot,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: CROP_LIFECYCLE.Sunflower.seedling,
  },
  Boulder: {
    component: Boulder,
    dimensions: {
      height: 2,
      width: 2,
    },
    icon: SUNNYSIDE.resource.boulder,
  },
};

type Dimensions = {
  height: number;
  width: number;
};

interface Props {
  name: keyof Layout;
  onCancel: () => void;
  onPlace: (coords: Coordinates) => void;
}
export const ResourcePlacer: React.FC<Props> = ({
  name,
  onCancel,
  onPlace,
}) => {
  const { gameService } = useContext(Context);

  const nodeRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates>();
  const { component, dimensions } = RESOURCES[name];

  return (
    <>
      <ResourceBUttons
        onDecline={onCancel}
        onConfirm={() => onPlace(coordinates as Coordinates)}
      />
      <div
        className="absolute"
        //   style={{ zIndex: calculateZIndex(coordinates.y) }}
        style={{
          width: `${36 * GRID_WIDTH_PX}px`,
          height: `${36 * GRID_WIDTH_PX}px`,
          marginTop: "20px",
          marginLeft: "20px",
        }}
      >
        <Draggable
          nodeRef={nodeRef}
          grid={[GRID_WIDTH_PX, GRID_WIDTH_PX]}
          onStart={() => {
            setIsDragging(true);
          }}
          onDrag={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round((data.y / GRID_WIDTH_PX) * -1);
          }}
          onStop={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round((data.y / GRID_WIDTH_PX) * -1);
            console.log({ drop: { x, y } });
            setIsDragging(false);
            setCoordinates({ x, y });
          }}
        >
          <div
            ref={nodeRef}
            data-prevent-drag-scroll
            className={classNames("flex flex-col items-center", {
              "cursor-grab": !isDragging,
              "cursor-grabbing": isDragging,
            })}
            style={{ pointerEvents: "auto" }}
          >
            <div
              draggable={false}
              className=" w-full h-full relative img-highlight pointer-events-none"
              style={{
                //   zIndex: 100 + coordinates.y + 1,
                width: `${dimensions.width * GRID_WIDTH_PX}px`,
                height: `${dimensions.height * GRID_WIDTH_PX}px`,
              }}
            >
              {component({
                id: "0",
                gameService: gameService,
                showTimers: false,
              })}
            </div>
          </div>
        </Draggable>
      </div>
    </>
  );
};
