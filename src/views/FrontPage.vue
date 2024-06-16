<script setup lang="ts">
import navBar from "@/components/NavBar.vue";
import footerComponent from "@/components/Footer.vue";
import ThemesSelector from "@/components/ThemesSelector.vue";
import router from "../router";
import { useTheme } from "vuetify";
import { useSessionStore } from "../stores/SessionStore";

// Stores
const session = useSessionStore();
const theme = useTheme();

// Imagenes
import clockImage from '@/assets/reloj.png';
import demoCronograma from '@/assets/demo/demo_cronograma.png';
import demoCreacionTmp from '@/assets/demo/demo_creacion_tmp.png';
import demoTheme from '@/assets/demo/demo_theme.png';
import demoTheme1 from '@/assets/demo/demo_theme_1.png';
import demoGroups from '@/assets/demo/demo_groups.png';

// Métodos
const login = () => {
  router.push({ name: "auth" });
}

const ingresar = () => {
  router.push({ name: "cronograma" });
}
</script>

<template>
  <v-app-bar app>
    <navBar />
  </v-app-bar>
  <v-main
    grid-list-sm
    fluid
    class="main-container"
  >
    <v-container
      grid-list-xs
      fluid
      class="first-container align-content-center"
    >
      <v-row>
        <v-col
          cols="12"
          md="6"
          class="d-none d-md-flex flex-column align-end"
        >
          <img
            :src="clockImage"
            alt="clock-image"
            class="main-clock"
          >
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="d-flex flex-column align-start justify-center text-left"
        >
          <h1 class="gradient">
            CronoProyect
          </h1>
          <p>
            CronoProyect es una aplicación poderosa e intuitiva diseñada para ayudarte a planificar y cronometrar cada parte de tus presentaciones con facilidad!
            Ya seas profesor, estudiante, profesional de negocios o orador público, esta aplicación te garantiza que te mantengas en el camino correcto y saques el máximo provecho de tu tiempo de presentación.
          </p>
          <div class="mt-5">
            <v-btn
              v-if="session.token == null"
              color="success"
              @click="login"
            >
              Ingresar
            </v-btn>
            <v-btn
              v-else
              color="success"
              @click="ingresar"
            >
              Ingresar
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container
      grid-list-sm
      class="second-container"
    >
      <v-row class="mb-10">
        <v-col
          order="1"
          order-md="1"
          cols="12"
          md="6"
          class="d-flex align-center text-left"
        >
          <div>
            <h3>Gestiona tus horarios</h3>
            <p>
              Gestionar tus horarios de presentación nunca ha sido tan sencillo.
              Nuestra aplicación te permite crear horarios detallados y personalizados para cada una de tus presentaciones.
            </p>
          </div>
        </v-col>
        <v-col
          order="2"
          order-md="2"
          cols="12"
          md="6"
        >
          <v-img
            rounded
            contain
            max-width="550"
            class="img-second-ctn"
            :src="demoCronograma"
          />
        </v-col>
      </v-row>
      <v-row class="mb-10">
        <v-col
          order="2"
          order-md="1"
          cols="12"
          md="6"
        >
          <v-img
            rounded
            contain
            max-width="550"
            class="img-second-ctn"
            :src="demoCreacionTmp"
          />
        </v-col>
        <v-col
          order="1"
          order-md="2"
          cols="12"
          md="6"
          class="d-flex align-center text-left"
        >
          <div>
            <h3>Agrega horarios adicionales</h3>
            <p>
              Crear horarios de presentación es rápido y sencillo,
              permitiendo una eficaz gestión del tiempo y estructura de tu próxima presentación.
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row class="mb-10">
        <v-col
          order="1"
          order-sm="1"
          cols="12"
          md="6"
          class="d-flex align-center text-left"
        >
          <div>
            <h3>Personaliza tu aplicación</h3>
            <p class="mb-3">
              ¡Modifica el tema de la aplicación a tu gusto!
              CronoProyect te permite seleccionar un tema a elección de una colección existente.
            </p>
            <ThemesSelector />
          </div>
        </v-col>
        <v-col
          order="2"
          order-md="2"
          cols="12"
          md="6"
          class="d-flex"
        >
          <v-img
            rounded
            contain
            max-width="550"
            class="img-second-ctn mr-3"
            :src="demoTheme"
          />
          <v-img
            rounded
            contain
            max-width="550"
            class="img-second-ctn"
            :src="demoTheme1"
          />
        </v-col>
      </v-row>
      <v-row class="mb-10">
        <v-col
          order="2"
          order-md="1"
          cols="12"
          md="6"
        >
          <v-img
            rounded
            contain
            max-width="550"
            class="img-second-ctn"
            :src="demoGroups"
          />
        </v-col>
        <v-col
          order="1"
          order-md="2"
          cols="12"
          md="6"
          class="d-flex align-center text-left"
        >
          <div>
            <h3>Únete a grupos existentes</h3>
            <p>
              Sé parte de grupos ya creados y comparte horarios con tu grupo de presentación.
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row class="d-flex flex-column justify-center my-10">
        <h3 class="mb-3">
          ¡Comienza ahora!
        </h3>
        <div>
          <v-btn
            color="success"
            @click="login"
          >
            Ingresar
          </v-btn>
        </div>
      </v-row>
    </v-container>
    <footerComponent />
  </v-main>
</template>

<style>
.main-container {
  background-color: v-bind("theme.current.value.colors.front_light") !important;
}
.first-container {
  background-color: v-bind("theme.current.value.colors.primary_light_3") !important;
  height: 50%;
  padding: 16px 350px !important;
}
.main-clock {
  height: 400px;
  width: 450px;
}
.second-container {
  background-color: v-bind("theme.current.value.colors.front_light") !important;
  padding: 16px 4% !important;
}
.image-second-ctn {
  border-radius: 30px !important;
}
.gradient {
  color: v-bind("theme.current.value.colors.primary") !important;
  background-image: -webkit-linear-gradient(
      0deg,
      v-bind("theme.current.value.colors.primary") 14%,
      v-bind("theme.current.value.colors.success") 55%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
@media (max-width: 600px) {
    .first-container {
        padding: 16px !important;
    }
}
</style>
