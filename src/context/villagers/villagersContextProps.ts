import { VillagerProps } from "../../models/VillagerProps"

export type VillagersContextProps = {
    villagers: VillagerProps[],
    setVillagers: (villagers: VillagerProps[]) => void
}