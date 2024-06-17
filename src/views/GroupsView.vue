<script lang=ts>
import { Group } from '@/types';
import {useGroupStore} from '../stores/GroupStore';
import {useSessionStore} from '../stores/SessionStore';

export default {
    data() {
        return {
            value: 20,
            groupSelected: [] as Group[],
            items: useGroupStore().groups,
            alreadySelected: false,
            msg: '¡Ya te has unido a este grupo!'
        };
    },
    watch: {
        groupSelected(newGroupSelected, oldGroupSelected) {
            const userGroup = useSessionStore().groups.find((u) => u.id === newGroupSelected.index);
            this.alreadySelected = userGroup ? true : false;
            this.msg = '¡Ya te has unido a este grupo!';
        }
    },
    methods: {
        unirse() {
            useSessionStore().addGroup(this.groupSelected[0]);
            this.alreadySelected = true;
            this.msg = 'Te has unido al grupo exitosamente.'
        }
    },
    beforeMount(){
      useGroupStore().fetchAllGroups();
    }
};
</script>

<template>
  <v-container grid-list-xs>
    <v-select
      v-model="groupSelected[0]"
      :items="items"
      item-title="name"
      hint="Grupo seleccionado"
      label="Selecciona un grupo"
      density="compact"
      color="primary"
      item-color="primary"
      variant="underlined"
      persistent-hint
      return-object
      single-line
    />
  </v-container>
  <div v-if="groupSelected.length > 0">
    <v-btn
      v-if="!alreadySelected"
      color="success"
      @click="unirse"
    >
      Unirse
    </v-btn>
    <h3 v-else>
      {{ msg }}
    </h3>
  </div>
</template>