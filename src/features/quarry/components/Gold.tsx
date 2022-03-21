import React, { useContext, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import sparkSheet from "assets/resources/gold/gold_spark.png";
import dropSheet from "assets/resources/gold/gold_drop.png";
import empty from "assets/resources/gold/gold_empty.png";
import gold from "assets/resources/gold_ore.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import { getTimeLeft } from "lib/utils/time";
import { ProgressBar } from "components/ui/ProgressBar";
import { Label } from "components/ui/Label";
import { canMine, GOLD_RECOVERY_TIME } from "features/game/events/goldMine";
import { miningAudio, miningFallAudio } from "lib/utils/sfx";

const POPOVER_TIME_MS = 1000;

interface Props {
  rockIndex: number;
}

export const Gold: React.FC<Props> = ({ rockIndex }) => {
  const { gameService, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [game] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(true);
  const [showLabel, setShowLabel] = useState(false);
  const [popover, setPopover] = useState<JSX.Element | null>();

  const [touchCount, setTouchCount] = useState(0);
  // When to hide the wood that pops out
  const [collecting, setCollecting] = useState(false);

  const goldRef = useRef<HTMLDivElement>(null);
  const sparkGif = useRef<SpriteSheetInstance>();
  const minedGif = useRef<SpriteSheetInstance>();

  const readonly = gameState.matches("readonly");
  const tool = "Iron Pickaxe";
  const rock = game.context.state.gold[rockIndex];
  // Users will need to refresh to chop the tree again
  const mined = !canMine(rock);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const shake = () => {
    const isPlaying = sparkGif.current?.getInfo("isPlaying");

    if (readonly) {
      miningAudio.play();
      sparkGif.current?.goToAndPlay(0);
      return;
    }

    if (selectedItem == tool && !isPlaying) {
      miningAudio.play();

      sparkGif.current?.goToAndPlay(0);

      setTouchCount((count) => count + 1);

      // Randomise the shakes to break
      const shakesToBreak = rock.amount.toNumber();

      // On third shake, chop
      if (touchCount > 0 && touchCount === shakesToBreak) {
        mine();
        miningFallAudio.play();
        setTouchCount(0);
      }
    } else return;
  };

  const mine = async () => {
    try {
      gameService.send("gold.mined", {
        index: rockIndex,
      });
      setCollecting(true);
      minedGif.current?.goToAndPlay(0);

      displayPopover(
        <div className="flex">
          <img src={gold} className="w-5 h-5 mr-2" />
          <span className="text-sm text-white text-shadow">{`+${rock.amount}`}</span>
        </div>
      );

      await new Promise((res) => setTimeout(res, 2000));
      setCollecting(false);
    } catch (e: any) {
      displayPopover(
        <span className="text-xs text-white text-shadow">{e.message}</span>
      );
    }
  };

  const handleHover = () => {
    if (
      readonly ||
      (selectedItem === tool && game.context.state.inventory[tool]?.gte(1))
    )
      return;
    goldRef.current?.classList["add"]("cursor-not-allowed");
    setShowLabel(true);
  };

  const handleMouseLeave = () => {
    if (
      readonly ||
      (selectedItem === tool && game.context.state.inventory[tool]?.gte(1))
    )
      return;
    goldRef.current?.classList["remove"]("cursor-not-allowed");
    setShowLabel(false);
  };

  const recoveryTime = GOLD_RECOVERY_TIME;

  const timeLeft = getTimeLeft(rock.minedAt, recoveryTime);
  const percentage = 100 - (timeLeft / recoveryTime) * 100;

  return (
    <div className="relative z-10">
      {!mined && (
        <div
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
          ref={goldRef}
          className="group cursor-pointer  w-full h-full"
          onClick={shake}
        >
          <Spritesheet
            className="group-hover:img-highlight pointer-events-none transform z-10"
            style={{
              width: `${GRID_WIDTH_PX * 5}px`,
              imageRendering: "pixelated",
            }}
            getInstance={(spritesheet) => {
              sparkGif.current = spritesheet;
            }}
            image={sparkSheet}
            widthFrame={91}
            heightFrame={66}
            fps={24}
            steps={5}
            direction={`forward`}
            autoplay={false}
            loop={true}
            onLoopComplete={(spritesheet) => {
              spritesheet.pause();
            }}
          />
          <div
            className={`absolute top-8 transition pointer-events-none w-28 z-20${
              showLabel ? "opacity-100" : "opacity-0"
            }`}
          >
            <Label>Equip {tool.toLowerCase()}</Label>
          </div>
        </div>
      )}

      <Spritesheet
        style={{
          width: `${GRID_WIDTH_PX * 5}px`,
          opacity: collecting ? 1 : 0,
          transition: "opacity 0.2s ease-in",
          imageRendering: "pixelated",
        }}
        className="pointer-events-none z-20"
        getInstance={(spritesheet) => {
          minedGif.current = spritesheet;
        }}
        image={dropSheet}
        widthFrame={91}
        heightFrame={66}
        fps={18}
        steps={7}
        direction={`forward`}
        autoplay={false}
        loop={true}
        onLoopComplete={(spritesheet) => {
          spritesheet.pause();
        }}
      />

      {/* Hide the empty rock behind  */}
      <img
        src={empty}
        className="absolute top-0 pointer-events-none -z-10"
        style={{
          width: `${GRID_WIDTH_PX * 5}px`,
        }}
      />

      {mined && (
        <>
          <div
            className="absolute"
            style={{
              top: "106px",
              left: "29px",
            }}
          >
            <ProgressBar percentage={percentage} seconds={timeLeft} />
          </div>
        </>
      )}

      <div
        className={classNames(
          "transition-opacity absolute top-24 w-40 left-20 z-20 pointer-events-none",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        {popover}
      </div>
    </div>
  );
};
