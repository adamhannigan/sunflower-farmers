import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import Modal from "react-bootstrap/esm/Modal";

import * as AuthProvider from "features/auth/lib/Provider";
import {
  Captcha,
  CaptchaModal,
  CAPTCHA_CONTAINER,
  CAPTCHA_ELEMENT,
} from "features/game/components/Captcha";

import { ErrorMessage } from "./ErrorMessage";
import { Panel } from "components/ui/Panel";
import {
  NoFarm,
  CreatingFarm,
  Loading,
  StartFarm,
  VisitFarm,
  CreateFarm,
} from "./components";

import jumpingGoblin from "assets/npcs/goblin_jump.gif";
import curly from "assets/npcs/curly_hair.png";
import { Signing } from "./components/Signing";
import { ErrorCode } from "lib/errors";

export const Auth: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  return (
    <Modal
      centered
      show={
        !authState.matches({ connected: "authorised" }) &&
        !authState.matches("visiting")
      }
      backdrop={false}
    >
      <div className="relative">
        <img
          id="curly"
          src={curly}
          className="absolute w-54 -top-11 right-20 -z-10 scale-[4]"
        />
        <img src={jumpingGoblin} className="absolute w-52 -top-[83px] -z-10" />
        <Panel>
          {(authState.matches({ connected: "loadingFarm" }) ||
            authState.matches("checkFarm")) && <Loading />}
          {authState.matches("connecting") && <Loading text="Connecting" />}
          {authState.matches("signing") && <Signing />}
          {authState.matches({ connected: "noFarmLoaded" }) && <NoFarm />}
          {authState.matches("oauthorising") && <Loading />}
          {authState.matches({ connected: "oauthorised" }) && <CreateFarm />}
          {authState.matches({ connected: "creatingFarm" }) && <CreatingFarm />}
          {authState.matches({ connected: "readyToStart" }) && <StartFarm />}
          {authState.matches("exploring") && <VisitFarm />}
          {authState.matches("unauthorised") && (
            <ErrorMessage
              errorCode={authState.context.errorCode as ErrorCode}
            />
          )}
          {authState.matches({ connected: "captcha" }) && <Captcha />}

          {/* <Captcha show={authState.matches({ connected: "captcha" })} /> */}
        </Panel>
      </div>
    </Modal>
  );
};
