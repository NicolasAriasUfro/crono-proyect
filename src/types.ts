export enum TimerBehavior {
    NORMAL="Normal",
    SKIP = "Omitir",
    IMPORTANT="Priorizar",
    OPTIONAL = "Opcional"
}
export interface Timer {
    id: number;
    name: string;
    initialSeconds: number;
    actualSeconds: number;
    behavior: TimerBehavior;
}
export interface Schedule {
    id: number;
    name: string;
    lastTimerId: number;
    timers: Timer[];

}