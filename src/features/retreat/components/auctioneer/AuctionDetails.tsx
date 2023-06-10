import React from "react";

import { Button } from "components/ui/Button";
import token from "assets/icons/token_2.png";
import bg from "assets/ui/brown_background.png";
import calendar from "assets/icons/calendar.png";

import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import Decimal from "decimal.js-light";
import { GoblinState } from "features/game/lib/goblinMachine";
import { getKeys } from "features/game/types/craftables";
import { setImageWidth } from "lib/images";
import { formatDateTime, secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import { Auction } from "features/game/lib/auctionMachine";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import classNames from "classnames";
import { InnerPanel, OuterPanel } from "components/ui/Panel";

type Props = {
  item: Auction;
  game: GoblinState;
  isUpcomingItem?: boolean;
  onDraftBid: () => void;
  onBack: () => void;
};

type TimeObject = {
  time: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
};

const TimerDisplay = ({ time }: TimeObject) => {
  const timeKeys = getKeys(time);

  const times = timeKeys.map((key) => {
    const value = time[key].toString().padStart(2, "0");

    return value;
  });
  return <span style={{ fontFamily: "monospace" }}>{times.join(":")}</span>;
};

export const AuctionDetails: React.FC<Props> = ({
  game,
  isUpcomingItem,
  item,
  onDraftBid,
  onBack,
}) => {
  const releaseDate = item?.startAt as number;
  const releaseEndDate = item?.endAt as number;
  const start = useCountdown(releaseDate);
  const end = useCountdown(releaseEndDate);

  const isMintStarted = Date.now() > releaseDate;

  const isMintComplete = Date.now() > releaseEndDate;

  const hasIngredients =
    getKeys(item.ingredients).every((name) =>
      (game.inventory[name] ?? new Decimal(0)).gte(item.ingredients[name] ?? 0)
    ) ?? false;

  const MintButton = () => {
    if (isUpcomingItem) {
      return null;
    }

    const hasMinted =
      item.type === "collectible"
        ? game.inventory[item.collectible]
        : game.wardrobe[item.wearable];
    if (CONFIG.NETWORK !== "mumbai" && hasMinted) {
      return <span className="text-sm">Already minted</span>;
    }

    return (
      <Button
        disabled={!isMintStarted || isMintComplete || !hasIngredients}
        onClick={onDraftBid}
      >
        Bid
      </Button>
    );
  };

  const image =
    item.type === "collectible"
      ? ITEM_DETAILS[item.collectible].image
      : getImageUrl(ITEM_IDS[item.wearable]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center mx-auto">
        <div className="flex items-center justify-between w-full pb-1">
          <img
            onClick={onBack}
            src={SUNNYSIDE.icons.arrow_left}
            className="h-8 cursor-pointer"
          />
          <p className="-ml-5">
            {item.type === "collectible" ? item.collectible : item.wearable}
          </p>
          <div />
        </div>

        <p className="text-center text-xs mb-3">
          {item.type === "collectible"
            ? ITEM_DETAILS[item.collectible].description
            : ""}
        </p>

        {/* {boost && (
          <Label className="mb-2 md:text-center" type="info">
            {`Boost: ${boost}`}
          </Label>
        )} */}

        <div className="relative mb-2">
          <img src={bg} className="w-48 object-contain rounded-md" />
          <div className="absolute inset-0">
            <img
              src={image}
              className="absolute w-1/2 z-20 object-cover mb-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <Label type="default" className="mb-2 absolute top-2 right-2">
              {`${item.supply} available`}
            </Label>
          </div>
        </div>
      </div>

      <div className="mb-2 flex items-center">
        <div className="flex items-center justify-center">
          {item.sfl > 0 && (
            <div className="flex items-center mr-3">
              <span className="text-sm mr-1">{item.sfl}</span>
              <img src={token} className="h-5" />
            </div>
          )}
          {getKeys(item.ingredients).map((name) => (
            <div className="flex items-center mr-3" key={name}>
              <span className="text-sm mr-1">{item.ingredients[name]}</span>
              <img src={ITEM_DETAILS[name].image} className="h-5" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-around flex-wrap">
        <div className="flex flex-col items-center w-48 mb-2">
          <p className="text-xs  underline mb-0.5">Starting Time</p>
          {isMintStarted ? (
            <Label type="warning" className="mt-1">
              Auction is live
            </Label>
          ) : (
            TimerDisplay({ time: start })
          )}
        </div>
        <div className="flex  flex-col  items-center  w-48  mb-2">
          <p className="text-xs  underline mb-0.5">Auction Period</p>
          {isMintComplete ? (
            <Label type="danger" className="mt-1">
              Auction closed
            </Label>
          ) : (
            TimerDisplay({ time: end })
          )}
        </div>
      </div>

      {MintButton()}
    </div>
  );
};
