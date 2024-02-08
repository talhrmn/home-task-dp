import React, {useCallback, useMemo, useState} from "react";
import {useSettingsContext} from "./settingsContext";
import {SiteType, useSiteContext} from "./siteContext";

import styles from "../styles/gridCard.module.css";

export type GridCardProps = {
  monitor: SiteType;
};

export const GridCard = ({ monitor }: GridCardProps) => {
  const { settings } = useSettingsContext();
  const { allSites, setAllSites } = useSiteContext();
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const [editedValues, setEditedValues] = useState<Partial<SiteType>>({
    siteName: monitor.siteName,
    siteUrl: monitor.siteUrl,
  });

  const cardColor = useMemo(() => {
    const latency = monitor.latency;

    if (latency <= settings.validThreshold) {
      return "green";
    } else if (
      latency > settings.validThreshold &&
      latency < settings.dangerThreshold
    ) {
      return "orange";
    } else {
      return "red";
    }
  }, [monitor.latency, settings]);

  const cardStyle = useMemo(() => {
    return { background: cardColor };
  }, [cardColor]);

  const onClick = useCallback(() => {
    setInEditMode((editMode) => !editMode);
  }, [setInEditMode]);

  const onDelete = useCallback(async () => {
    try {
      const deleteResponse = await fetch(
        `http://localhost:8000/monitor/remove/${monitor.monitorId}`,
        {
          method: "DELETE",
        }
      );

      if (!deleteResponse.ok) {
        console.error(
          `Failed to remove site. Status: ${deleteResponse.status}`
        );
        return;
      }

      const monitorData = await deleteResponse.json();
      const { status, response, data } = monitorData;
      if (status) {
        console.log("Success:", response);
        console.log("Data:", data);
      } else {
        console.error("Error:", response);
        return;
      }

      const updatedSites = allSites.filter(
        (site) => site.monitorId !== monitor.monitorId
      );

      setAllSites(updatedSites);
      setInEditMode(false);
    } catch (error) {
      console.error(`Failed to remove to site ${error}`);
    }
  }, [allSites, monitor, setAllSites]);

  const onCancelEdit = useCallback(() => {
    setEditedValues({
      siteName: monitor.siteName,
      siteUrl: monitor.siteUrl,
    });
    setInEditMode(false);
  }, [monitor.siteName, monitor.siteUrl]);

  const onApplyEdit = useCallback(async () => {
    try {
      if (!editedValues.siteName || !editedValues.siteUrl) {
        console.error(`Parameters are invalid`);
        return;
      }

      const editResponse = await fetch(
        `http://localhost:8000/monitor/update/${monitor.monitorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            site_name: editedValues.siteName,
            site_url: editedValues.siteUrl,
          }),
        }
      );
      if (!editResponse.ok) {
        console.error(`Failed to edit site. Status: ${editResponse.status}`);
        return;
      }
      const monitorData = await editResponse.json();
      const { status, response, data } = monitorData;
      if (status) {
        console.log("Success:", response);
        console.log("Data:", data);
      } else {
        console.error("Error:", response);
        return;
      }
      const updatedMonitorData = {
        monitorId: data.monitor_id,
        siteName: data.site_name,
        siteUrl: data.site_url,
        latency: data.latency,
      } as SiteType;

      const updatedSites = allSites.map((site) =>
        site.monitorId === monitor.monitorId ? updatedMonitorData : site
      );

      setAllSites(updatedSites);
      setInEditMode(false);
    } catch (error) {
      console.error(`Failed to add to site ${error}`);
    }
  }, [allSites, editedValues, monitor.monitorId, setAllSites]);

  return useMemo(() => {
    if (!inEditMode) {
      return (
          <div className={styles.card} onClick={onClick}>
            <h2 className={styles.h2}>{monitor.siteName}</h2>
            <p>
              <div className={styles.latencyIndicator} style={cardStyle}></div>
            </p>
          </div>
      );
    } else {
      return (
          <div className={styles.card}>
            <div className={styles.editItem}>
              <h3 className={styles.h3}>Site Name</h3>
              <input
                  className={styles.editInput}
                  type="text"
                  value={editedValues.siteName || ""}
                  onChange={(e) =>
                      setEditedValues((prev) => ({
                        ...prev,
                        siteName: e.target.value,
                      }))
                  }
                  placeholder={monitor.siteName}
              />
            </div>
            <div className={styles.editItem}>
              <h3 className={styles.h3}>URL:</h3>
              <input
                  className={styles.editInput}
                  type="text"
                  value={editedValues.siteUrl || ""}
                  onChange={(e) =>
                      setEditedValues((prev) => ({
                        ...prev,
                        siteUrl: e.target.value,
                      }))
                  }
                  placeholder={monitor.siteName}
              />
            </div>
            <div className={styles.editButtonContainer}>
              <button className={styles.editButton} onClick={onCancelEdit}>
                Cancel
              </button>
              <button
                  className={styles.editButton}
                  style={{background: "red"}}
                  onClick={onDelete}
              >
                Remove
              </button>
              <button
                  className={styles.editButton}
                  style={{background: "green"}}
                  onClick={onApplyEdit}
              >
                Apply
              </button>
            </div>
          </div>
      );
    }
  }, [
    inEditMode,
    cardStyle,
    onClick,
    monitor.siteName,
    monitor.latency,
    editedValues.siteName,
    editedValues.siteUrl,
    onDelete,
    onCancelEdit,
    onApplyEdit,
  ]);
};
