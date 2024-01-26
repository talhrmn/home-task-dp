"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import { SiteType, useSiteContext } from "./siteContext";
import styles from "../styles/addNewSiteWindow.module.css";

export const AddSiteWindow = () => {
  const { allSites, setAllSites } = useSiteContext();
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteURL, setNewSiteURL] = useState("");

  const onApply = useCallback(async () => {
    try {
      if (!newSiteName || !newSiteURL) {
        console.error(`Parameters are invalid`);
        return;
      }

      const createResponse = await fetch(
        "http://localhost:8000/monitor/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            site_name: newSiteName,
            site_url: newSiteURL,
          }),
        }
      );

      if (!createResponse.ok) {
        console.error(
          `Failed to add to site. Status: ${createResponse.status}`
        );
        return;
      }

      const monitorData = await createResponse.json();
      const { status, response, data } = monitorData;
      if (status) {
        console.log("Success:", response);
        console.log("Data:", data);
      } else {
        console.error("Error:", response);
        return;
      }
      const newMonitorData = {
        monitorId: data.monitor_id,
        siteName: data.site_name,
        siteUrl: data.site_url,
        latency: data.latency,
      } as SiteType;

      setAllSites([...allSites, newMonitorData]);
      setNewSiteName("");
      setNewSiteURL("");
    } catch (error) {
      console.error(`Failed to add to site ${error}`);
    }
  }, [allSites, newSiteName, newSiteURL, setAllSites]);

  return (
    <>
      <div className={styles.addItems}>
        <div className={styles.addContent}>
          <div className={styles.subHeader}>
            <h2 className={styles.code}>Add New Site</h2>
          </div>
          <div className={styles.userEntry}>
            <span className={styles.userText}>Monitor Name:&nbsp;</span>
            <input
              type="text"
              className={styles.userInput}
              value={newSiteName}
              placeholder="Site Name"
              onChange={(e) => setNewSiteName(e.target.value)}
            />
          </div>
          <div className={styles.userEntry}>
            <span className={styles.userText}>URL:&nbsp;</span>
            <input
              type="text"
              className={styles.userInput}
              value={newSiteURL}
              placeholder="Site URL - https://www."
              onChange={(e) => setNewSiteURL(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.hoverableImage}>
          <Image
            className={styles.logo}
            src="/plus_icon.png"
            alt="Add +"
            width={180}
            height={180}
            priority
            onClick={onApply}
          />
        </div>
      </div>
    </>
  );
};
