"use client";

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

export type SiteType = {
  monitorId: number;
  siteName: string;
  siteUrl: string;
  latency: number;
};

type SiteContextType = {
  allSites: SiteType[];
  setAllSites: React.Dispatch<React.SetStateAction<SiteType[]>>;
};

export const SiteContext = createContext<SiteContextType>({
  allSites: [],
  setAllSites: () => {},
});

export const SiteProvider = ({ children }: PropsWithChildren<{}>) => {
  const [allSites, setAllSites] = useState([] as SiteType[]);

  return (
    <SiteContext.Provider
      value={{
        allSites,
        setAllSites,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  return useContext(SiteContext);
};
