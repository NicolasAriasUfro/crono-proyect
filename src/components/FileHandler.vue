<script setup lang="ts">
import { useSessionStore } from '@/stores/SessionStore';
import { useScheduleStore } from '@/stores/SheduleStore';
import { Schedule, Timer } from '@/types';
import { ref } from 'vue';

const sessionStore = useSessionStore();
const scheduleStore = useScheduleStore();
const dialog = ref(false)
const file = ref<File | null>(null);
const importedSchedule = ref<Schedule | null>(null); 
const currentSchedule = scheduleStore.schedules.find((u) => u.id = sessionStore.currentScheduleId) as Schedule;
const exportData = currentSchedule.timers.map(timer => ({
    schedule_id: currentSchedule.id,
    schedule_name: currentSchedule.name,
    id: timer.id,
    name: timer.name,
    seconds: timer.initialSeconds,
    behavior: timer.behavior,
}));

const handleParsingError = () => {
    console.log("parsing error!") //TODO:!!!
}

const handleFileChange = () => {
    if (file.value) {
        // fileReader is asynchronous
        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target?.result as string;
            const parseResult = parseCSV(csv);
            if (parseResult) {
                importedSchedule.value = parseResult 
                console.log(importedSchedule.value);
                //await scheduleStore.saveImportedSchedule(importedSchedule)
            } else {
                handleParsingError();
            }
        };
        reader.readAsText(file.value);
    }
};

const parseCSV = (data: string) => {
    if (data.length === 0) {
        return null;
    }
    const lines = data.split('\n');
    const _headers = lines[0].split(',');
    let timers: Timer[] = [];
    let scheduleName: string = '';
    let scheduleId: number = 0;
    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',')
        if (currentLine.length !== 6) {
            return null;
        }
        if (currentLine.every(value => value === '')){
            return null;
        }
        const timer: Timer = {
            id: parseInt(currentLine[2]),
            name: currentLine[3],
            initialSeconds: parseInt(currentLine[4]),
            actualSeconds: parseInt(currentLine[4]),
            behavior: parseInt(currentLine[5]),
            selected: false,
        };
        if (i===1) {
            scheduleId = parseInt(currentLine[0]),
            scheduleName = currentLine[1]
        }
        timers.push(timer as Timer);
    }
    const schedule: Schedule = {
        id: scheduleId,
        name: scheduleName,
        lastTimerId: 0,
        timers: timers
    }
    return schedule;
};

const exportFile = () => {
    console.log("export file");
}
</script>

<template>
    <v-container grid-list-xs>
        <download-csv
            :data="exportData"
            :name='exportData[0].schedule_name' 
        >
            <v-btn color="success" @click="exportFile">Exportar Cronograma</v-btn>
        </download-csv>
        
        <v-btn color="success" @click="dialog = true">Upload File</v-btn>
    </v-container>
    
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Upload File</span>
            </v-card-title>
            <v-card-text>
                <v-file-input
                    v-model="file"
                    label="Select File"
                    accept=".csv, .xlsx"
                    @change="handleFileChange"
                ></v-file-input>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" @click="dialog = false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

