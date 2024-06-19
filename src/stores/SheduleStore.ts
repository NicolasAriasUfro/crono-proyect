import {useSerialPortStore} from "./SerialPortStore.ts";
import {defineStore} from "pinia";
import {Schedule, Timer, TimerBehavior} from "@/types.ts";
import {useTimeManagerStore} from "@/stores/TimeManagerStore.ts";

interface ScheduleStore {
    selectedSchedule: number;
    selectedTimer: number;
    lastScheduleId: number;
    schedules: Schedule[];
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
          { id: 0, name: "bienvenida", initialSeconds: 5, actualSeconds: 5 , behavior: TimerBehavior.NORMAL, selected:false},
        ],
      },
    ],
  }),
  getters: {
    quantity(state): number{
      return state.schedules.length;
    },
    getSelectedTimer(state) :Timer{
      return state.schedules[state.selectedSchedule].timers[state.selectedTimer];
    },
    timeOfSelectedTimer(state) :number{
      return state.schedules[state.selectedSchedule].timers[state.selectedTimer]
        .actualSeconds;
    },
    behaviorOfSelectedTimer(state) :TimerBehavior{
      return state.schedules[state.selectedSchedule].timers[state.selectedTimer]
        .behavior;
    }
  },
  actions: {
    timerById(idTimer:number):Timer {
      const timer: Timer | undefined = this.schedules[this.selectedSchedule].timers.find(
          (t: Timer) => t.id === idTimer
      );
      if (timer === undefined) {
        return {
          id: -1,
          name: "",
          selected: false,
          actualSeconds: 0,
          initialSeconds: 0,
          behavior: TimerBehavior.NORMAL
        }
      }

      return timer;
    },
    getTimeOfSelectedTimer() {
      return this.schedules[this.selectedSchedule].timers[this.selectedTimer]
        .actualSeconds;
    },
    everySecond() {
      if (!useTimeManagerStore().isPaused) {
        switch (this.behaviorOfSelectedTimer) {
          case TimerBehavior.NORMAL:
            if (this.timeOfSelectedTimer <= 0) {
              this.selectNextTimer();
            }
            this.schedules[this.selectedSchedule].timers[this.selectedTimer]
                .actualSeconds--;
            break;
          case TimerBehavior.SKIP:
            this.selectNextTimer();
            break;
          case TimerBehavior.IMPORTANT:
            this.schedules[this.selectedSchedule].timers[this.selectedTimer]
                .actualSeconds--;
            break;
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
        useTimeManagerStore().setPausedTrue();
        console.log("terminó");
        alert("Ha terminado el último temporizador")
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
      const newTimer:Timer = {
        id: this.schedules[this.selectedSchedule].lastTimerId,
        name: nameTimer,
        initialSeconds,
        actualSeconds: initialSeconds,
        behavior: TimerBehavior.NORMAL,
        selected: false,
      };
      //add the timer
      this.schedules[this.selectedSchedule].timers.push(newTimer);
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
        this.schedules[this.selectedSchedule].timers[timerIndex].actualSeconds =
          this.schedules[this.selectedSchedule].timers[timerIndex].initialSeconds;
      }
    },
    resetAllTimers() {
      //resetear todos los timer, igualar actualseconds a initialSecondos
      const timers:Timer[] = this.schedules[this.selectedSchedule].timers;
      for (const timer of timers) {
        this.resetTimer(timer.id)
      }
      this.selectedTimer = 0;
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
    updateTimerBehavior(idTimer: number, behavior: TimerBehavior) {
      const selectedSchedule = this.schedules[this.selectedSchedule];
      const timerIndex = selectedSchedule.timers.findIndex(
        (t) => t.id === idTimer
      );

      if (timerIndex !== -1) {
        selectedSchedule.timers[timerIndex].behavior = behavior;
      }
    }
  },
  persist: true,
});
