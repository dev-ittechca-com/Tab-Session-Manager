import React from "react";
import browser from "webextension-polyfill";
import log from "loglevel";
import openUrl from "../actions/openUrl";
import { getSettings } from "src/settings/settings";
import DonationMessage from "./DonationMessage";
import HeartIcon from "../icons/heart.svg";
import CloudSyncIcon from "../icons/cloudSync.svg";
import ExpandIcon from "../icons/expand.svg";
import SettingsIcon from "../icons/settings.svg";
import "../styles/Header.scss";

const logDir = "popup/components/Header";

const SyncStatus = props => {
  const { status, progress, total } = props.syncStatus;

  const statusLabels = {
    pending: `${browser.i18n.getMessage("syncingLabel")}...`,
    download: `${browser.i18n.getMessage("downloadingLabel")}...`,
    upload: `${browser.i18n.getMessage("uploadingLabel")}...`,
    delete: `${browser.i18n.getMessage("deletingLabel")}...`,
    complete: browser.i18n.getMessage("syncCompletedLabel")
  };
  const shouldShowProgress = status === "download" || status === "upload" || status === "delete";

  return (
    <div className={`syncStatus ${status}`}>
      <span>{`${statusLabels[status]} ${shouldShowProgress ? `(${progress}/${total})` : ""}`}</span>
    </div>
  );
};

const openSettings = () => {
  log.info(logDir, "openSettings()");
  const url = "../options/index.html#settings";
  openUrl(url);
};

const openSessionListInTab = () => {
  log.info(logDir, "openSessionListInTab()");
  const url = "../popup/index.html#inTab";
  openUrl(url);
  window.close();
};

export default props => {
  const handleHeartClick = () => {
    props.openModal(browser.i18n.getMessage("donationLabel"), <DonationMessage />);
  };

  const handleSyncClick = async () => {
    await browser.runtime.sendMessage({
      message: "syncCloud"
    });
  };

  const shouldShowCloudSync = getSettings("signedInEmail");

  return (
    <div id="header">
      <div className="title">Tab Session Manager</div>
      <div className="rightButtons">
        {shouldShowCloudSync && (
          <React.Fragment>
            <SyncStatus syncStatus={props.syncStatus} />
            <button
              className={"cloudSyncButton"}
              onClick={handleSyncClick}
              title={browser.i18n.getMessage("cloudSyncLabel")}
            >
              <CloudSyncIcon />
              {props.needsSync && <div className="syncBadge">!</div>}
            </button>
          </React.Fragment>
        )}
        <button
          className="heartButton"
          onClick={handleHeartClick}
          title={browser.i18n.getMessage("donateLabel")}
        >
          <HeartIcon />
        </button>
        <button
          className={"openInTabButton"}
          onClick={openSessionListInTab}
          title={browser.i18n.getMessage("openSessionListInTabLabel")}
        >
          <ExpandIcon />
        </button>
        <button
          className={"settingsButton"}
          onClick={openSettings}
          title={browser.i18n.getMessage("settingsLabel")}
        >
          <SettingsIcon />
        </button>
      </div>
    </div>
  );
};
