import { useMemo } from "react";
import { useSiteContext } from "./siteContext";
import styles from "../styles/bannerWindow.module.css";

export const BannerWindow = () => {
  const { allSites, setAllSites } = useSiteContext();
  const subHeader = useMemo(() => {
    return (
      <>
        <h2 className={styles.code}>Number of sites: {allSites.length}</h2>
      </>
    );
  }, [allSites.length]);

  return subHeader;
};
