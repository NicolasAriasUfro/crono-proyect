<script setup lang="ts">
import { useGroupStore } from '@/stores/GroupStore';
import { useSessionStore } from '@/stores/SessionStore';
import { useScheduleStore } from '@/stores/SheduleStore';
import { Schedule } from '@/types';
import { onBeforeMount, ref } from 'vue';

const groupStore = useGroupStore();
const sessionStore = useSessionStore();
const scheduleStore = useScheduleStore();
const currentSchedule = ref<Schedule | null>(null)

const shareSchedule = async (isActive: { value: boolean; }) => {
    console.log("share schedule")
    if (currentSchedule.value) {
        await groupStore.createGroup(currentSchedule.value);
        isActive.value = false;
    }
}

onBeforeMount(() => {
    currentSchedule.value = scheduleStore.schedules.find((u) => u.id = sessionStore.currentScheduleId) as Schedule
})
</script>

<template>
    <v-dialog max-width="300">
    <template #activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" size="small" rounded="xl" variant="outlined" color="success"
            append-icon="mdi-share-variant">Compartir</v-btn>
        </template>
            
        <template #default="{ isActive }">
        <v-card
            color="background"
            title="¿Compartir Cronograma?"
            class="d-flex justify-center"
        >
            <v-divider
            class="mx-15"
            color="surface"
            />
            <v-sheet
            color="background"
            class="mx-auto"
            max-width="100%"
            >
            </v-sheet>
            <v-card-actions class="d-flex justify-space-between mx-3">
                <v-btn
                    color="success"
                    @click="shareSchedule(isActive)"
                >
                    Ok!
                </v-btn>
                <v-btn
                    color="success"
                    @click="isActive.value = false"
                >
                    Volver
                </v-btn>
            </v-card-actions>
        </v-card>
        </template>
    </v-dialog>
</template>
