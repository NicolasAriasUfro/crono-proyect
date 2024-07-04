<script setup lang="ts">
import axios from "axios";
import {API_ROUTE} from "@/main.ts";
import {useScheduleStore} from "@/stores/SheduleStore.ts";
import {Schedule} from "@/types.ts";
import {useSessionStore} from "@/stores/SessionStore.ts";
const updateAllScheduleFromServer = () => {
  console.log("Descargando cambios");
  const endpoint = "/api/cronograma/user";
  const headers = {
    Authorization: "Bearer " + useSessionStore().token,
  };
  axios
    .get(API_ROUTE + endpoint, {headers})
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

};
const uploadAllScheduleToServer = () => {
  try {
    for (const schedule of useScheduleStore().schedules) {
      uploadScheduleToServer(schedule);
    }
  }catch (e) {
    console.error(e);
    throw new Error("Error al subir cambios");
  }
};
const uploadScheduleToServer = (schedule: Schedule) => {
  try {
    const endpoint = "/api/cronograma/new";
    const headers = {
      Authorization: "Bearer " + useSessionStore().token,
    };

    const scheduleDTO = {
      cronograma_id: schedule.id,
      name: schedule.name,
    };
    axios
        .post(API_ROUTE + endpoint, scheduleDTO, {headers})
        .then((response) => {
          console.log(response.data);
          //cambia el "id" según el "id" de la base de datos
          schedule.id = response.data.id;
          console.info("Cronograma subido con éxito");
          uploadTimersOfSchedule(schedule);
        })
        .catch((error) => {
          console.error("Error al intentar subir el cronograma");
          console.error(error);
        });

  }catch (e) {
    console.error(e);
    throw new Error("Error al subir cambios");
  }
};
const uploadTimersOfSchedule = (schedule: Schedule) => {
  try {
    console.log("Subiendo timers");
    const endpoint = "/api/cronograma/add-timer";
    const headers = {
      Authorization: "Bearer " + useSessionStore().token,
    };
    for (const timer of schedule.timers) {
      //cronograma_id, timer: {name, seconds}
      const timerOfScheduleDTO = {
        cronograma_id: schedule.id,
        timer: {
          name: timer.name,
          seconds: timer.initialSeconds,
        },
      };
      axios
          .post(API_ROUTE + endpoint, timerOfScheduleDTO, {headers})
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error("error al intentar subir el timer")
            console.error(error);
          });
    }
  }catch (e) {
    console.error(e);
    throw new Error("Error al subir cambios");
  }
};
</script>

<template>
  <h1>Sincronizar</h1>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="success" @click="uploadAllScheduleToServer">
          Subir Cambios
        </v-btn>
        <v-btn @click="updateAllScheduleFromServer">
          Descargar Cambios
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

</template>

<style scoped>

</style>