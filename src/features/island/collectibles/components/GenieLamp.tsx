import React, { useContext, useState } from "react";

import { Context } from "features/game/GameProvider";

import genieLamp from "assets/sfts/genie_lamp.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { useActor } from "@xstate/react";
import Modal from "react-bootstrap/esm/Modal";

interface Props {
  id: string;
}

export const GenieLamp: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isRevealing, setIsRevealing] = useState(false);

  const wish = () => {
    // setIsShaking(true);
    setIsRevealing(true);

    // // Can only shake a Maneki every 24 hours (even if you have multiple)
    // if (hasShakenRecently) {
    //   return;
    // }

    gameService.send("REVEAL", {
      event: {
        type: "genieLamp.rubbed",
        id,
        createdAt: new Date(),
      },
    });
  };

  return (
    <>
      <img
        onClick={wish}
        src={genieLamp}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
        }}
        className="absolute cursor-pointer hover:img-highlight"
        alt="Genie Lamp"
      />
      {gameState.matches("revealing") && isRevealing && (
        <Modal show centered onHide={() => setIsRevealing(false)}>
          <Panel>
            <Revealing icon={genieLamp} />
          </Panel>
        </Modal>
      )}
      {gameState.matches("revealed") && isRevealing && (
        <Modal show centered onHide={() => setIsRevealing(false)}>
          <Panel>
            <Revealed />
          </Panel>
        </Modal>
      )}
    </>
  );
};
