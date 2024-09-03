import { GameState } from "features/game/types/game";
import {
  ResourceName,
  RESOURCE_DIMENSIONS,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlacePlotAction = {
  type: "plot.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlacePlotAction;
  createdAt?: number;
};

export function placePlot({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory["Crop Plot"] || new Decimal(0)).minus(
      Object.keys(game.crops).length,
    );

    if (available.lt(1)) {
      throw new Error("No plots available");
    }

    game.crops = {
      ...game.crops,
      [action.id as unknown as number]: {
        createdAt: createdAt,
        x: action.coordinates.x,
        y: action.coordinates.y,
        ...RESOURCE_DIMENSIONS["Crop Plot"],
      },
    };

    return game;
  });
}
