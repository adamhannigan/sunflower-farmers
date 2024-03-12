import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";

import { EXPANSION_ORIGINS, LAND_SIZE } from "../lib/constants";
import { Coordinates, MapPlacement } from "./MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Pontoon } from "./Pontoon";

import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import landComplete from "assets/land/land_complete.png";
import lockIcon from "assets/skills/lock.png";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useActor } from "@xstate/react";
import { gameAnalytics } from "lib/gameAnalytics";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { getBumpkinLevel } from "features/game/lib/level";
import { Label } from "components/ui/Label";
import { NPC_WEARABLES } from "lib/npcs";
import { craftingRequirementsMet } from "features/game/lib/craftingRequirement";
import classNames from "classnames";
import {
  ExpansionRequirements as IExpansionRequirements,
  GameState,
  Inventory,
  Bumpkin,
} from "features/game/types/game";
import { expansionRequirements } from "features/game/events/landExpansion/revealLand";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ExpansionRequirements } from "components/ui/layouts/ExpansionRequirements";
import { Button } from "components/ui/Button";
import confetti from "canvas-confetti";

interface ExpandIconProps {
  onOpen: () => void;
  requirements: IExpansionRequirements;
  position: Coordinates;
  isLocked: boolean;
  canExpand: boolean;
  showHelper: boolean;
  inventory: Inventory;
}
export const ExpandIcon: React.FC<ExpandIconProps> = ({
  onOpen,
  requirements,
  position,
  isLocked,
  canExpand,
  showHelper,
  inventory,
}) => {
  const showRequirements = inventory["Basic Land"]?.lte(5);

  const { t } = useAppTranslation();
  return (
    <>
      <MapPlacement
        x={position.x - LAND_SIZE / 2}
        y={position.y + LAND_SIZE / 2}
        height={LAND_SIZE}
        width={LAND_SIZE}
      >
        <div className="w-full h-full flex flex-col items-center justify-center opacity-100">
          <img
            src={SUNNYSIDE.icons.expand}
            width={18 * PIXEL_SCALE}
            className={classNames(
              `relative cursor-pointer hover:img-highlight`,
              {
                "animate-pulsate": showHelper,
              }
            )}
            onClick={() => {
              onOpen();
            }}
          />
          {showRequirements && (
            <>
              <div className="flex mt-2 flex-wrap justify-center px-4 items-center">
                {getKeys(requirements.resources ?? {})
                  .filter((name) => name !== "Block Buck")
                  .map((name) => (
                    <div className="mr-3 flex items-center mb-1" key={name}>
                      <RequirementLabel
                        type="item"
                        item={name}
                        requirement={
                          new Decimal(requirements.resources[name] ?? 0)
                        }
                        balance={inventory[name] ?? new Decimal(0)}
                      />
                      {inventory[name]?.gte(
                        requirements.resources[name] ?? 0
                      ) && (
                        <img
                          src={SUNNYSIDE.icons.confirm}
                          className="h-4 ml-0.5"
                        />
                      )}
                    </div>
                  ))}
              </div>
              {isLocked && (
                <Label type="default" icon={lockIcon} className="mt-2">
                  {t("lvl")} {requirements.bumpkinLevel}
                </Label>
              )}
            </>
          )}
          {!showRequirements && (
            <>
              {canExpand ? (
                <Label
                  type="default"
                  icon={SUNNYSIDE.icons.confirm}
                  className="mt-2"
                >
                  {t("expand")}
                </Label>
              ) : (
                <Label
                  type="default"
                  icon={SUNNYSIDE.icons.cancel}
                  className="mt-2"
                >
                  {t("expand")}
                </Label>
              )}
            </>
          )}
        </div>
      </MapPlacement>
    </>
  );
};

