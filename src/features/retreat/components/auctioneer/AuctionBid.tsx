import React from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import bg from "assets/ui/brown_background.png";
import token from "assets/icons/token_2.png";

import { Button } from "components/ui/Button";
import { Bid } from "features/game/types/game";

import { getImageUrl } from "features/goblins/tailor/TabContent";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { Auction, MachineInterpreter } from "features/game/lib/auctionMachine";
import { getKeys } from "features/game/types/craftables";
import { secondsToString } from "lib/utils/time";
import { Label } from "components/ui/Label";

interface Props {
  auction: Auction;
  auctionService: MachineInterpreter;
  bid: Bid;
}
export const AuctionBid: React.FC<Props> = ({
  auction,
  bid,
  auctionService,
}) => {
  const image = bid.collectible
    ? ITEM_DETAILS[bid?.collectible].image
    : getImageUrl(ITEM_IDS[bid.wearable as BumpkinItem]);

  const secondsLeft = !auction
    ? 0
    : Math.floor((auction.endAt - Date.now()) / 1000);

  return (
    <div className="flex justify-center flex-col w-full items-center">
      <div className="relative my-2">
        <img src={bg} className="w-48 object-contain rounded-md" />
        <div className="absolute inset-0">
          <img
            src={image}
            className="absolute w-1/2 z-20 object-cover mb-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      <span className="mt-1 ml-2 text-center mb-2 text-sm">
        You have placed your bid.
      </span>

      <div className="flex flex-wrap">
        {getKeys(bid.ingredients).map((name) => (
          <div className="flex items-center mb-2 mr-4" key={name}>
            <img src={ITEM_DETAILS[name].image} className="h-6 mr-1" />
            <span>{bid.ingredients[name]}</span>
          </div>
        ))}

        {!!bid.sfl && (
          <div className="flex items-center mb-2 mr-4">
            <img src={token} className="h-6 mr-1" />
            <span>{bid.sfl}</span>
          </div>
        )}
      </div>
      {secondsLeft > 0 && (
        <Label type="info">{`${secondsToString(secondsLeft, {
          length: "full",
        })} left`}</Label>
      )}

      <Button
        className="mt-2"
        disabled={auction.endAt > Date.now()}
        onClick={() => auctionService.send("CHECK_RESULTS")}
      >
        Reveal winners
      </Button>
    </div>
  );
};
