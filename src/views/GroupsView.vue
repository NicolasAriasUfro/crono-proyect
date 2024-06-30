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
            this.alreadySelected = !!userGroup;
            this.msg = '¡Ya te has unido a este grupo!';
        }
    },
    computed: {
        isOwner() {
          const isOwner = true;
          return this.groupSelected.isOwner == isOwner;
        }
    },
    methods: {
        itemProps(item: { name: any; ownerName: any; }) {
            return {
              title: item.name,
              subtitle: `Creado por: ${item.ownerName}`,
            }
        },
        async deleteGroup(isActive: any) {
            try {
              await useGroupStore().deleteGroup(this.groupSelected);
              await useGroupStore().fetchAllGroups();
              isActive.value = false;
              this.groupSelected = useGroupStore().groups[0];
              this.items = useGroupStore().groups;
            } catch (error) {
              
            }
        },
        async unirse() {
            try {
              await useSessionStore().addGroup(this.groupSelected);
              this.alreadySelected = true;
              this.msg = 'Te has unido al grupo exitosamente.'
            } catch (error) {
              
            }
            
        }
    },
    updated(){
      this.items = useGroupStore().groups;
    },
    beforeMount(){
      useGroupStore().fetchAllGroups();
      this.groupSelected = useGroupStore().groups[0];
      this.items = useGroupStore().groups;
    }
};
</script>

<template>
  <v-container grid-list-xs class="d-flex flex-column justify-space-between min-vh-100 main-container align-center">
    <v-container class="d-flex flex-column align-center">
      <v-select
        v-model="groupSelected"
        :items="items"
        item-title="name"
        :item-props="itemProps"
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
        class="v-select my-14"
        
      />
      <div v-if="groupSelected" class="mb-16">
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
    </v-container>
    <v-dialog max-width="500">
      <template #activator="{ props: activatorProps }">
        <v-btn
          v-if="isOwner"
          v-bind="activatorProps"
          color="error"
          variant="outlined"
          class="delete-btn"
        >
          Borrar Grupo
        </v-btn>
      </template>

      <template #default="{ isActive }">
        <v-card
          color="background"
          title="Borrar Grupo"
          prepend-icon="mdi-delete"
        >
          <v-divider
            class="mx-15"
            color="surface"
          />
          <v-card-text>
            <v-alert type="error" title="¿Desea borrar este grupo?" text="ESTA ACCIÓN ES PERMANENTE" :value="true">
            </v-alert>
          </v-card-text>
          <v-card-actions class="mx-3">
            <v-btn
              color="error"
              @click="deleteGroup(isActive)"
              variant="outlined"
            >
              Borrar
            </v-btn>
            <v-spacer />
            <v-btn
              color="success"
              @click="isActive.value = false"
              variant="outlined"
            >
              Volver
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    
  </v-container>
</template>

<style scoped>
.v-select{
  width: 40% !important;
}
.delete-btn {
  margin-top: auto !important;
  margin-bottom: 16px;
}
.main-container {
  min-height: 100%;
}
@media (max-width: 600px) {
  .v-select{
    width: 100% !important;
  }
}
</style>