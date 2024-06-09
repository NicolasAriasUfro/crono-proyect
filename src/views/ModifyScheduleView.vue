<script lang=ts>
import {useScheduleStore} from "@/stores/SheduleStore";

export default {
  name: "ModifyScheduleView",
  methods: {
    useScheduleStore,
    deleteSchedule() {
      const idSelectedSchedule = this.selectedSchedule;
      useScheduleStore().removeSchedule(idSelectedSchedule);
      this.nameSchedule = "";
    },
    addSchedule(){
      useScheduleStore().addSchedule(this.nameSchedule)
      this.nameSchedule = "";
    }
  },
  data() {
    return {
      nameSchedule: "",
      tab: null,
      listaDeSchedules: useScheduleStore().schedules
    };
  },
  computed: {
    schedulesList() {
      //get name of every schedule
      const schedules = [];
      useScheduleStore().schedules.forEach((schedule) => {
        schedules.push({ id: schedule.id, name: schedule.name });
      });
      return schedules;
    },
    selectedSchedule: {
      get() {
        return useScheduleStore().selectedSchedule;
      },
      set(value) {
        console.log(value);
        useScheduleStore().selectedSchedule = value.id;
      },
    },
  },
};
</script>

<template>
  <v-card>
    <v-toolbar color="primary">
      <v-tabs v-model="selectedSchedule" align-tabs="title">
        <v-tab
          v-for="schedule in listaDeSchedules"
          :key="schedule.id"
          :text="schedule.name"
          :value="schedule"
        ></v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-window v-model="selectedSchedule">
      <v-tabs-window-item
        v-for="schedule in listaDeSchedules"
        :key="schedule"
        :value="schedule"
      >
        <v-card flat> name schedule: {{ schedule.name }} </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
  <v-divider class="ma-4"></v-divider>

  <v-form>
    <v-text-field
      label="Nombre Cronograma"
      v-model="nameSchedule"
    ></v-text-field>
  </v-form>
  <v-container>
    <v-btn color="success" :disabled="nameSchedule===''" @click.prevent="addSchedule">
      Agregar Cronograma
    </v-btn>
    <v-btn color="error" @click.prevent="deleteSchedule(this.nameSchedule)">
      Eliminar Cronograma
    </v-btn>
  </v-container>
  <v-divider class="ma-4"></v-divider>
</template>

<style scoped></style>
