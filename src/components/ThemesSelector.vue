<script lang="ts">
import { defineComponent } from 'vue';
import { useTheme } from 'vuetify';
import { useSessionStore } from '@/stores/SessionStore';
import { temasArray } from '@/themes/themes';

export default defineComponent({
  name: 'ThemeSelector',
  data() {
    return {
      sessionStore: useSessionStore(),
      theme: useTheme(),
      src: null as string | null,
      temasArray: temasArray,
      model: null as number | null,
    };
  },
  async mounted() {
    const moraCrema = await import('@/assets/mora-crema.jpg');
    this.src = moraCrema.default;
  },
  methods: {
    selectTheme(selectionValue: number) {
      const selectedTheme = this.temasArray[selectionValue];
      this.theme.global.name.value = selectedTheme.name;
      this.sessionStore.theme = selectedTheme.name;
    }
  }
});
</script>

<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
          v-bind="activatorProps"
          color="primary"
          text="Temas"
          variant="flat"
      >
        Temas
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card color="background" title="Seleccione un Tema">
        <v-divider class="mx-15" color="surface"></v-divider>
        <v-sheet
            color="background"
            class="mx-auto"
            max-width="100%"
        >
          <v-slide-group
              background-color="primary"
              v-model="model"
              class="pa-4"
              center-active
              show-arrows
          >
            <v-slide-group-item
                v-for="(tema, n) in temasArray"
                :key="n"
                v-slot="{ isSelected, toggle }"
            >
              <v-card
                  :color="isSelected ? 'success' : 'background'"
                  :image="tema.src"
                  class="ma-4"
                  height="200"
                  width="100"
                  @click="toggle"
                  overflow
                  centered
                  hover
              >
                <div class="d-flex fill-height align-center justify-center">
                  <v-scale-transition>
                    <font-awesome-icon v-if="isSelected" id="card-selector" width="20px" color="primary" icon="fa-solid fa-circle-check"/>
                  </v-scale-transition>
                </div>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="selectTheme(model); isActive.value = false;" color="success">Elegir</v-btn>
          <v-divider class="mx-3" color="primary" vertical></v-divider>
          <v-btn
              color="success"
              @click="isActive.value = false"
          >Volver</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
#card-selector {
  color: v-bind("theme.current.colors.success") !important;
  font-size: 3rem !important;
}
</style>
