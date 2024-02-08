"use client";

import styles from "./page.module.css";
import {SettingsProvider} from "./components/settingsContext";
import {SiteProvider} from "./components/siteContext";
import {BannerWindow} from "./components/bannerWindow";
import {MonitorSettings} from "./components/monitorSettings";
import {AddSiteWindow} from "./components/addNewSiteWindow";
import {GridLayout} from "./components/gridLayout";

export default function Home() {
    return (
        <main className={styles.main}>
            <SettingsProvider>
                <SiteProvider>
                    <div className={styles.description}>
                        <p>
                            <code className={styles.code}>Site Latency Monitor</code>
                        </p>
                        <div>
                            <BannerWindow/>
                        </div>
                    </div>
                    <div className={styles.center}>
                        <MonitorSettings/>
                    </div>
                    <div className={styles.center}>
                        <AddSiteWindow/>
                    </div>

                    <div className={styles.grid}>
                        <GridLayout/>
                    </div>
                </SiteProvider>
            </SettingsProvider>
        </main>
    );
}
