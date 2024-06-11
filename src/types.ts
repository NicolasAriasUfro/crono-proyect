export enum TimerAccion {
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
    status: TimerAccion;
}
export interface Schedule {
    id: number;
    name: string;
    lastTimerId: number;
    timers: Timer[];

}