import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import levelIcon from "assets/icons/level_up.png";
import { Context } from "features/game/GameProvider";
import { Equipped as BumpkinParts } from "features/game/types/bumpkin";
import { DynamicNFT } from "./DynamicNFT";
import { OuterPanel } from "components/ui/Panel";
import {
  getBumpkinLevel,
  getExperienceToNextLevel,
  isMaxLevel,
} from "features/game/lib/level";
import { Achievements } from "./Achievements";
import { AchievementBadges } from "./AchievementBadges";
import { Skills } from "features/bumpkins/components/Skills";
import { CONFIG } from "lib/config";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SkillBadges } from "./SkillBadges";
import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/pickSkill";
import { Bumpkin } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import seedSpecialist from "assets/skills/seed_specialist.png";
import { getUnclaimedAchievementNames } from "features/game/events/landExpansion/claimAchievement";
import { SquareIcon } from "components/ui/SquareIcon";
import {
  acknowledgeAchievements,
  hasUnacknowledgedAchievements,
} from "features/island/bumpkin/lib/achievementStorage";
import {
  acknowledgeSkillPoints,
  hasUnacknowledgedSkillPoints,
} from "features/island/bumpkin/lib/skillPointStorage";
import { ResizableBar } from "components/ui/ProgressBar";

export type ViewState = "home" | "achievements" | "skills";

interface Props {
  initialView: ViewState;
  onClose: () => void;
}

export const BumpkinPanel: React.FC<Props> = ({ initialView, onClose }) => {
  const [view, setView] = useState<ViewState>(initialView);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const getVisitBumpkinUrl = () => {
    if (gameState.matches("visiting")) {
      const baseUrl =
        CONFIG.NETWORK === "mainnet"
          ? `https://opensea.io/assets/matic`
          : `https://testnets.opensea.io/assets/mumbai`;

      return `${baseUrl}/${CONFIG.BUMPKIN_CONTRACT}/${state.bumpkin?.id}`;
    }

    const baseUrl =
      CONFIG.NETWORK === "mainnet"
        ? `https://bumpkins.io/#/bumpkins`
        : `https://testnet.bumpkins.io/#/bumpkins`;

    return `${baseUrl}/${state.bumpkin?.id}`;
  };

  useEffect(() => {
    if (view === "skills" && hasUnacknowledgedSkillPoints(state)) {
      acknowledgeSkillPoints(state);
    } else if (
      view === "achievements" &&
      hasUnacknowledgedAchievements(state)
    ) {
      acknowledgeAchievements(state);
    }
  }, [view]);

  if (view !== "home") {
    return (
      <CloseButtonPanel
        onClose={onClose}
        tabs={[
          { icon: seedSpecialist, name: "Skills" },
          { icon: SUNNYSIDE.icons.player, name: "Achievements" },
        ]}
        currentTab={view === "skills" ? 0 : 1}
        setCurrentTab={(e) => setView(e === 0 ? "skills" : "achievements")}
      >
        {view === "skills" && <Skills onBack={() => setView("home")} />}
        {view === "achievements" && (
          <Achievements onBack={() => setView("home")} />
        )}
      </CloseButtonPanel>
    );
  }

  const experience = state.bumpkin?.experience ?? 0;
  const level = getBumpkinLevel(experience);
  const maxLevel = isMaxLevel(experience);
  const { currentExperienceProgress, experienceToNextLevel } =
    getExperienceToNextLevel(experience);

  const hasAvaliableSkillPoints =
    getAvailableBumpkinSkillPoints(state.bumpkin) > 0;
  const hasAvaliableAchievements =
    getUnclaimedAchievementNames(state).length > 0;

  const levelInfo = () => (
    <div className="flex items-center">
      <img
        src={levelIcon}
        style={{
          width: `${PIXEL_SCALE * 10}px`,
          marginRight: `${PIXEL_SCALE * 3}px`,
        }}
      />
      <div>
        <p className="text-sm mb-1">
          Level {level}
          {maxLevel ? " (Max)" : ""}
        </p>
        <ResizableBar
          percentage={(currentExperienceProgress / experienceToNextLevel) * 100}
          type={"progress"}
          outerDimensions={{ width: 40, height: 7 }}
        />
      </div>
    </div>
  );

  const visitBumpkinLink = () => (
    <a
      href={getVisitBumpkinUrl()}
      target="_blank"
      className="underline text-xxs px-1.5 pb-1 pt-0.5 hover:text-blue-500"
      rel="noreferrer"
    >
      Visit Bumpkin
    </a>
  );

  const badgeContainer = (title: "Skills" | "Achievements") => (
    <OuterPanel
      className="cursor-pointer hover:bg-brown-200"
      onClick={() => setView(title === "Skills" ? "skills" : "achievements")}
      style={{
        paddingTop: `${PIXEL_SCALE * 2}px`,
        paddingLeft: `${PIXEL_SCALE * 2}px`,
      }}
    >
      <div className="flex items-center mb-1 justify-between">
        <div className="flex items-center">
          <span className="text-xs mx-1">{title}</span>
          {(title === "Skills"
            ? hasAvaliableSkillPoints
            : hasAvaliableAchievements) &&
            !gameState.matches("visiting") && (
              <SquareIcon icon={SUNNYSIDE.icons.expression_alerted} width={7} />
            )}
        </div>
      </div>
      {title === "Skills" ? (
        <SkillBadges
          inventory={state.inventory}
          bumpkin={state.bumpkin as Bumpkin}
        />
      ) : (
        <AchievementBadges achievements={state.bumpkin?.achievements} />
      )}
    </OuterPanel>
  );

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="flex flex-col">
        <div className="w-full flex flex-wrap p-0.5 mb-0.5">
          <div className="w-1/2 rounded-md overflow-hidden">
            <DynamicNFT
              showBackground
              bumpkinParts={state.bumpkin?.equipped as BumpkinParts}
            />
          </div>
          <div className="flex flex-1 flex-col justify-start ml-2 mb-1 gap-y-3">
            <div className="flex-1" />
            {levelInfo()}
            {visitBumpkinLink()}
          </div>
        </div>

        <div className="flex flex-col w-full gap-y-1">
          {badgeContainer("Skills")}
          {badgeContainer("Achievements")}
        </div>
      </div>
    </CloseButtonPanel>
  );
};
