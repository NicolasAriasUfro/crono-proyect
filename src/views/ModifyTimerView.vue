<script lang=ts>
import {useScheduleStore} from "../stores/SheduleStore";
import EditableTimerComponent from "../../../crono-proyect/src/components/EditableTimerComponent.vue";

export default {
  name: "ModifyTimerView",
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
};
</script>

<template>
  Mi Cronograma

  <div
    class="ma-5"
    v-for="timer in useScheduleStore().schedules[selectedSchedule].timers"
    :key="timer.id"
  >
    <EditableTimerComponent
      class="selected"
      :id-timer="timer.id"
      :is-editable="true"
    >
    </EditableTimerComponent>
  </div>
  <v-divider class="ma-4"></v-divider>

  <v-form @submit.prevent="">
    <v-text-field bg-color="primary_light_3" v-model="nameTimer" label="Nombre" type="text">
    </v-text-field>
    <v-row color="red">
      <v-col>
        <v-text-field
          bg-color="primary_light_3"
          type="number"
          v-model="hh"
          :rules="rules"
          label="horas"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          bg-color="primary_light_3"
          class="w-30"
          min="0"
          max="59"
          type="number"
          v-model="mm"
          :rules="rules"
          label="Minutos"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          bg-color="primary_light_3"
          type="number"
          v-model="ss"
          :rules="rules"
          label="Segundos"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn color="success" type="submit" @click="addNewTimer" :disabled="isEmptyFields">Agregar</v-btn>
  </v-form>
</template>

<style scoped></style>
