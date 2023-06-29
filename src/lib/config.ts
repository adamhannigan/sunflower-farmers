const NETWORK = import.meta.env.VITE_NETWORK as "mainnet" | "mumbai";
const DONATION_ADDRESS = import.meta.env.VITE_DONATION_ADDRESS;
const TREASURY_ADDRESS = import.meta.env.VITE_TREASURY_ADDRESS as string;

const POLYGON_CHAIN_ID = NETWORK === "mainnet" ? 137 : 80001;

const API_URL = import.meta.env.VITE_API_URL;
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
const ROOM_URL = import.meta.env.VITE_ROOM_URL;

const WISHING_WELL_CONTRACT = import.meta.env.VITE_WISHING_WELL_CONTRACT;
const ACCOUNT_MINTER_CONTRACT = import.meta.env.VITE_ACCOUNT_MINTER_CONTRACT;
const POKO_ACCOUNT_MINTER_CONTRACT = import.meta.env
  .VITE_POKO_ACCOUNT_MINTER_CONTRACT;
const FARM_CONTRACT = import.meta.env.VITE_FARM_CONTRACT;
const GAME_CONTRACT = import.meta.env.VITE_GAME_CONTRACT;
const WITHDRAWAL_CONTRACT = import.meta.env.VITE_WITHDRAWAL_CONTRACT;
const INVENTORY_CONTRACT = import.meta.env.VITE_INVENTORY_CONTRACT;
const PAIR_CONTRACT = import.meta.env.VITE_PAIR_CONTRACT;
const SESSION_CONTRACT = import.meta.env.VITE_SESSION_CONTRACT;
const TOKEN_CONTRACT = import.meta.env.VITE_TOKEN_CONTRACT;
const DISCORD_REDIRECT = import.meta.env.VITE_DISCORD_REDIRECT;
const CLIENT_VERSION = import.meta.env.VITE_CLIENT_VERSION as string;
const RELEASE_VERSION = import.meta.env.VITE_RELEASE_VERSION as string;
const RECAPTCHA_SITEKEY = import.meta.env.VITE_RECAPTCHA_SITEKEY as string;
const CLOUDFLARE_CAPTCHA_SITEKEY = import.meta.env
  .VITE_CLOUDFLARE_CAPTCHA_SITEKEY as string;
const TRADER_CONTRACT = import.meta.env.VITE_TRADER_CONTRACT as string;
const FROG_CONTRACT = import.meta.env.VITE_FROG_CONTRACT as string;
const FROG_DONATION = import.meta.env.VITE_FROG_DONATION as string;
const BUMPKIN_DETAILS_CONTRACT = import.meta.env
  .VITE_BUMPKIN_DETAILS_CONTRACT as string;
const BUMPKIN_ITEMS_CONTRACT = import.meta.env
  .VITE_BUMPKIN_ITEMS_CONTRACT as string;
const TADPOLE_CONTRACT = import.meta.env.VITE_TADPOLE_CONTRACT as string;
const INCUBATOR_CONTRACT = import.meta.env.VITE_INCUBATOR_CONTRACT as string;
const WHITELIST_TOKEN_CONTRACT = import.meta.env
  .VITE_WHITELIST_TOKEN_CONTRACT as string;
const BUY_SFL_CONTRACT = import.meta.env.VITE_BUY_SFL_CONTRACT as string;
const BUMPKIN_CONTRACT = import.meta.env.VITE_BUMPKIN_CONTRACT as string;
const QUEST_CONTRACT = import.meta.env.VITE_QUEST_CONTRACT as string;
const LOST_AND_FOUND_CONTRACT = import.meta.env
  .VITE_LOST_AND_FOUND_CONTRACT as string;
const DAILY_REWARD_CONTRACT = import.meta.env
  .VITE_DAILY_REWARD_CONTRACT as string;
