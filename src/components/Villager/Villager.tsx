import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
  const { selectVillager } = useVillagers();
  console.log("rendered villager");

  const handleSelect = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      if (!selectVillager) return;
      selectVillager(id);
    },
    [id]
  );

  const handleRightClick = useCallback((event: any) => {
    console.log("right click");
  }, []);

  const child = useMemo(() => {
    return <UIVillager size={size} key={id} />;
  }, []);

  // useEffect(() => {
  //   console.log("Villager useEffect");
  // }, [handleSelect, handleRightClick, id, name, size, professions, hitBox, selected, child]);

  return (
    <EntityWrapper key={id} entityId={id} onClick={handleSelect} onRightClick={handleRightClick} hitBox={hitBox} size={size} selected={selected}>
      {child}
    </EntityWrapper>
  );
});
export default Villager;

function arePropsEqual(prevProps: any, nextProps: any) {
  const x = prevProps.id === nextProps.id && prevProps.selected === nextProps.selected;
  return x;
}

type Props = {
  id: string;
  selected: boolean;
  name: string;
  onClick: (e: any) => void;
};

const Villager2 = memo(({ id, name, selected, onClick}: Props) => {
  console.log('rendered Villager2');

  useEffect(() => {
    console.log(" useEffect Villager2");
  }, [id, name, selected, onClick])
  return (
    <div key={id} style={{ width: "50px", height: "50px", backgroundColor: selected ? 'blue' : 'red' }} onClick={(e) => onClick(id)}>
      <p>{name}</p>
    </div>
  );
});

export { Villager2 };
