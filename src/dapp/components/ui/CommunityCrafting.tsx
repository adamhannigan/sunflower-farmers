import "./Crafting.css";

import { useService } from "@xstate/react";
import React, { useEffect } from "react";

import discord from "../../images/ui/discord.jpeg";
import coin from "../../images/ui/icon.png";
import matic from "../../images/ui/matic.png";
import {
  BlockchainEvent,
  BlockchainState,
  Context,
  service,
} from "../../machine";
import { Inventory, Recipe, recipes } from "../../types/crafting";
import { Button } from "../ui/Button";
import { Message } from "../ui/Message";
import { Box, BoxProps } from "./Box";
import { CommunityApproval } from "./CommunityApproval";

interface Props {
  onClose: () => void;
  balance: number;
  inventory: Inventory;
  totalItemSupplies: Inventory;
  level: number;
}

const COMMUNITY_RECIPES = recipes.filter(
  (recipe) => !!recipe.communityMember
);

// 20% for designer, 5% for the team
const COMMISION = 0.25;

// In case people take awhile to confirm the transaction
const SLIPPAGE = 0.02;

const MATIC_MULTIPLIER = 1 + COMMISION + SLIPPAGE;

export const CommunityCrafting: React.FC<Props> = ({
  onClose,
  balance,
  inventory,
  totalItemSupplies,
}) => {
  const [quickSwapRate, setQuickSwapRate] = React.useState(0);
  const [isApproving, setIsApproving] = React.useState(false);
  const [selectedRecipe, setSelectedRecipe] = React.useState(
    COMMUNITY_RECIPES[0]
  );
  const [machineState] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);
  const isUnsaved = machineState.context.blockChain.isUnsaved();

  // Every 10 seconds fetch the quickswap rate
  useEffect(() => {
    const load = async () => {
      const rate = await machineState.context.blockChain.quickswapRate();
      // Always suggest a bit higher to prevent slippage issues
      const safeRate = rate * MATIC_MULTIPLIER;
      console.log({ safeRate });
      setQuickSwapRate(safeRate);
    };

    load();

    const interval = setInterval(() => {
      load();
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, []);

  const changeRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const craft = () => {
    setIsApproving(true);
  };

  console.log({ inventory });

  const boxes: BoxProps[] = COMMUNITY_RECIPES.map((recipe) => ({
    isSelected: recipe.name === selectedRecipe.name,
    onClick: () => changeRecipe(recipe),
    image: recipe.image,
    count: inventory[recipe.name] || undefined,
  }));

  // Pad array with empty boxes
  for (let i = boxes.length; i < 10; i++) {
    boxes.push({ disabled: true });
  }

  // Currently only have statue supply so hardcode the rest to 5000
  const amountLeft =
    selectedRecipe.supply &&
    selectedRecipe.supply - totalItemSupplies[selectedRecipe.name];

  if (isApproving) {
    return (
      <CommunityApproval
        balance={balance}
        onClose={onClose}
        recipe={selectedRecipe}
        quickSwapRate={quickSwapRate}
      />
    );
  }

  const Action = () => {
    return <span id="recipe-description">Locked</span>;

    if (isUnsaved) {
      return (
        <div className="upgrade-required">
          <Message>
            Save your farm first
            <img
              //src={cancel}
              className="insufficient-funds-cross"
            />
          </Message>
        </div>
      );
    }

    if (selectedRecipe.supply && amountLeft === 0) {
      return <span id="recipe-description">No supply left </span>;
    }

    return (
      <>
        <Button onClick={craft} disabled={!canAfford}>
          <span id="craft-button-text">Craft</span>
        </Button>
      </>
    );
  };

  const sunflowerTokenPrice = selectedRecipe.ingredients[0].amount;
  const maticPrice = sunflowerTokenPrice * quickSwapRate;
  const canAfford = balance >= sunflowerTokenPrice;

  return (
    <div id="crafting">
      <div id="community-left">
        <div>
          <span className="community-title">Crowd Sourced Features</span>
          <span className="community-description">
            80% $SFF burnt into LP
          </span>
          <span className="community-description">
            16% sent to the designer
          </span>
          <span className="community-description">
            4% sent to the team
          </span>
          <div id="crafting-items">
            {boxes.map((box, index) => (
              <Box
                key={index}
                count={box.count}
                onClick={box.onClick}
                image={box.image}
                isSelected={box.isSelected}
                disabled={box.disabled}
              />
            ))}
          </div>
        </div>
        <div id="community-footer">
          <a
            href="https://docs.sunflower-farmers.com/crafting-guide#crowd-sourced-crafting"
            target="_blank"
            rel="noreferrer"
          >
            <h3 className="current-price-supply-demand">Read more</h3>
          </a>
        </div>
      </div>
      <div id="recipe">
        <span className={`recipe-type recipe-nft`}>NFT</span>
        {selectedRecipe.supply && !isNaN(amountLeft) && (
          <span className="nft-count">{`${amountLeft} left!`}</span>
        )}
        <span id="recipe-title">{selectedRecipe.name}</span>
        <div id="crafting-item">
          <img src={selectedRecipe.image} />
        </div>
        <span id="recipe-description">{selectedRecipe.description}</span>

        <div id="ingredients">
          <div className="ingredient">
            <div>
              <img className="ingredient-image" src={coin} />
              <span className="ingredient-count">$SFF</span>
            </div>
            <span
              className={`ingredient-text ${
                !canAfford && "ingredient-insufficient"
              }`}
            >
              {sunflowerTokenPrice}
            </span>
          </div>
          <div className="ingredient">
            <div>
              <img className="ingredient-image" src={matic} />
              <span className="ingredient-count">$MATIC</span>
            </div>
            <span className={`ingredient-text`}>
              {maticPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div id="craft-action">{Action()}</div>
        <span id="recipe-description">
          {selectedRecipe.communityMember.twitterLink && (
            <a
              target="_blank"
              href={selectedRecipe.communityMember.twitterLink}
              style={{ color: "white", textDecoration: "underline" }}
              rel="noreferrer"
            >
              {selectedRecipe.communityMember.twitterName}
            </a>
          )}
          <div>
            {selectedRecipe.communityMember.discordName && (
              <span id="discord">
                <img src={discord} />
                {`@${selectedRecipe.communityMember.discordName}`}
              </span>
            )}
          </div>
        </span>
        <span id="recipe-description">
          <a
            target="_blank"
            href={selectedRecipe.openSeaLink}
            style={{ color: "white", textDecoration: "underline" }}
            rel="noreferrer"
          >
            View on OpenSea
          </a>
        </span>
      </div>
    </div>
  );
};