const QUICKSWAP_ROUTER_CONTRACT = import.meta.env
  .VITE_QUICKSWAP_ROUTER_CONTRACT as string;
const BUY_BLOCK_BUCKS_CONTRACT = import.meta.env
  .VITE_BUY_BLOCK_BUCKS_CONTRACT as string;
const WMATIC_CONTRACT = import.meta.env.VITE_WMATIC_CONTRACT as string;
const DEPOSIT_CONTRACT = import.meta.env.VITE_DEPOSIT_CONTRACT as string;
const AUCTION_CONTRACT = import.meta.env.VITE_AUCTION_CONTRACT as string;
const SEAL_CONTRACT = import.meta.env.VITE_SEAL_CONTRACT as string;
const ALCHEMY_RPC = import.meta.env.VITE_ALCHEMY_RPC as string;
const PROTECTED_IMAGE_URL = import.meta.env.VITE_PRIVATE_IMAGE_URL as string;
const POKO_API_KEY = import.meta.env.VITE_POKO_API_KEY as string;
const POKO_DIRECT_CHECKOUT_API_KEY = import.meta.env
  .VITE_POKO_DIRECT_CHECKOUT_API_KEY as string;
const WALLETCONNECT_PROJECT_ID = import.meta.env
  .VITE_WALLETCONNECT_PROJECT_ID as string;
const DAWN_BREAKER_EVENT_DONATION = import.meta.env
  .VITE_DAWN_BREAKER_EVENT_DONATION as string;

// Arcade Mini Games Donation Addresses
const GREEDY_GOBLIN_DONATION = import.meta.env
  .VITE_GREEDY_GOBLIN_DONATION as string;
const CHICKEN_FIGHT_DONATION = import.meta.env
  .VITE_CHICKEN_FIGHT_DONATION as string;

export const CONFIG = {
  NETWORK,
  POLYGON_CHAIN_ID,
  DONATION_ADDRESS,
  TREASURY_ADDRESS,
  API_URL,
  DISCORD_REDIRECT,

  WISHING_WELL_CONTRACT,
  ACCOUNT_MINTER_CONTRACT,
  POKO_ACCOUNT_MINTER_CONTRACT,
  FARM_CONTRACT,
  INVENTORY_CONTRACT,
  PAIR_CONTRACT,
  SESSION_CONTRACT,
  TOKEN_CONTRACT,
  CLIENT_VERSION,
  RELEASE_VERSION,
  RECAPTCHA_SITEKEY,
  CLOUDFLARE_CAPTCHA_SITEKEY,
  TRADER_CONTRACT,
  FROG_CONTRACT,
  FROG_DONATION,
  BUMPKIN_DETAILS_CONTRACT,
  BUMPKIN_ITEMS_CONTRACT,
  TADPOLE_CONTRACT,
  INCUBATOR_CONTRACT,
  WHITELIST_TOKEN_CONTRACT,
  BUMPKIN_CONTRACT,
  QUEST_CONTRACT,
  DAILY_REWARD_CONTRACT,
  BUY_SFL_CONTRACT,
  QUICKSWAP_ROUTER_CONTRACT,
  WMATIC_CONTRACT,
  SEAL_CONTRACT,
  LOST_AND_FOUND_CONTRACT,
  DEPOSIT_CONTRACT,
  BUY_BLOCK_BUCKS_CONTRACT,
  ALCHEMY_RPC,
  GAME_CONTRACT,
  WITHDRAWAL_CONTRACT,
  AUCTION_CONTRACT,

  GREEDY_GOBLIN_DONATION,
  CHICKEN_FIGHT_DONATION,
  PROTECTED_IMAGE_URL,
  WEBSOCKET_URL,
  ROOM_URL,
  POKO_API_KEY,
  POKO_DIRECT_CHECKOUT_API_KEY,
  WALLETCONNECT_PROJECT_ID,
  DAWN_BREAKER_EVENT_DONATION,
};
