import {useCallback, useEffect, useMemo} from "react";
import {SettingsType, useSettingsContext} from "./settingsContext";
import {SiteType, useSiteContext} from "./siteContext";
import {GridCard} from "./gridCard";

export const GridLayout = () => {
    const {settings, setSettings} = useSettingsContext();
    const {allSites, setAllSites} = useSiteContext();

    const fetchMonitorData = useCallback(async () => {
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
        const {status, response, data} = allMonitorData;
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
    }, [setAllSites]);

    const fetchSettingsData = useCallback(async () => {
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
        const {status, response, data} = allMonitorData;
        setSettings({
            interval: data.time_interval,
            validThreshold: data.valid_threshold,
            dangerThreshold: data.danger_threshold,
        } as SettingsType);
    }, [setSettings]);

    useEffect(() => {
        const intervalId = setInterval(fetchMonitorData, (settings.interval * 1000));
        return () => {
            clearInterval(intervalId);
        };
    }, [fetchMonitorData, settings.interval]);

    useEffect(() => {
        fetchSettingsData();
        fetchMonitorData();
    }, [fetchMonitorData, fetchSettingsData]);

    return useMemo(() => {
        return allSites.map((site) => (
            <GridCard key={site.monitorId} monitor={site}/>
        ));
    }, [allSites]);
};
