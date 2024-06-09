import {useSerialPortStore} from "./SerialPortStore.ts";
import {defineStore} from "pinia";

interface Timer {
    id: number;
    name: string;
    initialSeconds: number;
    actualSeconds: number;
}
interface Schedule {
    id: number;
    name: string;
    lastTimerId: number;
    timers: Timer[];

}
interface ScheduleStore {
    selectedSchedule: number;
    selectedTimer: number;
    lastScheduleId: number;
    schedules: Schedule[];
    paused: boolean;
}
export const useScheduleStore = defineStore("schedule", {
  state: (): ScheduleStore=> ({
    selectedSchedule: 0,
    selectedTimer: 0,
    lastScheduleId: 0,
    schedules: [
      {
        id: 0,
        name: "Cronograma",
        lastTimerId: 0,
        timers: [
          { id: 0, name: "bienvenida", initialSeconds: 5, actualSeconds: 5 },
        ],
      },
    ],
    paused: true,
  }),
  getters: {
    lengthSchedules(): number{
      return this.schedules.length;
    },
    getSelectedTimer() :Timer{
      return this.schedules[this.selectedSchedule].timers[this.selectedTimer];
    },
    timeOfSelectedTimer() :number{
      return this.schedules[this.selectedSchedule].timers[this.selectedTimer]
        .actualSeconds;
    },
  },
  actions: {
    getTimeOfSelectedTimer() {
      return this.schedules[this.selectedSchedule].timers[this.selectedTimer]
        .actualSeconds;
    },
    everySecond() {
      if (!this.paused) {
        if (
          this.schedules[this.selectedSchedule].timers[this.selectedTimer]
            .actualSeconds <= 0
        ) {
          this.selectNextTimer();
        } else {
          this.schedules[this.selectedSchedule].timers[this.selectedTimer]
            .actualSeconds--;
        }
      }
      if (useSerialPortStore().isPortOpen) {
        useSerialPortStore().sendSerialPort();
      }
    },
    selectNextTimer() {
      //revisar si ya terminó
      if (
        this.selectedTimer >=
        this.schedules[this.selectedSchedule].timers.length - 1
      ) {
        this.paused = true;
        console.log("terminó");
        this.selectedTimer = 0;
      } else {
        this.selectedTimer++;
      }
    },
    addSchedule(name:string) {
      this.lastScheduleId++;
      const newSchedule = {
        id: this.lastScheduleId,
        lastTimerId: 0,
        name,
        timers: [],
      };
      this.schedules.push(newSchedule);
      return newSchedule;
    },
    removeSchedule(idSchedule:number){
      const index = this.schedules.findIndex(
        (schedule) => schedule.id === idSchedule
      );
      if (index !== -1) {
        this.schedules.splice(index, 1);
      }
    },
    addTimer(nameTimer:string, initialSeconds:number) {
      this.schedules[this.selectedSchedule].lastTimerId++;
      //create the timer
      const newTimer = {
        id: this.schedules[this.selectedSchedule].lastTimerId,
        name: nameTimer,
        initialSeconds,
        actualSeconds: initialSeconds,
      };
      //add the timer
      this.schedules[this.selectedSchedule].timers.push(newTimer);
      return newTimer;
    },
    removeTimer(idSchedule: number, idTimer: number) {
      const schedule = this.schedules.find((s) => s.id === idSchedule);
      if (schedule) {
        const index = schedule.timers.findIndex(
          (timer) => timer.id === idTimer
        );
        if (index !== -1) {
          schedule.timers.splice(index, 1);
        }
      }
    },
    removeTimerFromActiveSchedule(idTimer: number) {
      // Remove the timer from the default schedule
      console.log(idTimer);
      const schedule = this.schedules[this.selectedSchedule];
      const index = schedule.timers.findIndex((timer) => timer.id === idTimer);
      if (index !== -1) {
        this.schedules[this.selectedSchedule].timers.splice(index, 1);
      }
    },
    decreaseTimer(idTimer:number, seconds:number) {
      const selectedSchedule =
        useScheduleStore().schedules[this.selectedSchedule];
      const timerIndex = selectedSchedule.timers.findIndex(
        (t) => t.id === idTimer
      );

      if (timerIndex !== -1) {
        selectedSchedule.timers[timerIndex].actualSeconds -= seconds;
        // Puedes agregar lógica adicional aquí, como manejar el caso en que actualSeconds sea menor que 0.
      }
    },
    resetSchedule() {
      this.selectedTimer = 0;

      this.resetAllTimers();
    },
    resetTimer(idTimer:number) {
      const selectedSchedule = this.schedules[this.selectedSchedule];
      const timerIndex = selectedSchedule.timers.findIndex(
        (t) => t.id === idTimer
      );

      if (timerIndex !== -1) {
        selectedSchedule.timers[timerIndex].actualSeconds =
          selectedSchedule.timers[timerIndex].initialSeconds;
      }
    },
    resetAllTimers() {
      //resetear todos los timer, igualar actualseconds a initialSecondos
      const timers = this.schedules[this.selectedSchedule].timers;
      for (let i = 0; i < timers.length; i++) {
        timers[i].actualSeconds = timers[i].initialSeconds;
      }
    },
    changeTimerName(idTimer: number, newName: string) {
      const selectedSchedule = this.schedules[this.selectedSchedule];
      const timerIndex = selectedSchedule.timers.findIndex(
        (t) => t.id === idTimer
      );

      if (timerIndex !== -1) {
        selectedSchedule.timers[timerIndex].name = newName;
      }
    },
  },
  persist: true,
});
