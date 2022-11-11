import { Direction } from "../models/Direction";

function getBestDirection(startPosition: {x: number,y: number}, goalPosition: {x:number, y:number}) : Direction{
    let actualDistance = getDistance(startPosition.x, startPosition.y, goalPosition.x, goalPosition.y);
    console.log(actualDistance);
    return Direction.up;
}


function getDistance(x1: number, y1: number, x2: number, y2: number){
    let y = x2 - x1;
    let x = y2 - y1;
    return Math.sqrt(x * x + y * y);
}


export function getNewPosition(startPosition: {x: number,y: number}, goalPosition: {x:number, y:number}){
    let newPosition = {x: startPosition.x, y: startPosition.y};
    if(goalPosition.x - startPosition.x > 10 ){
        newPosition.x += 10;
    }
    else if(goalPosition.x - startPosition.x < 10){
        newPosition.x -= 10;
    }

    if(goalPosition.y - startPosition.y > 10){
        newPosition.y += 10;
    }
    else if(goalPosition.y - startPosition.y < 10){
        newPosition.y -= 10;
    }
    return newPosition;
}