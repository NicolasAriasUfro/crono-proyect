<script lang=ts>
import {useScheduleStore} from "@/stores/SheduleStore";
import {Schedule} from "@/types.ts";

export default {
  name: "ModifyScheduleView",
  data() {
    return {
      nameSchedule: "",
      tab: null,
      scheduleStore : useScheduleStore(),
      scheduleSelected: useScheduleStore().schedules[useScheduleStore().selectedScheduleIndex] as Schedule,
    };
  },
  computed: {
    listaDeSchedules(){
      return useScheduleStore().schedules as Schedule[];
    },
    IndexSelectedSchedule: {
      get() {
        return useScheduleStore().selectedScheduleIndex;
      },
      set(value:Schedule) {
        console.log(value);
        useScheduleStore().selectedScheduleIndex = value.id;
      },
    },
  },
  methods: {
    useScheduleStore,
    deleteSchedule() {
      this.scheduleStore.removeSchedule(this.IndexSelectedSchedule);
      this.nameSchedule = "";
    },
    addSchedule(){
      this.scheduleStore.addSchedule(this.nameSchedule)
      this.nameSchedule = "";
    }
  },
  watch:{
    scheduleSelected(newValue, _oldValue){
      //actualiza el index seleccionado del store
      const index = this.listaDeSchedules.findIndex(schedule => schedule.id === newValue.id);

      this.scheduleStore.selectedScheduleIndex = index;
    }
  }
};
</script>

<template>
  selectedScheduleIndex: {{ IndexSelectedSchedule }}
  <v-card>
    <v-toolbar color="primary">
      <v-tabs
        v-model="scheduleSelected"
        align-tabs="title"
      >
        <v-tab
          v-for="schedule in listaDeSchedules"
          :key="schedule.id"
          :text="schedule.name"
          :value="schedule"
        />
      </v-tabs>
    </v-toolbar>

    <v-tabs-window v-model="scheduleSelected">
      <v-tabs-window-item
        v-for="schedule in listaDeSchedules"
        :key="schedule.id"
        :value="schedule"
      >
        <v-card flat>
          name schedule: {{ schedule.name }}.
          id schedule: {{schedule.id}}.
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
  <v-divider class="ma-4" />

  <v-form>
    <v-text-field
      v-model="nameSchedule"
      label="Nombre Cronograma"
    />
  </v-form>
  <v-container>
    <v-btn
      color="success"
      :disabled="nameSchedule===''"
      @click.prevent="addSchedule"
    >
      Agregar Cronograma
    </v-btn>
    <v-btn
      color="error"
      :disabled="scheduleStore.quantity <= 1"
      @click.prevent="deleteSchedule()"
    >
      Eliminar Cronograma
    </v-btn>
  </v-container>
  <v-divider class="ma-4" />
</template>

<style scoped></style>
