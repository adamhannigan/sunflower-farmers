/* eslint-disable no-console */
import React, { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { ReactPortal } from "components/ui/ReactPortal";
import classNames from "classnames";
import { Button } from "components/ui/Button";

const CHECK_FOR_UPDATE_INTERVAL = 1000 * 60 * 60 * 1;

export function ReloadPrompt() {
  const [isInstalling, setIsInstalling] = useState(false);
  // Periodic Service Worker Updates
  // https://vite-pwa-org.netlify.app/guide/periodic-sw-updates.html#handling-edge-cases
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (registration) {
        // Check if a SW is actively installing. We need this so we can remove the
        // prompt for update if there was a new update ready but its now stale as a new update has been released.
        // If this is the case hide the update prompt and wait for the most recent update to finish installing before
        // prompting reload again.
        registration.addEventListener("updatefound", () => {
          setIsInstalling(true);
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed") {
                setIsInstalling(false);
              }
            });
          }
        });

        setInterval(async () => {
          if (!(!registration.installing && navigator)) return;

          if ("connection" in navigator && !navigator.onLine) return;

          const resp = await fetch(swUrl, {
            cache: "no-store",
            headers: {
              cache: "no-store",
              "cache-control": "no-cache",
            },
          });

          if (resp?.status === 200) await registration.update();
        }, CHECK_FOR_UPDATE_INTERVAL);
      }
    },
  });

  return (
    <ReactPortal>
      <div
        className={classNames(
          "fixed inset-x-0 bottom-0 transition-all duration-500 delay-1000 bg-brown-300 safe-pb safe-px",
          {
            "translate-y-20": !needRefresh || isInstalling,
            "-translate-y-0": needRefresh && !isInstalling,
          }
        )}
        style={{ zIndex: 10000 }}
      >
        {needRefresh && (
          <div className="mx-auto max-w-2xl flex p-2 items-center safe-pb safe-px">
            <div className="p-1 flex flex-1">
              <span className="text-xs">
                New content available, click on reload button to update.
              </span>
            </div>
            <Button
              className="max-w-max h-10"
              onClick={() => {
                updateServiceWorker(true);
                // Safety net for if updateServiceWorker fails
                window.location.reload();
              }}
            >
              Reload
            </Button>
          </div>
        )}
      </div>
    </ReactPortal>
  );
}
