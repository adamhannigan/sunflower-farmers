import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { getTradeableDisplay } from "../lib/tradeables";
import { getItemId } from "../lib/offers";
import { TradeOffer } from "features/game/types/game";
import sflIcon from "assets/icons/sfl.webp";
import bg from "assets/ui/3x3_bg.png";
import { MarketplaceTradeableName } from "features/game/types/marketplace";

interface Props {
  id: string;
  offer: TradeOffer;
  authToken: string;
  onClose: () => void;
}
export const RemoveOffer: React.FC<Props> = ({
  id,
  onClose,
  offer,
  authToken,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const confirm = async () => {
    gameService.send("marketplace.offerCancelled", {
      effect: {
        type: "marketplace.offerCancelled",
        id,
      },
      authToken,
    });

    onClose();
  };

  if (!offer || !id) {
    return null;
  }

  const itemId = getItemId({ details: offer });
  const display = getTradeableDisplay({ id: itemId, type: offer.collection });
  const quantity = offer.items[display.name as MarketplaceTradeableName];

  return (
    <Panel>
      <div className="p-2">
        <Label type="danger" className="mb-2">
          {t("marketplace.cancelOffer")}
        </Label>
        <p className="text-sm mb-2">
          {t("marketplace.cancelOffer.areYouSure")}
        </p>
        <div>
          <div className="flex">
            <div className="h-12 w-12 mr-2 relative">
              <img src={bg} className="w-full rounded" />
              <img
                src={display.image}
                className="w-1/2 absolute"
                style={{
                  left: "50%",
                  transform: "translate(-50%, 50%)",
                  bottom: "50%",
                }}
              />
            </div>
            <div>
              <span className="text-sm">{`${quantity} x ${display.name}`}</span>
              <div className="flex items-center">
                <span className="text-sm">{`${offer.sfl} SFL`}</span>
                <img src={sflIcon} className="h-6 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          {t("no")}
        </Button>
        <Button onClick={confirm}>{t("yes")}</Button>
      </div>
    </Panel>
  );
};
