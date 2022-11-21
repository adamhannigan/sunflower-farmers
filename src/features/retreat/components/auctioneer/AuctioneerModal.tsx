import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import close from "assets/icons/close.png";
import { Context } from "features/game/GoblinProvider";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { AuctioneerContent } from "./AuctioneerContent";
import { UpcomingAuctions } from "./UpcomingAuctions";
import { useActor } from "@xstate/react";
import { Loading } from "features/auth/components";
import { MachineInterpreter } from "features/game/lib/goblinMachine";
import mintingAnimation from "assets/npcs/goblin_hammering.gif";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuctioneerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<"auction" | "upcoming">("auction");
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const child = goblinState.children.auctioneer as MachineInterpreter;

  const [auctioneerState] = useActor(child);

  const isLoading = auctioneerState.matches("loading");
  const isMinting = auctioneerState.matches("minting");

  return (
    <Modal centered show={isOpen} onHide={onClose} scrollable>
      {isMinting ? (
        <Panel className="relative">
          <div className="flex flex-col items-center px-2 py-4">
            <span className="text-shadow text-center loading">Minting</span>
            <img src={mintingAnimation} className="w-1/2 mt-2 mb-3" />
            <span className="text-sm">
              Please be patient while we mint the NFT for you.
            </span>
          </div>
        </Panel>
      ) : (
        <Panel className="pt-5 relative">
          <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
            <div className="flex">
              <Tab isActive={tab === "auction"}>
                <span className="text-sm text-shadow ml-1">Auctioneer</span>
              </Tab>
              <Tab isActive={tab === "upcoming"}>
                <span className="text-sm text-shadow ml-1">Upcoming</span>
              </Tab>
            </div>
            <img
              src={close}
              className="h-6 cursor-pointer mr-2 mb-1"
              onClick={onClose}
            />
          </div>

          <div
            style={{
              minHeight: "200px",
            }}
          >
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {tab === "auction" && <AuctioneerContent />}
                {tab === "upcoming" && <UpcomingAuctions />}
              </>
            )}
          </div>
        </Panel>
      )}
    </Modal>
  );
};
