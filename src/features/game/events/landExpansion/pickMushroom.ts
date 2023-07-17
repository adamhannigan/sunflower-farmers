import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";

export type PickMushroomAction = {
  type: "mushroom.picked";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: PickMushroomAction;
};

export function pickMushroom({ state, action }: Options) {
  const copy = cloneDeep<GameState>(state);
  const mushrooms = copy.mushrooms?.mushrooms;

  if (!mushrooms) {
    throw new Error("Mushrooms not populated");
  }

  const mushroom = mushrooms[action.id];
  if (!mushroom) {
    throw new Error(`Mushroom not found: ${action.id}`);
  }

  delete mushrooms[action.id];

  const inventoryMushrooms = copy.inventory["Wild Mushroom"] ?? new Decimal(0);
  copy.inventory["Wild Mushroom"] = inventoryMushrooms.add(mushroom.amount);

  return copy;
}
