<script lang=ts>
import {useScheduleStore} from "@/stores/SheduleStore";
import {useTheme} from "vuetify";
import {Timer, TimerBehavior} from "@/types.ts";
import {$enum} from "ts-enum-util";

interface OptionTimer {
  behavior:TimerBehavior,
  title:string,
  subtitle:string
}

const options: OptionTimer[] = [
  {
    behavior: TimerBehavior.NORMAL,
    title:"Normal",
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

export default {
  props: {
    idTimer: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      selected: {} as OptionTimer,
      options: options,
      theme: useTheme(),
      timerSubtitle: $enum(TimerBehavior).keys(),
      timerTitle: $enum(TimerBehavior).getKeys(),
      timerInterval: null,
      esPrioritaria: false,
      isDeleted: false,
      isActive: false,
    };
  },
  watch:{
    selected(newValue, oldValue){
      useScheduleStore().updateTimerBehavior(this.idTimer, newValue.behavior);
    }
  },
  computed: {
    timer():Timer{
      return useScheduleStore().timerById(this.idTimer);
    },
    formattedActualTime() {
      const isNegativeTime = this.actualSeconds < 0;
      let seconds = this.actualSeconds;
      if (isNegativeTime) {
        seconds = -this.actualSeconds;
      }
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

      if (isNegativeTime) {
        return `-${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      }
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    },
    formattedInitialTime() {
      const seconds = this.initialSeconds;
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    },
    name() {
      return this.timer.name
    },
    actualSeconds() {
      return this.timer.actualSeconds
    },
    initialSeconds() {
      const selectedSchedule =
        useScheduleStore().schedules[useScheduleStore().selectedSchedule];
      const timer = selectedSchedule.timers.find((t) => t.id === this.idTimer);

      return timer ? timer.initialSeconds : 0;
    },
    behavior(){
      return this.timer.behavior.valueOf()
    }
  },
  mounted() {
    this.selected = options.find((o) => o.behavior === this.timer.behavior) || {} as OptionTimer;
  },
  methods: {
  },
};
</script>

<template>
  <v-card
    color="secondary_light_2"
    elevated
    ma-2
    class="timer rounded"
    :class="{
      priorizada: esPrioritaria,
      eliminada: isDeleted,
      startedTimer: isActive,
      'bg-green': isActive,
      'elevation-20': isActive,
    }"
  >
    <v-row>
      <v-col class="showtime">
        <h3>{{ name }}</h3>
        <strong> {{ formattedActualTime }} / {{ formattedInitialTime }}</strong>
      </v-col>
      <v-col>
        <v-select v-model="selected" :item-props="true" :items="options" item-title="title" return-object/>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
* {
  /* border: orangered 1px solid; */
}

.priorizada {
  background-color: orange;
}
.timer {
  margin-bottom: 5px;
}

.eliminada {
  background-color: red;
}
.showtime{
  min-width: 19ch;
}
</style>