export const ExpansionBuilding: React.FC<{
  state: GameState;
  onDone: () => void;
  onReveal: () => void;
}> = ({ state, onDone, onReveal }) => {
  // Land is still being built
  if (state.expansionConstruction) {
    const origin =
      EXPANSION_ORIGINS[state.inventory["Basic Land"]?.toNumber() ?? 3];

    // Being Built
    if (state.expansionConstruction.readyAt > Date.now()) {
      return (
        <MapPlacement
          x={origin.x - LAND_SIZE / 2}
          y={origin.y + LAND_SIZE / 2}
          height={LAND_SIZE}
          width={LAND_SIZE}
        >
          <Pontoon onDone={onDone} expansion={state.expansionConstruction} />
        </MapPlacement>
      );
    }

    // Ready
    return (
      <MapPlacement
        x={origin.x - LAND_SIZE / 2}
        y={origin.y + LAND_SIZE / 2}
        height={LAND_SIZE}
        width={LAND_SIZE}
      >
        <img
          src={landComplete}
          className="absolute cursor-pointer hover:img-highlight"
          onClick={onReveal}
          style={{
            width: `${PIXEL_SCALE * 66}px`,
            left: `${PIXEL_SCALE * 18}px`,
            bottom: `${PIXEL_SCALE * 12}px`,
          }}
        />
        <div
          className="absolute pointer-events-none animate-pulsate"
          style={{
            width: `${PIXEL_SCALE * 20}px`,
            left: `${PIXEL_SCALE * 42}px`,
            bottom: `${PIXEL_SCALE * 36}px`,
          }}
        >
          <img src={SUNNYSIDE.icons.disc} className="w-full" />
          <img
            src={SUNNYSIDE.icons.confirm}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 12}px`,
              left: `${PIXEL_SCALE * 4}px`,
              bottom: `${PIXEL_SCALE * 5}px`,
            }}
          />
        </div>
      </MapPlacement>
    );
  }

  return null;
};
/**
 * The next piece of land to expand into
 */
export const UpcomingExpansion: React.FC = () => {
  const [_, setRender] = useState(0);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showBumpkinModal, setShowBumpkinModal] = useState(false);

  const state = gameState.context.state;

  const requirements = expansionRequirements({ game: state });

  const { t } = useAppTranslation();

  const expansions =
    (gameState.context.state.inventory["Basic Land"]?.toNumber() ?? 3) + 1;

  const onExpand = () => {
    gameService.send("land.expanded");
    gameService.send("SAVE");

    const blockBucks = requirements?.resources["Block Buck"] ?? 0;
    if (blockBucks) {
      gameAnalytics.trackSink({
        currency: "Block Buck",
        amount: blockBucks,
        item: "Basic Land",
        type: "Fee",
      });
    }

    gameAnalytics.trackMilestone({
      event: `Farm:Expanding:Expansion${expansions}`,
    });

    setShowBumpkinModal(false);
  };

  const onReveal = () => {
    gameService.send("land.revealed");
    gameService.send("SAVE");

    confetti();
  };

  const nextPosition =
    EXPANSION_ORIGINS[state.inventory["Basic Land"]?.toNumber() ?? 0];

  const isLocked =
    getBumpkinLevel(state.bumpkin?.experience ?? 0) <
    (requirements?.bumpkinLevel ?? 0);

  const canExpand = craftingRequirementsMet(state, requirements);

  const showHelper =
    canExpand &&
    (state.bumpkin?.activity?.["Tree Chopped"] ?? 0) >= 3 &&
    // Only pulsate first 5 times
    state.inventory["Basic Land"]?.lte(4);

  const maxExpanded = expansions > 9;
  const islandType = state.island.type;

  const hasFullBasicIsland = maxExpanded && islandType === "basic";

  return (
    <>
      {state.expansionConstruction && (
        <ExpansionBuilding
          state={state}
          onDone={() => setRender((r) => r + 1)}
          onReveal={onReveal}
        />
      )}

      {!state.expansionConstruction && requirements && !hasFullBasicIsland && (
        <ExpandIcon
          canExpand={canExpand}
          inventory={state.inventory}
          isLocked={isLocked}
          onOpen={() => setShowBumpkinModal(true)}
          position={nextPosition}
          requirements={requirements as IExpansionRequirements}
          showHelper={showHelper ?? false}
        />
      )}

      <Modal show={showBumpkinModal} onHide={() => setShowBumpkinModal(false)}>
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES.grimbly}
          onClose={() => setShowBumpkinModal(false)}
        >
          <ExpansionRequirements
            inventory={state.inventory}
            bumpkin={state.bumpkin as Bumpkin}
            details={{
              description: translate("landscape.expansion.one"),
            }}
            requirements={requirements as IExpansionRequirements}
            actionView={
              <Button onClick={onExpand} disabled={!canExpand}>
                {t("expand")}
              </Button>
            }
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
