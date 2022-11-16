
export function getEmptyGameTickResultObject() {
    return  {
        newState: [
        {
            name: 'villagers',
            changed: false,
            stateObject: undefined,
        }, {
            name: 'buildings',
            changed: false,
            stateObject: undefined,
        }, {
            name: 'mapObjects',
            changed: false,
            stateObject: undefined,
        }, {
            name: 'inventory',
            changed: false,
            stateObject: undefined,
        }]
    }
}