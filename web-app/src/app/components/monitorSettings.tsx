"use client";

import React, {useCallback, useMemo, useState} from "react";
import styles from "../styles/monitorSettings.module.css";
import {SettingsType, useSettingsContext} from "@/app/components/settingsContext";

export const MonitorSettings = () => {
    const {settings, setSettings} = useSettingsContext();
    const [newTimeInterval, setNewTimeInterval] = useState(settings.interval);
    const [newValidThresholdValue, setNewValidThresholdValue] = useState(settings.validThreshold);
    const [newDangerThresholdValue, setNewDangerThresholdValue] = useState(settings.dangerThreshold);

    const onApply = useCallback(async () => {
        try {
            if (!newTimeInterval && !newValidThresholdValue && !newDangerThresholdValue) {
                console.error(`Parameters are invalid`);
                return;
            }

            const newSettingsData = {
                interval: (newTimeInterval ? newTimeInterval : settings.interval),
                validThreshold: (newValidThresholdValue ? newValidThresholdValue : settings.validThreshold),
                dangerThreshold: (newDangerThresholdValue ? newDangerThresholdValue : settings.dangerThreshold),
            } as SettingsType;

            const settingsResponse = await fetch(
                "http://localhost:8000/settings",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                        time_interval: newSettingsData.interval,
                        valid_threshold: newSettingsData.validThreshold,
                        danger_threshold: newSettingsData.dangerThreshold,
                    }),
                }
            );

            if (!settingsResponse.ok) {
                console.error(
                    `Failed to set configuration. Status: ${settingsResponse.status}`
                );
                return;
            }

            const settingsData = await settingsResponse.json();
            const {status, response, data} = settingsData;
            if (status) {
                console.log("Success:", response);
                console.log("Data:", data);
            } else {
                console.error("Error:", response);
                return;
            }

            setSettings(newSettingsData);
            setNewTimeInterval(NaN);
            setNewValidThresholdValue(NaN);
            setNewDangerThresholdValue(NaN);
        } catch (error) {
            console.error(`Failed to add to site ${error}`);
        }
    }, [newTimeInterval, newValidThresholdValue, newDangerThresholdValue, settings.interval, settings.validThreshold, settings.dangerThreshold, setSettings]);

    const settingsDataDisplay = useMemo(() => {
        return (
            <div className={styles.sideContent}>
                <div className={styles.subHeader}>
                    <h2 className={styles.code}>Time Interval: <span>{settings.interval}</span></h2>
                </div>
                <div className={styles.subHeader}>
                    <h4 className={styles.code}>Valid Threshold: <span
                        style={{color: "green"}}>{settings.validThreshold}</span></h4>
                </div>
                <div className={styles.subHeader}>
                    <h4 className={styles.code} style={{color: "orange"}}>Between Valid And Dangerous</h4>
                </div>
                <div className={styles.subHeader}>
                    <h4 className={styles.code}>Danger Threshold: <span
                        style={{color: "red"}}>{settings.dangerThreshold}</span></h4>
                </div>
            </div>);
    }, [settings.dangerThreshold, settings.interval, settings.validThreshold]);


    const inputPlaceholders = useMemo(() => {
        return {
            intervalStr: `${settings.interval} Sec`,
            validThresholdStr: `${settings.validThreshold} ms`,
            dangerThresholdStr: `${settings.dangerThreshold} ms`
        }
    }, [settings]);

    return (
        <>
            <div className={styles.addItems}>
                <div className={styles.addContent}>
                    <div className={styles.subHeader}>
                        <h4 className={styles.code}>Edit Configurations</h4>
                    </div>
                    <div className={styles.userEntry}>
                        <span className={styles.userText}>Time Interval:&nbsp;</span>
                        <input
                            type="number"
                            className={styles.userInput}
                            value={newTimeInterval}
                            placeholder={inputPlaceholders.intervalStr}
                            onChange={(e) => setNewTimeInterval(e.target.value as unknown as number)}
                        />
                    </div>
                    <div className={styles.userEntry}>
                        <span className={styles.userText}>Valid Threshold:&nbsp;</span>
                        <input
                            type="number"
                            className={styles.userInput}
                            value={newValidThresholdValue}
                            placeholder={inputPlaceholders.validThresholdStr}
                            onChange={(e) => setNewValidThresholdValue(e.target.value as unknown as number)}
                        />
                    </div>
                    <div className={styles.userEntry}>
                        <span className={styles.userText}>Dangerous Threshold:&nbsp;</span>
                        <input
                            type="number"
                            className={styles.userInput}
                            value={newDangerThresholdValue}
                            placeholder={inputPlaceholders.dangerThresholdStr}
                            onChange={(e) => setNewDangerThresholdValue(e.target.value as unknown as number)}
                        />
                    </div>
                    <div className={styles.hoverableImage}>
                        <button
                            className={styles.editButton}
                            style={{background: "white", color: "black"}}
                            onClick={onApply}
                        >
                            Apply
                        </button>
                    </div>
                </div>
                {settingsDataDisplay}
            </div>
        </>
    );
};

