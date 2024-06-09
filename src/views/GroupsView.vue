<script lang=ts>
import { useGroupStore } from '../stores/GroupStore';
import { useSessionStore } from '../stores/SessionStore';

export default {
    data() {
        return {
            value: 20,
            groupSelected: '',
            items: useGroupStore().groups,
            alreadySelected: false,
            msg: '¡Ya te has unido a este grupo!'
        };
    },
    methods: {
        unirse() {
            useSessionStore().groups.push({
                id: this.groupSelected.index,
                name: this.groupSelected.name
            });
            this.alreadySelected = true;
            this.msg = 'Te has unido al grupo exitosamente.'
        }
    },
    watch: {
        groupSelected(newGroupSelected, oldGroupSelected) {
            const userGroup = useSessionStore().groups.find((u) => u.id === newGroupSelected.index);
            this.alreadySelected = userGroup ? true : false;
            this.msg = '¡Ya te has unido a este grupo!';
        }
    },
};
</script>

<template>
    <v-container grid-list-xs >
        <v-select
        v-model="groupSelected"
        :items="items"
        item-title="name"
        item-value="cronograma"
        hint="Grupo seleccionado"
        label="Selecciona un grupo"
        density="compact"
        color="primary"
        item-color="primary"
        variant="underlined"
        persistent-hint
        return-object
        single-line
    ></v-select>
    </v-container>
    <div v-if="groupSelected !== ''">
        <v-btn v-if="!alreadySelected" @click="unirse" color="success">Unirse</v-btn>
        <h3 v-else>{{ msg }}</h3>
    </div>
</template>