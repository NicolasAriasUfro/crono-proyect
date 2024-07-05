<script setup lang="ts">
import axios from "axios";
import {API_ROUTE} from "@/main.ts";
import {useScheduleStore} from "@/stores/SheduleStore.ts";
import {Schedule, TimerBehavior} from "@/types.ts";
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
      const schedulesDTO = response.data;
      const schedules: Schedule[] = schedulesDTO.map((scheduleDTO: any) => {
        const schedule: Schedule = {
          id: scheduleDTO.cronograma_id,
          lastTimerId: scheduleDTO.timers.length,
          name: scheduleDTO.name,
          timers: scheduleDTO.timers.map((timerDTO: any) => {
            return {

              id: timerDTO.timer_id,
              name: timerDTO.name,
              initialSeconds: timerDTO.seconds,
              actualSeconds: timerDTO.seconds,
              behavior: TimerBehavior.NORMAL,
              selected: false,
            };
          }),
        };
        return schedule;
      });
      useScheduleStore().schedules = schedules;
    })
    .catch((error) => {
      console.log(error);
    });

};
/**
 * Sube todos los timer de los cronogramas actuales al servidor
 */
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

    //subir los timers igualmente
  uploadTimersOfSchedule(schedule);

};
const uploadTimersOfSchedule = (schedule: Schedule) => {
  try {
    console.info("Subiendo timers del cronograma: " + schedule.name);
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
          .post(API_ROUTE + endpoint, timerOfScheduleDTO, {headers,data: timerOfScheduleDTO})
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