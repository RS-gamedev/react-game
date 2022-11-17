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

function isOnHitBox(hitBox1: Hitbox, hitbox2: Hitbox): boolean {
    let hitboxCenterPoint: Position = getHitBoxCenter(hitBox1);
    if ((hitboxCenterPoint.x > hitbox2.leftTop.x && hitboxCenterPoint.x < hitbox2.rightBottom.x) && (hitboxCenterPoint.y > hitbox2.leftTop.y && hitboxCenterPoint.y < hitbox2.rightBottom.y)) return true;
    return false;
}
