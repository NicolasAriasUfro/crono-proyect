import { useGroupStore } from "@/stores/GroupStore";
import { useScheduleStore } from "@/stores/SheduleStore";

export function intervalService() {
    useGroupStore().everySecond();
    useScheduleStore().everySecond();
}
