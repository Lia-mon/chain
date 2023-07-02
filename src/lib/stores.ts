import { writable, type Writable } from "svelte/store";

interface Hit{
    frame : number;
    elements : boolean[];
    unit: number; //display
    cast: number;
    tag: boolean;
}

export const units : Writable<number[]>     = writable([0,1]);
 //Array of unitHits so that $unitFrame[i] points to priority i unit's hits
 //we'll have at most 6 units so we reserve the space anyway
export const unitFrames : Writable<Array<Hit[]>>   = writable(Array(6).fill([]));
export const delays : Writable<number[]> = writable(Array(6).fill(0));