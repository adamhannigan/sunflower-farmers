import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decimal } from "decimal.js-light";

import { GARBAGE, GarbageName } from "features/game/types/garbage";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { InventoryItemName } from "features/game/types/game";
import { isWearable } from "features/game/events/landExpansion/garbageSold";

export const GarbageSale: React.FC = () => {
  const { t } = useAppTranslation();
  const garbage = getKeys(GARBAGE).sort(
    (a, b) => GARBAGE[a].sellPrice - GARBAGE[b].sellPrice,
  );

  const [selectedName, setSelectedName] = useState<GarbageName>(garbage[0]);

  const selected = GARBAGE[selectedName];
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  // Undefined if zero
  const price = selected.sellPrice || undefined;
  const gems = selected.gems || undefined;
  const items = selected.items || undefined;

  const getAmount = (name: GarbageName) => {
    const selected = GARBAGE[name];

    let count = isWearable(name)
      ? availableWardrobe(state)[name as BumpkinItem] ?? 0
      : inventory[name as InventoryItemName] ?? new Decimal(0);
    if (new Decimal(count).gte(selected.limit ?? 0)) {
      count = new Decimal(count).minus(selected.limit ?? 0);
    }
    return new Decimal(count);
  };

  const sell = (amount = 1) => {
    gameService.send("garbage.sold", {
      item: selectedName,
      amount,
    });
  };

  return (
    <SplitScreenView
      panel={
        <ShopSellDetails
          details={{
            item: selectedName,
          }}
          properties={{
            coins: price,
            gems,
            items,
          }}
          actionView={<Action amount={getAmount(selectedName)} sell={sell} />}
        />
      }
      content={
        <>
          {garbage.map((name: GarbageName) => (
            <Box
              isSelected={selectedName === name}
              key={name}
              onClick={() => setSelectedName(name)}
              image={
                isWearable(name)
                  ? new URL(
                      `/src/assets/wearables/${ITEM_IDS[name as BumpkinItem]}.webp`,
                      import.meta.url,
                    ).href
                  : ITEM_DETAILS[name as InventoryItemName].image
              }
              count={getAmount(name)}
            />
          ))}
        </>
      }
    />
  );
};

const Action: React.FC<{
  amount: Decimal;
  sell: (amount?: number) => void;
}> = ({ amount, sell }) => {
  const { t } = useAppTranslation();

  return (
    <div className="flex space-x-1 w-full sm:flex-col sm:space-x-0 sm:space-y-1">
      <Button disabled={amount.lt(1)} onClick={() => sell(1)}>
        {t("sell.one")}
      </Button>
      <Button disabled={amount.lt(10)} onClick={() => sell(10)}>
        {t("sell.ten")}
      </Button>
    </div>
  );
};
