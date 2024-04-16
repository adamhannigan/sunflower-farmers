import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Context } from "features/auth/lib/Provider";
import { isAddress } from "ethers/lib/utils";
import { useActor } from "@xstate/react";
import { Wallet } from "features/wallet/Wallet";
import { ClaimAccount } from "./NoAccount";
import { Label } from "components/ui/Label";
import { removeJWT } from "../actions/social";

export const WalletInUse: React.FC = () => {
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  const { t } = useAppTranslation();

  const [showClaimAccount, setShowClaimAccount] = useState(false);

  if (showClaimAccount) {
    return (
      <Wallet action="login">
        <ClaimAccount
          onBack={() => setShowClaimAccount(false)}
          onClaim={(id) => authService.send("CLAIM", { id })}
        />
      </Wallet>
    );
  }

  return (
    <>
      <div className="px-2">
        <Label type="chill" className="mb-2" icon={SUNNYSIDE.icons.heart}>
          {t("noaccount.newFarmer")}
        </Label>
        <p className="mb-3">{t("error.walletInUse.one")}</p>
        <p className="mb-2 text-xs">{t("error.walletInUse.two")}</p>
        {isAddress(authState.context.user.token?.address ?? "") && (
          <div className="mb-2">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white text-xs cursor-pointer"
              onClick={() => setShowClaimAccount(true)}
            >
              {t("noaccount.alreadyHaveNFTFarm")}
            </a>
          </div>
        )}
      </div>

      <div className="flex mt-1">
        <Button
          onClick={() => {
            removeJWT();
            authService.send("BACK");
          }}
        >
          {t("error.walletInUse.three")}
        </Button>
      </div>
    </>
  );

  // return (
  //   <>
  //     <div className="flex flex-col p-1">
  //       <div className="flex mb-3 justify-center">
  //         <img
  //           src={SUNNYSIDE.icons.expression_alerted}
  //           alt="Warning"
  //           className="w-3 mr-3"
  //         />
  //       </div>
  //       <p className="text-center mb-3">{t("error.walletInUse.one")}</p>
  //       <p className="mb-2 text-xs">{t("error.walletInUse.two")}</p>
  //     </div>

  //     <Button
  //       onClick={() => authService.send("RETURN")}
  //       className="overflow-hidden"
  //     >
  //       <span>Try another log in Method</span>
  //     </Button>
  //   </>
  // );
};
