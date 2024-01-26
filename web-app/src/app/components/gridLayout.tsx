import { useMemo, useEffect } from "react";
import { SettingsType, useSettingsContext } from "./settingsContext";
import { SiteType, useSiteContext } from "./siteContext";
import styles from "../styles/gridLayout.module.css";
import { GridCard } from "./gridCard";

export const GridLayout = () => {
  const { settings, setSettings } = useSettingsContext();
  const { allSites, setAllSites } = useSiteContext();

  useEffect(() => {
    const fetchSettingsData = async () => {
      const getSettingsResponse = await fetch(
        "http://localhost:8000/settings",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!getSettingsResponse.ok) {
        console.error(
          `Failed to add to site. Status: ${getSettingsResponse.status}`
        );
        return;
      }
      const allMonitorData = await getSettingsResponse.json();
      const { status, response, data } = allMonitorData;
      setSettings({
        interval: data.interval,
        validThreshold: data.valid_threshold,
        dangerThreshold: data.danger_threshold,
      } as SettingsType);
    };
    const fetchMonitorData = async () => {
      const getAllMonitorsResponse = await fetch(
        "http://localhost:8000/monitor",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!getAllMonitorsResponse.ok) {
        console.error(
          `Failed to add to site. Status: ${getAllMonitorsResponse.status}`
        );
        return;
      }
      const allMonitorData = await getAllMonitorsResponse.json();
      const { status, response, data } = allMonitorData;
      const allMonitors = data.map(
        (monitor: any) =>
          ({
            monitorId: monitor.monitor_id as number,
            siteName: monitor.site_name,
            siteUrl: monitor.site_url,
            latency: monitor.latency as number,
          } as SiteType)
      );
      setAllSites(allMonitors);
    };
    fetchSettingsData();
    fetchMonitorData();
  }, [setAllSites, setSettings]);

  const gridCards = useMemo(() => {
    return allSites.map((site) => (
      <GridCard key={site.monitorId} monitor={site} />
    ));
  }, [allSites]);

  return gridCards;
};
