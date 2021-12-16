import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";

export const emptyTimer = ["", "", ""]; // [Hours, Minutes, Seconds]

export const timerTypes = ["Stopwatch", "Countdown", "Tabata", "XY"];

export const timerToJSX = {
    "Stopwatch": { C: <Stopwatch /> },
    "Countdown": { C: <Countdown /> },
    "XY": { C: <XY /> },
    "Tabata": { C: <Tabata /> },
};

export const nullFx = () => null;