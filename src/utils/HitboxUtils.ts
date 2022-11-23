import { Hitbox } from "../models/Hitbox";
import { Position } from "../models/Position";

export function getHitBoxCenter(hitbox: Hitbox): Position {
    return {
        x: hitbox.rightBottom.x - ((hitbox.rightBottom.x - hitbox.leftTop.x) / 2),
        y: hitbox.rightBottom.y - ((hitbox.rightBottom.y - hitbox.leftTop.y) / 2)
    };
}

export function onGoal(hitbox: Hitbox, goalPosition?: Position) {
    if (!goalPosition) return false;
    if ((goalPosition.x > hitbox.leftTop.x && goalPosition.x < hitbox.rightBottom.x) && (goalPosition.y > hitbox.leftTop.y && goalPosition.y < hitbox.rightBottom.y)) return true;
    return false;
}