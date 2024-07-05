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
      const schedulesDTO = response.data;
      const schedules: Schedule[] = schedulesDTO.map((scheduleDTO: any) => {
        const schedule: Schedule = {
          id: scheduleDTO.cronograma_id,
          name: scheduleDTO.name,
          timers: scheduleDTO.timers.map((timerDTO: any) => {
            return {
              id: timerDTO.timer_id,
              name: timerDTO.name,
              initialSeconds: timerDTO.seconds,
            };
          }),
          lastTimerId: scheduleDTO.timers.length,
        };
        return schedule;
      });
      useScheduleStore().schedules = schedules;
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

    const headers = {
      Authorization: "Bearer " + useSessionStore().token,
    };

    const scheduleDTO = {
      cronograma_id: schedule.id,
      name: schedule.name,
    };
    let existeEnLaBD = false;
    //- PUT `/api/cronograma/update` - requires `cronograma_id, name`, returns the cronograma
    const endpointPut = "/api/cronograma/update";
    axios.put(API_ROUTE + endpointPut, scheduleDTO, {headers})
        .then((response) => {
          console.log(response.data);
          console.info("Cronograma actualizado con éxito");
          existeEnLaBD = true;
        })
        .catch((error) => {
          console.error("Error al intentar actualizar el cronograma" + error);
        });

    const endpointPost = "/api/cronograma/new";
    if (!existeEnLaBD) {
      axios
          .post(API_ROUTE + endpointPost, scheduleDTO, {headers})
          .then((response) => {
            console.log(response.data);
            //cambia el "id" según el "id" de la base de datos
            schedule.id = response.data.cronograma_id;
            console.info("Cronograma subido con éxito");

          })
          .catch((error) => {
            console.error("Error al intentar subir el cronograma o el cronograma ya existe");
            //TODO: usar logica apra revisar si el cronograma existe
            console.error(error);
          });
    }
    //subir los cronogramas igualmente
    uploadTimersOfSchedule(schedule);


  }catch (e) {
    console.error(e);
    throw new Error("Error al subir cambios");
  }
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