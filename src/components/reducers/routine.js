import { v4 as uuidv4 } from 'uuid';
import { emptyTimer } from "../../utils/constants";

/**
 * Controls the routine state
 * @param {Array} state - a queue of objects representing steps in a routine, and containing timer-specific info (type, numRounds, etc.)
 * @param {Object} action - an object containing information about what type of update to make to the routine state
 * @returns {Object} new, updated state object
 */
export const reducer = (state, action) => {
    const { indexToChange, propName, newValue } = action;
    const newState = [];

    switch(action.type) {
        case 'addTimer':
            const initialState = { type: "Stopwatch", isIncrementing: true, numRounds: 1, endTime: emptyTimer };
            const stateWithId = {...initialState, uuid: uuidv4()};
            return [...state, stateWithId ];
        case 'removeTimer':
            return state.filter((timer, i) => i !== action.indexToRemove);
        case 'clearAll':
            return [];
        case 'changePropVal':
            for (let i=0; i < state.length; i++) {
                if (i !== indexToChange) {
                    newState.push(state[i]);
                } else {
                    let updated;
                    if (propName === "type") {
                      // add timer-specific props to state for new timer type (startTime, numRounds, etc.)
                      const keysForNewType = getKeysToAddOnChangeType(newValue);
                      updated = {...state[i], ...keysForNewType };
                    } else {
                      updated = {...state[i]};
                    }
                    updated[propName] = newValue;
                    newState.push(updated);
                }
            }
            return newState;
        default:
            throw new Error("Unexpected action passed into reducer.");
    }
}

/**
 * Maps a type of timer to a set of timer-specific keys and values to add to state object when switching timer types
 * @param {String} timerType One of ["Stopwatch", "Countdown", "Tabata", "XY"]
 * @returns {Object}
 */
const getKeysToAddOnChangeType = (timerType) => {
    switch(timerType) {
      case 'Stopwatch':
        return { endTime: emptyTimer, isIncrementing: true };
      case 'Countdown':
        return { startTime: emptyTimer, isIncrementing: false };
      case 'Tabata':
        return { workTime: emptyTimer, restTime: emptyTimer, isIncrementing: false };
      case 'XY':
        return { startTime: emptyTimer, isIncrementing: false };
      default:
        throw new Error("Unexpected timerType");
    }
}