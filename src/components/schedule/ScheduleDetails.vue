<script setup lang="ts">
import { defineProps } from 'vue';
import { Schedule } from "@/types.ts";

const props = defineProps<{
  schedule: Schedule;
}>();

const totalTime = (): string => {
  const total: number = totalSeconds();
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${hours}:${minutes}:${seconds}`;
}

const totalSeconds = (): number => {
  let total = 0;
  for (const timer of props.schedule.timers) {
    total += timer.actualSeconds;
  }
  return total;
}
</script>

<template>
  <v-card flat>
    <h4>Resumen</h4>
    Nombre: {{ schedule.name }}.
    <br>
    Cantidad de Temporizadores: {{ schedule.timers.length }}.
    <br>
    Id: {{ schedule.id }}.
    <br>
    Tiempo Total: {{ totalTime() }}. <!-- Invoke totalTime function -->
  </v-card>
</template>

<style scoped>
</style>
