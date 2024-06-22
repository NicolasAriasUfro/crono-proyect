<script lang=ts>
import TimerComponent from "../../../crono-proyect/src/components/TimerComponent.vue";
import GeneralManager from "../../../crono-proyect/src/components/GeneralManager.vue";
import GeneralGroupManager from "../../../crono-proyect/src/components/GeneralGroupManager.vue";
import {useScheduleStore} from "@/stores/SheduleStore";
import {useGroupStore} from "@/stores/GroupStore";
import TimerGroupComponent from "../../../crono-proyect/src/components/TimerGroupComponent.vue";
import {useSessionStore} from "@/stores/SessionStore";
import draggable from 'vuedraggable';
import {ref} from 'vue';
import {useAudioStore} from "@/stores/AudioStore";
import { UserGroup } from "@/types";
import {useTimeManagerStore} from "@/stores/TimeManagerStore.ts";
import FileHandler from "@/components/FileHandler.vue";
import ScheduleSharing from "@/components/ScheduleSharing.vue";

export default {
  components: { GeneralManager, TimerComponent, GeneralGroupManager, TimerGroupComponent, draggable, FileHandler, ScheduleSharing},
  setup(){
    const scheduleStore = useScheduleStore();
    const store = useScheduleStore();
    const timers = ref(store.schedules[store.selectedSchedule].timers);

    const onDragEnd = () => {
      store.schedules[store.selectedSchedule].timers = timers.value;
    };

    return {
      timers,
      onDragEnd
    };
  },
  data() {
    return {
      sessionStore: useSessionStore(),
      groupStore: useGroupStore(),
      audioStore: useAudioStore(),
      tab: "",
      currentTimerIndex: 0,
      groupSelectedName: '' as string,
      currentGroup: [] as UserGroup[],
      items: useSessionStore().groups,
      noGroups: true,
      drag: false,
    };
  },
  watch: {
    tab(){
      this.items = this.sessionStore.groups;
    },
    groupSelectedName(_newSelected, _oldSelected){
        this.currentGroup = [this.sessionStore.groups.find((u) => u.name === this.groupSelectedName)] as unknown as UserGroup[];
        this.groupStore.currentGroup = this.currentGroup;
        this.groupStore.resetAllTimers();
        this.groupStore.paused = true;
      },
    },

  mounted() {
    this.setInitialGroupSelected();
  },
  beforeMount() {
    this.setInitialGroupSelected();
    this.sessionStore.fetchGroups();
  },
  methods: {
    useScheduleStore,
    resetAllTimers() {
      this.currentTimerIndex = 0;
      const timersRefs = this.$refs.timers;
      useTimeManagerStore().setPausedTrue();

      timersRefs.forEach((timer) => {
        timer.resetTimer();
      });
    },
    setInitialGroupSelected() {
      this.noGroups = useSessionStore().groups.length === 0;
      if (!this.noGroups) {
        this.groupSelectedName = this.sessionStore.groups[0].name;
      }
    },
  },
};
</script>

<template>
  <v-tabs
    v-model="tab"
    align-tabs="center"
    color="primary"
  >
    <div class="d-flex justify-center">
      <v-tab
        class="d-flex w-50"
        value="personal"
      >
        personal
      </v-tab>
      <v-tab
        class="d-flex w-50"
        value="grupo"
      >
        grupo
      </v-tab>
    </div>
  </v-tabs>
    
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="personal">
      <div class="crono">
        <GeneralManager />
        <v-container class="buttons-container " fluid grid-list-xs>
          <v-row>
            <v-col order="2" order-md="1" cols="12" md="6" class="d-flex col-padding justify-center justify-md-start">
              <ScheduleSharing v-if="useScheduleStore().schedules.length !== 0" />
            </v-col>
            <v-col order="1" order-md="2" cols="12" md="6" class="d-flex col-padding justify-center justify-md-end">
              <FileHandler />
            </v-col>
          </v-row>
        </v-container>
        
        <draggable
          v-model="timers"
          item-key="id"
          @start="drag=true"
          @end="onDragEnd"
        >
          <template
            #item="element"
            tag="TimerComponent"
            class="timer-container"
          >
            <TimerComponent
              :id-timer="element.element.id"
              class="timer-container elevation-3 mb-3"
            />
          </template>
        </draggable>
      </div>
    </v-tabs-window-item>
    <v-tabs-window-item value="grupo">
      <div
        v-if="!noGroups"
        class="crono"
      >
        <div>
          <GeneralGroupManager :group-id="currentGroup[0].id" />
          <v-select
            v-model="groupSelectedName"
            :items="items"
            item-title="name"
            hint="Grupo seleccionado"
            label="Selecciona un grupo"
            density="compact"
            color="primary"
            item-color="primary"
            variant="underlined"
            persistent-hint
            single-line
          />
        </div>
        <div
          class="d-flex"
        > 
          <div
            v-for="groups in currentGroup"
            :key="groups.id"
            class=" d-flex flex-column align-items-center justify-center"
          >
            <div
              v-for="timer in groups.timers"
              :key="timer.id"
              fluid
              class="ma-3 justify-center timer-container elevation-3"
            > 
              <TimerGroupComponent
                :id-group="currentGroup[0].id"
                :id-timer="timer.id"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="crono mt-3"
      >
        <h3 class="my-3">
          ¡Aun no perteneces a ningún grupo!
        </h3>
        <v-btn
          to="/grupos"
          color="success"
        >
          Grupos
        </v-btn>
      </div>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<style scoped>
.crono {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.timer-container {
  width: 1000px;
}
.buttons-container{
  width: 1000px;

}
@media (max-width: 600px) {
    .timer-container {
        width: 40vh !important;
    }
    .buttons-container{
        width: 1000px;
        padding: 1rem 5%; 
    }
    .col-padding {
        padding-top: 4px !important; /* Adjust this value as needed */
        padding-bottom: 4px !important; /* Adjust this value as needed */
    }
}
</style>