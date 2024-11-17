import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { OuterPanel, Panel } from "components/ui/Panel";
import {
  RestockItems,
  RestockNPC,
} from "features/game/events/landExpansion/enhancedRestock";
import {
  nextShipmentAt,
  canRestockShipment,
} from "features/game/events/landExpansion/shipmentRestocked";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { hasFeatureAccess } from "lib/flags";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import React, { useContext, useState } from "react";

import stockIcon from "assets/icons/stock.webp";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { NPC_WEARABLES } from "lib/npcs";
import { FullRestockModal } from "./FullRestockModal";
import { ShipmentRestockModal } from "./ShipmentRestockModal";
import { EnhancedRestockModal } from "./EnhancedRestockModal";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/decorations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

export const Restock: React.FC<{ npc: RestockNPC }> = ({ npc }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [showConfirm, setShowConfirm] = useState(false);

  const hasGemExperiment = hasFeatureAccess(state, "GEM_BOOSTS");
  const hasEnhancedRestockAccess = hasFeatureAccess(state, "ENHANCED_RESTOCK");

  const shipmentAt = useCountdown(nextShipmentAt({ game: state }));

  const { ...shipmentTime } = shipmentAt;
  const shipmentIsReady = canRestockShipment({ game: state });

  const showShipment = hasGemExperiment && shipmentIsReady;

  const hideConfirmModal = () => setShowConfirm(false);
  const showConfirmModal = () => setShowConfirm(true);

  if (showShipment) {
    return (
      <>
        <Button className="relative" onClick={showConfirmModal}>
          <div className="flex items-center h-4">
            <p>{t("restock")}</p>
            <img src={stockIcon} className="h-6 absolute right-1 top-0" />
          </div>
        </Button>
        <Modal show={showConfirm} onHide={hideConfirmModal}>
          <Panel className="sm:w-4/5 m-auto">
            <ShipmentRestockModal onClose={hideConfirmModal} />
          </Panel>
        </Modal>
      </>
    );
  }

  return (
    <>
      {hasGemExperiment && (
        <>
          <div className="flex justify-center items-center">
            <p className="text-xxs">{t("gems.nextFreeShipment")}</p>
          </div>
          <div className="flex justify-center items-center mb-2">
            <img src={stockIcon} className="h-5 mr-1" />
            <TimerDisplay time={shipmentTime} />
          </div>
        </>
      )}
      <Button className="mt-1 relative" onClick={showConfirmModal}>
        <div className="flex items-center h-4 ">
          <p>{t("restock")}</p>
          <img
            src={ITEM_DETAILS["Gem"].image}
            className="h-5 absolute right-1 top-1"
          />
        </div>
      </Button>
      <Modal show={showConfirm} onHide={hideConfirmModal}>
        <CloseButtonPanel
          className="sm:w-4/5 m-auto"
          bumpkinParts={NPC_WEARABLES[npc]}
          onClose={hideConfirmModal}
        >
          {hasEnhancedRestockAccess ? (
            <RestockSelectionModal
              npc={npc}
              hasGemExperiment={hasGemExperiment}
            />
          ) : (
            <FullRestockModal
              onClose={hideConfirmModal}
              hasGemExperiment={hasGemExperiment}
            />
          )}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

const RestockSelectionModal: React.FC<{
  npc: RestockNPC;
  hasGemExperiment: boolean;
}> = ({ npc, hasGemExperiment }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showEnhancedConfirm, setShowEnhancedConfirm] = useState(false);
  const { shopName, gemPrice, categoryLabel } = RestockItems[npc];
  const { labelText, icon } = categoryLabel;
  const shipmentAt = useCountdown(nextShipmentAt({ game: state }));

  const { ...shipmentTime } = shipmentAt;

  return (
    <>
      {!showEnhancedConfirm && !showConfirm && (
        <>
          <div className="flex flex-col p-2 items-start">
            <Label type="default" className="mb-2" icon={stockIcon}>
              {t("restock")}
            </Label>
            <span className="mb-1">{t("restock.outOfStock")}</span>
            <span>{t("restock.selectOption")}</span>
          </div>
          <OuterPanel>
            <div className="flex justify-between w-full mb-1">
              <Label type="default" className="capitalize">
                {t("restock.shop", { shopName })}
              </Label>
            </div>
            <div className="flex justify-between w-full mb-1">
              <div className="flex flex-col ml-1 mb-0.5">
                <span className="text-xs mb-1">{t("restocks")}</span>
                <Label type="default" icon={icon} className="ml-1 capitalize">
                  {labelText}
                </Label>
              </div>
              <div className="flex flex-col justify-end">
                <Button
                  onClick={() => setShowEnhancedConfirm(true)}
                  className="justify-between relative text-xs w-20 h-10"
                >
                  <div className="flex flex-row items-center h-4 ">
                    <p>{gemPrice}</p>
                    <img
                      src={ITEM_DETAILS["Gem"].image}
                      className="h-5 absolute right-1 top-0"
                    />
                  </div>
                </Button>
              </div>
            </div>
          </OuterPanel>
          <OuterPanel className="mt-1">
            <div className="flex justify-between w-full mb-1">
              <Label type="default" className="capitalize">
                {t("restock.full")}
              </Label>
            </div>
            <div className="flex justify-between w-full mb-1">
              <div className="flex flex-col ml-1 mb-0.5">
                <span className="text-xs">{t("restocks")}</span>
                <div>
                  {getKeys(RestockItems).map((npc) => {
                    const { labelText, icon } = RestockItems[npc].categoryLabel;
                    return (
                      <Label
                        key={npc}
                        type="default"
                        icon={icon}
                        className="mt-1 ml-1 capitalize"
                      >
                        {labelText}
                      </Label>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <Button
                  onClick={() => setShowConfirm(true)}
                  className="justify-between relative text-xs w-20 h-10"
                >
                  <div className="flex flex-row items-center h-4">
                    <p>{20}</p>
                    <img
                      src={ITEM_DETAILS["Gem"].image}
                      className="h-5 absolute right-1 top-0"
                    />
                  </div>
                </Button>
              </div>
            </div>
          </OuterPanel>
          {hasGemExperiment && shipmentTime && (
            <div className="px-1 text-xs flex flex-wrap mt-2">
              <span className="mr-2">{t("gems.nextFreeShipment")}</span>
              <TimerDisplay time={shipmentTime} />
              <img src={stockIcon} className="h-5 ml-1" />
            </div>
          )}
        </>
      )}
      {showEnhancedConfirm && (
        <EnhancedRestockModal
          onClose={() => setShowEnhancedConfirm(false)}
          shipmentTime={shipmentTime}
          npc={npc}
          hasGemExperiment={hasGemExperiment}
        />
      )}
      {showConfirm && (
        <FullRestockModal
          onClose={() => setShowConfirm(false)}
          shipmentTime={shipmentTime}
          hasGemExperiment={hasGemExperiment}
        />
      )}
    </>
  );
};
