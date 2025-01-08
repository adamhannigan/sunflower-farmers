import React, { useContext, useEffect, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { requestForToken } from "lib/messaging";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { useSelector } from "@xstate/react";
import {
  subscribeToNotifications,
  DEFAULT_SUBSCRIPTIONS,
  Subscriptions,
  SubscriptionName,
} from "features/game/actions/subscriptions";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import useSWR from "swr";
import { SettingMenuId, subscriptionsFetcher } from "../GameOptions";
import { getKeys } from "features/game/types/decorations";
import Switch from "components/ui/Switch";
import { Button } from "components/ui/Button";

export const convertToTitleCase = (str: string) => {
  return str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const Notifications: React.FC<{
  onSubMenuClick: (id: SettingMenuId) => void;
}> = ({ onSubMenuClick }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);

  const token = useSelector(authService, _token);
  const [saving, setSaving] = useState(false);

  const farmId = gameService.state.context.farmId;

  const {
    data: subscriptions,
    error,
    mutate,
  } = useSWR(
    ["/notifications/subscriptions", token, farmId],
    subscriptionsFetcher,
  );

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("subscriptions have changed", subscriptions);
  }, [subscriptions]);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Error when fetching notification subscriptions", error);
  }

  const [errorWhileSave, setErrorWhileSave] = useState<string | null>(null);
  // Local state to keep track of the selections
  const [options, setOptions] = useState<Subscriptions>(
    subscriptions ?? DEFAULT_SUBSCRIPTIONS,
  );

  const isDirty = JSON.stringify(options) !== JSON.stringify(subscriptions);

  useEffect(() => {
    if (subscriptions) {
      setOptions(subscriptions);
    }
  }, [subscriptions]);

  const handleGetToken = async () => {
    setSaving(true);
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await requestForToken();

      // eslint-disable-next-line no-console
      console.log("token", token);

      if (token) {
        await handleSubscribe(token);
      } else {
        setErrorWhileSave("Error requesting for token");
        setSaving(false);
      }
    }
  };

  const handleSubscribe = async (fcmToken: string) => {
    try {
      setSaving(true);
      const result = await subscribeToNotifications({
        authToken: token as string,
        fcmToken: fcmToken as string,
        farmId: gameService.state.context.farmId,
        subscriptions: options,
      });

      if (result.success) {
        // Update the cache with new data and trigger revalidation
        mutate(
          // Update the cache immediately
          options,
          {
            // Revalidate to ensure cache is in sync
            revalidate: true,
          },
        );
      }
    } catch (error) {
      setErrorWhileSave(error as string);
      // eslint-disable-next-line no-console
      console.log(`Error subscribing to notifications: ${error}`);
    } finally {
      setSaving(false);
      onSubMenuClick("main");
    }
  };

  const handleChange = (subName: SubscriptionName) => {
    setOptions({ ...options, [subName]: !options[subName] });
  };

  return (
    <>
      <div className="flex flex-col space-y-1 p-2 mb-1">
        {getKeys(options).map((subName) => (
          <div key={subName}>
            <Switch
              checked={options[subName]}
              onChange={() => handleChange(subName)}
              label={convertToTitleCase(subName)}
            />
          </div>
        ))}
        {errorWhileSave && (
          <div className="text-red-500 my-0.5 text-xxs">
            {t("error.wentWrong")}
          </div>
        )}
      </div>

      <Button disabled={!isDirty || saving} onClick={handleGetToken}>
        <p className={`${saving ? "loading" : ""}`}>
          {saving
            ? t("gameOptions.notifications.updating")
            : t("gameOptions.notifications.update")}
        </p>
      </Button>
    </>
  );
};
