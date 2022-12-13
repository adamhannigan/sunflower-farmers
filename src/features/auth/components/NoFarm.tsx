import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import idle from "assets/npcs/idle.gif";
import questionMark from "assets/icons/expression_confused.png";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";

export const NoFarm: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const explore = () => {
    authService.send("EXPLORE");
  };

  const create = () => {
    authService.send("CHOOSE_CHARITY");
  };

  const connect = () => {
    authService.send("CONNECT_TO_DISCORD");
  };

  return (
    <>
      {!!authState.context.token?.userAccess.createFarm ||
      !!authState.context.token?.discordId ? (
        <Button onClick={create} className="overflow-hidden mb-2">
          Get Started
        </Button>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex items-center mt-5 -mb-1 relative">
            <img
              src={suspiciousGoblin}
              className="w-10 relative bottom-[3px] mr-3"
            />
            <img
              src={idle}
              className="w-8 relative bottom-[6px]"
              style={{ transform: "scaleX(-1)" }}
            />
            <img
              src={questionMark}
              className="absolute z-10 animate-float"
              style={{
                right: "10px",
                width: "13px",
                top: "-35px",
              }}
            />
          </div>
          <span className="text-sm p-2 text-center mb-4">
            Testnet accessed is reserved for testers on Discord.
          </span>
          <Button onClick={connect} className="overflow-hidden mb-2">
            Connect to Discord
          </Button>
        </div>
      )}

      <Button onClick={explore} className="overflow-hidden">
        {`Explore a friend's land`}
      </Button>
    </>
  );
};
