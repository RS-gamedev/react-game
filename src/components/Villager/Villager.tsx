import { memo, useCallback, useEffect, useState } from "react";
import { useVillagers } from "../../hooks/useVillagers";
import { Hitbox } from "../../models/Hitbox";
import { VillagerProfession } from "../../models/VillagerProfession";
import { useGame } from "../../providers/GameProvider";
import UIVillager from "../../ui/ui-villager/UIVillager";
import EntityWrapper from "../EntityWrapper/EntityWrapper";

export type VillagerComponentProps = {
  id: string;
  name: string;
  hitBox: Hitbox;
  size: { width: number; height: number };
  selected: boolean;
  professions: VillagerProfession[];
};

const Villager = memo(({ id, name, size, professions, hitBox, selected }: VillagerComponentProps) => {
  // const [activeProfession, setActiveProfession] = useState<VillagerProfession>();
  const { selectVillager } = useGame();

  const handleSelect = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      if (!selectVillager) return;
      selectVillager(id);
    },
    [id, selectVillager]
  );

  const handleRightClick = useCallback((event: any) => {
    console.log("right click");
  }, []);

  return (
    <EntityWrapper key={id} entityId={id} onClick={handleSelect} onRightClick={handleRightClick} hitBox={hitBox} size={size} selected={selected}>
      <UIVillager size={size} key={id}/>
      </EntityWrapper>
  );
});
export default Villager;
