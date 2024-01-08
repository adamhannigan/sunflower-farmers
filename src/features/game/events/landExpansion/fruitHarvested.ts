import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { Equipped } from "features/game/types/bumpkin";
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";
import {
  FRUIT,
  FruitName,
  FRUIT_SEEDS,
  Fruit,
  FruitSeedName,
} from "features/game/types/fruits";
import {
  Bumpkin,
  Collectibles,
  GameState,
  PlantedFruit,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { getTimeLeft } from "lib/utils/time";
import { FruitPatch } from "features/game/types/game";
import { FruitCompostName } from "features/game/types/composters";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type HarvestFruitAction = {
  type: "fruit.harvested";
  index: string;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestFruitAction;
  createdAt?: number;
};

export const isFruitReadyToHarvest = (
  createdAt: number,
  plantedFruit: PlantedFruit,
  fruitDetails: Fruit
) => {
  const { seed } = FRUIT()[fruitDetails.name];
  const { plantSeconds } = FRUIT_SEEDS()[seed];

  return (
    createdAt -
      (plantedFruit.harvestedAt
        ? plantedFruit.harvestedAt
        : plantedFruit.plantedAt) >=
    plantSeconds * 1000
  );
};

type FruitYield = {
  name: FruitName;
  collectibles: Collectibles;
  buds: NonNullable<GameState["buds"]>;
  wearables: Equipped;
  fertiliser?: FruitCompostName;
};

export function isFruitGrowing(patch: FruitPatch) {
  const fruit = patch.fruit;
  if (!fruit) return false;

  const { name, amount, harvestsLeft, harvestedAt, plantedAt } = fruit;
  if (!harvestsLeft) return false;

  const { seed } = FRUIT()[name];
  const { plantSeconds } = FRUIT_SEEDS()[seed];

  if (harvestedAt) {
    const replenishingTimeLeft = getTimeLeft(harvestedAt, plantSeconds);
    if (replenishingTimeLeft > 0) return true;
  }

  const growingTimeLeft = getTimeLeft(plantedAt, plantSeconds);
  return growingTimeLeft > 0;
}

export function getFruitYield({
  collectibles,
  buds,
  name,
  wearables,
  fertiliser,
}: FruitYield) {
  let amount = 1;
  if (name === "Apple" && isCollectibleBuilt("Lady Bug", collectibles)) {
    amount += 0.25;
  }

  if (
    name === "Blueberry" &&
    isCollectibleBuilt("Black Bearry", collectibles)
  ) {
    amount += 1;
  }

  if (
    (name === "Apple" ||
      name === "Orange" ||
      name === "Blueberry" ||
      name === "Banana") &&
    wearables?.coat === "Fruit Picker Apron"
  ) {
    amount += 0.1;
  }

  if (fertiliser === "Fruitful Blend") {
    amount += 0.1;
  }

  if (name === "Banana" && wearables.necklace === "Banana Amulet") {
    amount += 0.5;
  }

  amount += getBudYieldBoosts(buds, name);

  return amount;
}

function getHarvestedAt(
  fruitName: FruitName,
  fruitSeedName: FruitSeedName,
  collectibles: Collectibles,
  wearables: BumpkinParts,
  createdAt: number
) {
  if (!fruitName) return createdAt;

  const fruitTime = FRUIT_SEEDS()[fruitSeedName].plantSeconds;
  const boostedTime = getFruitTime(
    fruitName,
    fruitSeedName,
    collectibles,
    wearables
  );

  const offset = fruitTime - boostedTime;

  return createdAt - offset * 1000;
}

const getFruitTime = (
  fruitName: FruitName,
  fruitSeedName: FruitSeedName,
  collectibles: Collectibles,
  wearables: BumpkinParts
) => {
  let seconds = FRUIT_SEEDS()[fruitSeedName]?.plantSeconds ?? 0;

  // Squirrel Monkey: 50% reduction
  if (
    fruitName === "Orange" &&
    isCollectibleBuilt("Squirrel Monkey", collectibles)
  ) {
    fruitSeedName === "Orange Seed";
    seconds = seconds * 0.5;
  }

  // Nana: 10% reduction
  if (fruitName === "Banana" && isCollectibleBuilt("Nana", collectibles)) {
    fruitSeedName === "Banana Plant";
    seconds = seconds * 0.9;
  }

  // Banana Onesie: 20% reduction
  if (fruitName === "Banana" && wearables.onesie === "Banana Onesie") {
    fruitSeedName === "Banana Plant";
    seconds = seconds * 0.8;
  }

  return seconds;
};

export function harvestFruit({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { fruitPatches, bumpkin, collectibles } = stateCopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const patch = fruitPatches[action.index];

  if (!patch) {
    throw new Error("Fruit patch does not exist");
  }

  if (!patch.fruit) {
    throw new Error("Nothing was planted");
  }

  const { name, plantedAt, harvestsLeft, harvestedAt, amount } = patch.fruit;

  const { seed } = FRUIT()[name];
  const { plantSeconds } = FRUIT_SEEDS()[seed];

  if (createdAt - plantedAt < plantSeconds * 1000) {
    throw new Error("Not ready");
  }

  if (createdAt - harvestedAt < plantSeconds * 1000) {
    throw new Error("Fruit is still replenishing");
  }

  if (!harvestsLeft) {
    throw new Error("No harvest left");
  }

  stateCopy.inventory[name] =
    stateCopy.inventory[name]?.add(amount) ?? new Decimal(amount);

  patch.fruit.harvestsLeft = patch.fruit.harvestsLeft - 1;
  patch.fruit.harvestedAt = getHarvestedAt(
    name,
    seed,
    stateCopy.collectibles,
    (stateCopy.bumpkin as Bumpkin).equipped,
    createdAt
  );

  patch.fruit.amount = getFruitYield({
    collectibles: collectibles,
    buds: stateCopy.buds ?? {},
    wearables: bumpkin.equipped,
    name,
    fertiliser: patch.fertiliser?.name,
  });

  const activityName: BumpkinActivityName = `${name} Harvested`;

  bumpkin.activity = trackActivity(activityName, bumpkin.activity);

  return stateCopy;
}
