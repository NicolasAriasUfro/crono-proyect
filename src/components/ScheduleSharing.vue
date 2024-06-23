<script setup lang="ts">
import { useGroupStore } from '@/stores/GroupStore';
import { useSessionStore } from '@/stores/SessionStore';
import { useScheduleStore } from '@/stores/SheduleStore';
import { Schedule } from '@/types';
import { computed, onBeforeMount, Ref, ref } from 'vue';

const groupStore = useGroupStore();
const sessionStore = useSessionStore();
const scheduleStore = useScheduleStore();
const currentSchedule = ref<Schedule | null>(null)
const message: Ref<string | undefined> = ref('¿Desea compartir este Cronograma?');
const groupNameExists = ref(false);
const changingName = ref(false);
const groupCreated = ref(false);
const newScheduleName = ref('');

const nameRules = computed(() => [
    (v: string) => !!v || 'Ingresar un nombre.',
    (v: string) => v.length <= 30 || 'Máximo 30 caracteres.',
]);

const isFormValid = computed(() => {
    const value = newScheduleName.value;
    const rules = nameRules.value;
    return rules.every(rule => rule(value) === true);
});

const changeName = (isActive: { value: boolean; }) => {
    if (currentSchedule.value) {
        currentSchedule.value.name = newScheduleName.value;
        shareSchedule(isActive);
        changingName.value = false;
        groupNameExists.value = false;
        newScheduleName.value = '';
    }
}

const resetSharing = (isActive: { value: boolean; }) => {
    changingName.value = false;
    groupNameExists.value = false;
    newScheduleName.value = '';
    message.value = '¿Desea compartir este Cronograma?';
    isActive.value = false;
    groupCreated.value = false;
}

const shareSchedule = async (isActive: { value: boolean; }) => {
    console.log("share schedule")
    if (currentSchedule.value) {
        try {
            await groupStore.createGroup(currentSchedule.value);
            message.value = '¡El grupo ha sido creado exitosamente!'
            changingName.value = false;
            groupNameExists.value = false;
            newScheduleName.value = '';
            groupCreated.value = true;
        } catch (error: any) {
            message.value = error.response.data;
            groupNameExists.value = true;
        }
        
        //isActive.value = false;
    }
}

onBeforeMount(() => {
    currentSchedule.value = scheduleStore.schedules.find((u) => u.id = sessionStore.currentScheduleId) as Schedule
})
</script>

<template>
    <v-dialog max-width="400" persistent>
    <template #activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" size="small" rounded="xl" variant="outlined" color="success"
            append-icon="mdi-share-variant">Compartir</v-btn>
        </template>
            
        <template #default="{ isActive }">
        <v-card
            color="background"
            title="Compartir Cronograma"
            class="d-flex justify-center"
            prepend-icon="mdi-share-variant"
        >
            <v-divider
                class="mx-15"
                color="surface"
            />
            <v-card-text color="primary" class="mx-4">
                <div class="d-flex flex-row justify-center align-center">
                    <p color="primary"> {{ message }} </p>
                    <v-icon v-if="groupCreated" class="ml-2 d-flex align-center" icon="mdi-check"></v-icon>
                </div>
                
                <p v-if="groupNameExists && !changingName" class="d-flex justify-center my-2">¿Desea cambiar el nombre del grupo?</p>
                
            </v-card-text>
            <v-text-field
                    v-if="changingName"
                    v-model="newScheduleName"
                    bg-color="teal-lighten-5"
                    label="Nuevo Nombre"
                    :rules="nameRules"
                    class="mx-5"
                    validate-on="input"
                    required
                ></v-text-field>
            <v-divider
                class="mx-15"
                color="surface"
            />
            <v-card-actions class="d-flex justify-space-between mx-3">
                <v-btn
                    v-if="!groupNameExists && !changingName && !groupCreated"
                    color="success"
                    @click="shareSchedule(isActive)"
                >
                    Ok!
                </v-btn>
                <v-btn
                    v-if="groupNameExists && !changingName && !groupCreated"
                    color="success"
                    
                    @click="changingName = true; message = 'Ingrese el nuevo nombre de grupo'"
                >
                    Cambiar Nombre 
                </v-btn>
                <v-btn
                    v-if="changingName && !groupCreated"
                    color="success"
                    @click="changeName(isActive)"
                    :disabled="!isFormValid"
                >
                    Ok!
                </v-btn>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-btn
                    color="success"
                    @click="resetSharing(isActive)"
                >
                    Volver
                </v-btn>
            </v-card-actions>
        </v-card>
        </template>
    </v-dialog>
</template>
