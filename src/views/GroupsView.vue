<script lang=ts>
import { Group } from '@/types';
import {useGroupStore} from '../stores/GroupStore';
import {useSessionStore} from '../stores/SessionStore';

export default {
    data() {
        return {
            value: 20,
            groupSelected: {} as Group,
            items: useGroupStore().groups,
            alreadySelected: false,
            msg: '¡Ya te has unido a este grupo!'
        };
    },
    watch: {
        groupSelected(newGroupSelected: Group, _oldGroupSelected) {
            const userGroup = useSessionStore().groups.find((u) => u.id === newGroupSelected.id);
            this.alreadySelected = userGroup ? true : false;
            this.msg = '¡Ya te has unido a este grupo!';
        }
    },
    methods: {
        unirse() {
            useSessionStore().addGroup(this.groupSelected);
            this.alreadySelected = true;
            this.msg = 'Te has unido al grupo exitosamente.'
        }
    },
    beforeMount(){
      useGroupStore().fetchAllGroups();
      this.groupSelected = useGroupStore().groups[0];
    }
};
</script>

<template>
  <v-container grid-list-xs class="d-flex justify-center">
    <v-select
      v-model="groupSelected"
      :items="items"
      item-title="name"
      hint="Grupo seleccionado"
      label="Selecciona un grupo"
      density="compact"
      base-color="primary"
      color="primary"
      item-color="primary"
      variant="underlined"
      persistent-hint
      return-object
      single-line
      class="v-select"
    />
  </v-container>
  <div v-if="groupSelected">
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

<style scoped>
.v-select{
  max-width: 60%;
}
@media (max-width: 600px) {
  .v-select{
    max-width: 90%;
  }
}
</style>