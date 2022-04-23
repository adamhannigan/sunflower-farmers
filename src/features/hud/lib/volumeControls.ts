/* eslint-disable @typescript-eslint/no-unused-vars */
import { useStepper } from "lib/utils/hooks/useStepper";
import { Howler } from "howler";
import * as sfx from "lib/utils/sfx";
import { getSettings } from "./settings";

/**
 * Hook for OP volume controls.
 * Note: Do update the return, to return functions which are going to be used.
 *       It's OP, use carefully.
 * TODO: refactor
 */
export const useVolumeControls = () => {
  const allAudioElements = document.getElementsByTagName("audio");

  // {TODO: Update below obj's after adding new SFX's in lib/utils/sfx.tx}
  const sfxActions = [
    sfx.harvestAudio,
    sfx.plantAudio,
    sfx.miningAudio,
    sfx.miningFallAudio,
    sfx.chopAudio,
    sfx.treeFallAudio,
  ];
  const sfxModals = [
    sfx.homeDoorAudio,
    sfx.bakeryAudio,
    sfx.bankAudio,
    sfx.barnAudio,
    sfx.beggarAudio,
    sfx.blacksmithAudio,
    sfx.frogAudio,
    sfx.marketAudio,
    sfx.tailorAudio,
    sfx.wishingWellAudio,
    sfx.diaryAudio,
    sfx.battleAudio,
    sfx.fountainAudio,
  ];

  const MAX_AUDIO_VOLUME = 1.0;
  const MIN_AUDIO_VOLUME = 0.0;
  const VOLUME_STEP = 0.1;
  const DEFAULT_BG_MUSIC_VOLUME = 0.7;
  const DEFAULT_SFX_VOLUME = 0.7;

  /**
   * State to control the master (audio) bg music volume
   */
  const masterAudioVolume = useStepper({
    initial: getSettings().bgMusicMuted ? 0 : DEFAULT_BG_MUSIC_VOLUME,
    step: 0.1,
    max: 1.0,
    min: 0,
  });

  const getMasterAudioVolume = (): number => masterAudioVolume.value;

  const postMasterAudioVolume = (): void => {
    if (
      masterAudioVolume.value <= MAX_AUDIO_VOLUME &&
      masterAudioVolume.value >= MIN_AUDIO_VOLUME
    ) {
      for (const ele of allAudioElements) {
        ele.volume = masterAudioVolume.value;
      }
    }
  };
  const incMasterAudioVolume = (): void => {
    masterAudioVolume.value < MAX_AUDIO_VOLUME
      ? masterAudioVolume.increase()
      : console.log("Warning: Maximum Volume (1) Already Set!");
    postMasterAudioVolume();
  };
  const decMasterAudioVolume = (): void => {
    masterAudioVolume.value > MIN_AUDIO_VOLUME
      ? masterAudioVolume.decrease()
      : console.log("Warning: Minimum Volume (0) Already Set!");
    postMasterAudioVolume();
  };
  const muteMasterAudioVolume = (): void => {
    masterAudioVolume.value > MIN_AUDIO_VOLUME
      ? (masterAudioVolume.value = MIN_AUDIO_VOLUME)
      : console.log("Warning: Volume Already Muted!");
    postMasterAudioVolume();
  };
  const toggleAllBgMusic = (_isMuted: boolean): void => {
    if (!_isMuted) {
      for (const ele of allAudioElements) {
        ele.volume = masterAudioVolume.value;
      }
    } else {
      masterAudioVolume.value = 0;
      for (const ele of allAudioElements) {
        ele.pause();
        ele.muted = true;
      }
    }
  };

  /**
   * State to control the master SFX volume for in-game Actions
   */
  const masterSfxActVolume = useStepper({
    initial: sfxActions[0].volume() as number,
    step: 0.1,
    //temp max is set to 0.8 to avoid extra loud SFX
    max: 0.8,
    min: 0,
  });

  const getMasterSfxActVolume = (): {
    decrease: () => void;
    increase: () => void;
    value: number;
  } => masterSfxActVolume;

  const setMasterSfxActVolume = (): void => {
    sfxActions.forEach((ele) => {
      ele.volume(masterSfxActVolume.value as number);
    });
  };
  const incMasterSfxActVolume = (): void => {
    masterSfxActVolume.increase();
    setMasterSfxActVolume();
  };
  const decMasterSfxActVolume = (): void => {
    masterSfxActVolume.decrease();
    setMasterSfxActVolume();
  };
  const muteMasterSfxActVolume = (): void => {
    masterSfxActVolume.value = 0;
    setMasterSfxActVolume();
  };

  /**
   * State to control the master SFX volume for in-game Modals
   * like houseDoor
   */
  const masterSfxModalVolume = useStepper({
    initial: sfxModals[0].volume() as number,
    step: 0.1,
    //temp max is set to 0.7 to avoid extra loud SFX, the housedoor (o_O)
    max: 0.7,
    min: 0,
  });

  const getMasterSfxModalVolume = (): {
    decrease: () => void;
    increase: () => void;
    value: number;
  } => masterSfxModalVolume;

  const toggleAllSFX = (_isMuted: boolean): void => {
    if (!_isMuted) {
      Howler.mute(_isMuted);
    } else {
      Howler.mute(true);
    }
  };

  const setMasterSfxModalVolume = (): void => {
    sfxModals.forEach((ele) => {
      ele.volume(masterSfxModalVolume.value as number);
    });
  };
  const incMasterSfxModalVolume = (): void => {
    masterSfxModalVolume.increase();
    setMasterSfxModalVolume();
  };
  const decMasterSfxModalVolume = (): void => {
    masterSfxModalVolume.decrease();
    setMasterSfxModalVolume();
  };
  const muteMasterSfxModalVolume = (): void => {
    masterSfxModalVolume.value = 0.0;
    setMasterSfxModalVolume();
  };

  /**
   * Init the master volume states from cached settings.
   * TODO: refactor if other OP vol controls are used (o O)
   */
  const initMasterVolume = (): void => {
    const cached = getSettings();
    console.log("[INIT] volume states");
    toggleAllBgMusic(cached.bgMusicMuted);
    toggleAllSFX(cached.sfxMuted);
  };

  // TODO: update the return if you use OP volumeControls to + or - the vol
  return [initMasterVolume, toggleAllBgMusic, toggleAllSFX];
};
