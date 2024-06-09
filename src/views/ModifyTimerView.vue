<script lang=ts>
import {useScheduleStore} from "../stores/SheduleStore";
import EditableTimerComponent from "../../../crono-proyect/src/components/EditableTimerComponent.vue";

export default {
  name: "ModifyTimerView",
  components: { EditableTimerComponent },
  data() {
    return {
      nameTimer: "",
      hh: 0,
      mm: 0,
      ss: 0,
      rules: [
        (v) => v >= 0 || "No puede ser negativo",
        (v) => v <= 59 || "No puede ser mayor a 59",
      ],
      nameSchedule: "",
    };
  },
  computed: {
    isEmptyFields(){
      if(this.nameTimer === ""){
        return true;
      }
      return !(this.totalSeconds > 0);
    },
    selectedSchedule() {
      return useScheduleStore().selectedSchedule;
    },
    totalSeconds() :number {
      return Number(this.hh * 3600 + this.mm * 60 + this.ss);
    },
  },
  methods: {
    useScheduleStore,
    addNewTimer() {
      useScheduleStore().addTimer(this.nameTimer, this.totalSeconds);
      this.nameTimer = "";
      this.hh = 0;
      this.mm = 0;
      this.ss = 0;
    },
  },
};
</script>

<template>
  Mi Cronograma

  <div
    v-for="timer in useScheduleStore().schedules[selectedSchedule].timers"
    :key="timer.id"
    class="ma-5"
  >
    <EditableTimerComponent
      class="selected"
      :id-timer="timer.id"
      :is-editable="true"
    />
  </div>
  <v-divider class="ma-4" />

  <v-form @submit.prevent="">
    <v-text-field
      v-model="nameTimer"
      bg-color="primary_light_3"
      label="Nombre"
      type="text"
    />
    <v-row color="red">
      <v-col>
        <v-text-field
          v-model="hh"
          bg-color="primary_light_3"
          type="number"
          :rules="rules"
          label="horas"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="mm"
          bg-color="primary_light_3"
          class="w-30"
          min="0"
          max="59"
          type="number"
          :rules="rules"
          label="Minutos"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="ss"
          bg-color="primary_light_3"
          type="number"
          :rules="rules"
          label="Segundos"
        />
      </v-col>
    </v-row>
    <v-btn
      color="success"
      type="submit"
      :disabled="isEmptyFields"
      @click="addNewTimer"
    >
      Agregar
    </v-btn>
  </v-form>
</template>

<style scoped></style>
