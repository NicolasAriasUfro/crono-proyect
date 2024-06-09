import { defineStore } from "pinia";
import {useScheduleStore} from "@/stores/SheduleStore.ts";

// Definir una interfaz para el puerto serie
interface SerialPort {
  open: (options: { baudRate: number }) => Promise<void>;
  close: () => Promise<void>;
  writable: WritableStream<any>;
}

// Usar Partial para permitir null inicialmente
interface State {
  port: SerialPort | null;
}

export const useSerialPortStore = defineStore("serialPort", {
  state: (): State => ({
    port: null,
  }),
  getters: {
    isPortOpen(state): boolean {
      return state.port !== null;
    },
  },
  actions: {
    async connectSerialPort() {
      try {
        const port: SerialPort = await navigator.serial.requestPort();
        console.log(port);
        // Wait for the serial port to open.
        await port.open({ baudRate: 9600 });
        this.port = port;
        console.log(this.port);
      } catch (error) {
        console.error("Failed to connect to the serial port", error);
      }
    },
    async disconnectSerialPort() {
      if (this.isPortOpen && this.port) {
        try {
          await this.port.close();
          this.port = null;
        } catch (error) {
          console.error("Failed to disconnect the serial port", error);
        }
      }
    },
    async sendSerialPort() {
      if (this.isPortOpen && this.port) {
        try {
          let seconds = String(useScheduleStore().getTimeOfSelectedTimer());
          // Enviar seconds al puerto
          seconds += "\n";
          const encoder = new TextEncoder();
          const data = encoder.encode(String(seconds));

          // Send data to the port
          const writer = this.port.writable.getWriter();
          await writer.write(data);
          writer.releaseLock();
        } catch (error) {
          console.error("Failed to send data to the serial port", error);
        }
      } else {
        console.log("Port is not open");
      }
    },
  },
});
