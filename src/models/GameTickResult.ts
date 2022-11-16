export type GameTickResult = {
    newState: GameTickResultItem[]; 
}

export type GameTickResultItem = {
    name: string;
    changed: boolean;
    stateObject: any;
}