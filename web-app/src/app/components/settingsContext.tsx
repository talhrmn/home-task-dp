"use client";

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

export type SettingsType = {
  interval: number;
  validThreshold: number;
  warningThreshold: number;
  dangerThreshold: number;
};

type SettingsContextType = {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: {} as SettingsType,
  setSettings: () => {},
});

export const SettingsProvider = ({ children }: PropsWithChildren<{}>) => {
  const [settings, setSettings] = useState({} as SettingsType);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  return useContext(SettingsContext);
};
