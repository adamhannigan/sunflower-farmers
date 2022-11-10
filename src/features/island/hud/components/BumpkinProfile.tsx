import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import question from "assets/icons/expression_confused.png";
import progressBarSprite from "assets/ui/profile/progress_bar_sprite.png";
import profileBg from "assets/ui/profile/bg.png";
import lvlUp from "assets/ui/profile/lvl_up.png";

import { BumpkinModal } from "features/bumpkins/components/BumpkinModal";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Context } from "features/game/GameProvider";
import { Equipped as BumpkinParts } from "features/game/types/bumpkin";
import {
  BumpkinLevel,
  getBumpkinLevel,
  LEVEL_BRACKETS,
} from "features/game/lib/level";
import {
  acknowledgeSkillPoints,
  hasUnacknowledgedSkillPoints,
} from "features/island/bumpkin/lib/skillPointStorage";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";

const DIMENSIONS = {
  width: 52,
  height: 48,
  bumpkin: {
    width: 100,
    marginTop: -45,
  },
  level: {
    marginLeft: 108,
    marginTop: 74,
    width: 27,
  },
  skillsMark: {
    marginLeft: 116,
    marginTop: 48,
  },
};

const MOBILE_DIMENSIONS = {
  width: 39,
  height: 36,
  bumpkin: {
    width: 75,
    marginTop: -34,
  },
  level: {
    marginLeft: 80,
    marginTop: 54,
    width: 20,
  },
  skillsMark: {
    marginLeft: 85,
    marginTop: 25,
  },
};

const SPRITE_STEPS = 50;

export const BumpkinProfile: React.FC = () => {
  const progressBarEl = useRef<SpriteSheetInstance>();
  const [viewSkillsPage, setViewSkillsPage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dimensions, setDimensions] = useState(DIMENSIONS);
  const [isMobile] = useIsMobile();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const experience = state.bumpkin?.experience ?? 0;
  const level = getBumpkinLevel(experience);
  const showSkillPointAlert = hasUnacknowledgedSkillPoints(state.bumpkin);

  useEffect(() => {
    setDimensions(
      isMobile ? { ...DIMENSIONS, ...MOBILE_DIMENSIONS } : DIMENSIONS
    );
  }, [isMobile]);

  useEffect(() => {
    goToProgress();
  }, [level, experience]);

  const handleShowHomeModal = () => {
    setViewSkillsPage(showSkillPointAlert);
    setShowModal(true);
    if (showSkillPointAlert) {
      acknowledgeSkillPoints(state.bumpkin);
    }
  };

  const goToProgress = () => {
    if (progressBarEl.current) {
      const nextLevelExperience = LEVEL_BRACKETS[level];
      const previousLevelExperience =
        LEVEL_BRACKETS[(level - 1) as BumpkinLevel] || 0;

      let percent =
        (experience - previousLevelExperience) / nextLevelExperience;
      // Progress bar cant go futher than 100%
      if (percent > 1) {
        percent = 1;
      }

      const scaledToProgress = percent * (SPRITE_STEPS - 1);
      progressBarEl.current.goToAndPause(Math.round(scaledToProgress));
    }
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Bumpkin modal */}
      <Modal show={showModal} centered onHide={handleHideModal}>
        <BumpkinModal
          initialView={viewSkillsPage ? "skills" : "home"}
          onClose={handleHideModal}
        />
      </Modal>

      {/* Bumpkin profile */}
      <div
        className={`grid cursor-pointer hover:img-highlight fixed left-2.5 z-50 ${
          isMobile ? "top-8" : "top-12"
        }`}
        onClick={handleShowHomeModal}
      >
        <img
          src={profileBg}
          className="col-start-1 row-start-1"
          style={{
            width: `${dimensions.width * PIXEL_SCALE}px`,
            height: `${dimensions.height * PIXEL_SCALE}px`,
          }}
        />
        <div
          className="col-start-1 row-start-1 overflow-hidden rounded-b-full z-0"
          style={{
            width: `${dimensions.height * PIXEL_SCALE}px`,
            height: `${dimensions.height * PIXEL_SCALE * 1.3}px`,
            marginTop: `${dimensions.bumpkin.marginTop}px`,
          }}
        >
          {state.bumpkin ? (
            <div
              style={{
                width: `${dimensions.bumpkin.width * PIXEL_SCALE}px`,
                marginLeft: "-50%",
              }}
            >
              <DynamicNFT
                bumpkinParts={state.bumpkin.equipped as BumpkinParts}
                showTool={false}
              />
            </div>
          ) : (
            <img
              id="no-bumpkin"
              src={question}
              alt="No Bumpkin Found"
              className="w-1/2 mx-auto mt-[54px]"
            />
          )}
        </div>
        <Spritesheet
          className="col-start-1 row-start-1 z-10"
          style={{
            width: `${dimensions.width * PIXEL_SCALE}px`,
            imageRendering: "pixelated",
          }}
          image={progressBarSprite}
          widthFrame={DIMENSIONS.width}
          heightFrame={DIMENSIONS.height}
          fps={10}
          steps={SPRITE_STEPS}
          autoplay={false}
          getInstance={(spritesheet) => {
            progressBarEl.current = spritesheet;
            goToProgress();
          }}
        />
        <span
          className={`col-start-1 row-start-1 text-white text-center z-20 ${
            isMobile ? "text-xxs" : "text-xs"
          }`}
          style={{
            marginLeft: `${dimensions.level.marginLeft}px`,
            marginTop: `${dimensions.level.marginTop}px`,
            width: `${dimensions.level.width}px`,
          }}
        >
          {level}
        </span>
        {showSkillPointAlert && !gameState.matches("visiting") && (
          <img
            src={lvlUp}
            className="col-start-1 row-start-1 animate-float z-30"
            style={{
              width: `${4 * PIXEL_SCALE}px`,
              height: `${9 * PIXEL_SCALE}px`,
              marginLeft: `${dimensions.skillsMark.marginLeft}px`,
              marginTop: `${dimensions.skillsMark.marginTop}px`,
            }}
          />
        )}
      </div>
    </>
  );
};
