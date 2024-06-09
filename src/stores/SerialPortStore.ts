import {defineStore} from "pinia";
import {useScheduleStore} from "@/stores/SheduleStore";

export const useSerialPortStore = defineStore("serialPort", {
  state: () => ({
    port: null,
  }),
  getters: {
    isPortOpen(){
      return this.port !== null;
    },
  },
  actions: {
    async connectSerialPort() {
      const port = await navigator.serial.requestPort();
      console.log(port);
      // Wait for the serial port to open.
      await port.open({ baudRate: 9600 });
      this.port = port;
      console.log(this.port);
    },
    async disconnectSerialPort() {
      if (this.isPortOpen) {
        await this.port.close();
        this.port = null;
      }
    },
    async sendSerialPort() {
      if (this.isPortOpen) {
        let seconds = useScheduleStore().getTimeOfSelectedTimer();
        console.log(seconds);
        //enviar seconds to this.port
        seconds += "\n";
        const encoder = new TextEncoder();
        const data = encoder.encode(String(seconds));
        console.log(data);

        // Send data to the port
        const writer = this.port.writable.getWriter();
        await writer.write(data);
        writer.releaseLock();
      } else {
        console.log("Port is not open");
      }
    },
  },
});
