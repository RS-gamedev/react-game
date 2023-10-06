import { useContext, useMemo } from "react";
import { BuildingsContext } from "../context/buildings/buildingsContext";
import { BuildingsContextProps } from "../context/buildings/buildingsContextProps";

export const useBuildings = (): BuildingsContextProps => {
  const context = useContext(BuildingsContext);
  return useMemo(() => context, [context]);
};
