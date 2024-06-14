export enum TimerBehavior {
    Normal="Al terminar el tiempo asignado, continúa con  el siguiente",
    Opcional = "Se activa solo si hay tiempo suficiente.",
    Omitir = "Pasa inmediatamente al siguiente.",
    Importante="Necesita pasar al siguiente manualmente."
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