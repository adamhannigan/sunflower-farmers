import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext } from "react";
import { InlineDialogue } from "../TypingMessage";
import { SpecialEventModal } from "../SpecialEventModal";
import { NPC_WEARABLES } from "lib/npcs";
import { SpecialEventModalContent } from "../SpecialEventModalContent";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { SpecialEvent } from "features/game/types/specialEvents";

interface Props {
  onClose: () => void;
}

// Store per session
let RABIBTS_FOUND = 0;

const RABBITS = 6;

export function collectRabbit() {
  RABIBTS_FOUND += 1;
}

export const Hopper: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  if (RABIBTS_FOUND < RABBITS) {
    return (
      <CloseButtonPanel bumpkinParts={NPC_WEARABLES.hopper}>
        <div className="flex flex-col justify-center">
          <div className="flex flex-col justify-center p-2">
            <div className="flex justify-between items-center">
              <Label
                type="default"
                icon={SUNNYSIDE.icons.player}
                className="capitalize mb-2"
              >
                {`Hopper`}
              </Label>
              <Label type="info">
                Rabbits missing: {RABBITS - RABIBTS_FOUND}
              </Label>
            </div>
            <div
              style={{
                minHeight: "50px",
              }}
              className="mb-2"
            >
              <InlineDialogue
                trail={25}
                message={
                  "Oh no, my rabbits have gone missing again....they must be searching for food. Can you help me find them?"
                }
              />
            </div>
          </div>
        </div>
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES.hopper}>
      <SpecialEventModalContent
        eventName="Easter"
        onClose={onClose}
        event={
          gameState.context.state.specialEvents.current.Easter as SpecialEvent
        }
      />
    </CloseButtonPanel>
  );
};
