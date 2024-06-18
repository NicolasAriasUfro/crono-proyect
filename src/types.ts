export enum TimerBehavior {
    NORMAL,
    OPTIONAL,
    SKIP,
    IMPORTANT
}
export interface OptionTimer {
    behavior:TimerBehavior,
    title:string,
    subtitle:string
}

export const options: OptionTimer[] = [
    {
        behavior: TimerBehavior.NORMAL,
        title:"normal",
        subtitle:"Al terminar el tiempo asignado, continúa con  el siguiente"
    },
    {
        behavior: TimerBehavior.OPTIONAL,
        title: "Opcional",
        subtitle:"Se activa solo si hay tiempo suficiente."
    },
    {
        behavior: TimerBehavior.SKIP,
        title: "Omitir",
        subtitle:"Pasa inmediatamente al siguiente."
    },
    {
        behavior: TimerBehavior.IMPORTANT,
        title: "Importante",
        subtitle:"Necesita pasar al siguiente manualmente."
    }
]

export interface Timer {
    id: number;
    name: string;
    initialSeconds: number;
    actualSeconds: number;
    behavior: TimerBehavior;
    selected: boolean;
}
export interface Schedule {
    id: number;
    name: string;
    lastTimerId: number;
    timers: Timer[];

}

export interface UserGroup {
    id: number;
    name: string;
    timers: Timer[]
}

export interface Group {
    id: number;
    name: string;
}