<script lang="ts">
import UnitFrames from './UnitFrames.svelte';
import { units, unitFrames,delays } from '$lib/stores.js'
import  { slide } from 'svelte/transition'
import type { Hit } from '$lib/chaining/chains.js';
import { breakMerge } from '$lib/chaining/chains.js';

let directFrames : Array<Hit[]> = Array(6).fill([]);
let topDiffs = Array(6).fill(0); //tied to priority, updated when frames change (which are also tied to priority)

//delays tied to the unit
//a unit's index plays the role of priority

let containerVisual: HTMLDivElement;

const frameSize = 9;

let expand = false;

let results : number[] = [];

const countBreaks=(as: Array<Array<any>>):number =>{
    let s = 0;
    for(const a of as){
        s+=a.length;
    }
    return s;
}

const inUnitCmp = (h1 : Hit ,h2 : Hit)=>{
        if(h1.frame !== h2.frame){
            return h1.frame - h2.frame;
        }

        if(h1.cast !== h2.cast){
            return h1.cast - h2.cast;
        }
        
        return 0;
}

const sanitize = (id:number)=>(e:Event)=>{
    e.preventDefault();
    if(!e.target){
        return;
    }else{
        const node = e.target as HTMLInputElement;
        node.value = `${Math.max(0,Number(node.value))}`;
        $delays[id] = Number(node.value);
    }
}

const compare = (delays:number[],topDiffs:number[])=>(index1:number,index2:number) : number=>{
    const unit1 = $units[index1];
    const unit2 = $units[index2];

    return delays[unit1]+topDiffs[index2]-delays[unit2]-topDiffs[index1];
}

$:{
    for(let i = 0 ; i < 6 ; i++){
        if($unitFrames[i]){ 
            directFrames[i] = $unitFrames[i].slice().sort(inUnitCmp);
            if(directFrames[i][0]!== undefined){
                topDiffs[i] = directFrames[i][0].frame ;     
            }else{
                topDiffs[i] = 0 ;     
            }
        }
    }
}

$: topMax = Math.max(...topDiffs);

$: fBreaks =  breakMerge(directFrames,$units.length,$delays,topDiffs);

$:{
    results = Array($units.length).fill(0).map((a,i)=>i);
    results.sort(compare($delays,topDiffs));
}

// TODO : finish the smol ordering, remember what goes where

// $:{
//     const u = $units[i];
//     const index = Number(i);


// }


//Uses frame size (9px) should prolly make that a setting somewhere

$:if(containerVisual) containerVisual.style.backgroundSize = `${(100-4.5)/$units.length}% ${frameSize}px`;


</script>
<!------------------------------------------------------------------------------------->

<div class='container-controls'>
    {#each $units as unit,i (unit) }
        <div class='control'>
            <label for='{`prio-${i}`}'>{`Delay for prio ${i+1} | unit ${unit+1}`}</label>
            <input type="range" min='0' max='100' bind:value={$delays[unit]} name='{`prio-${i}`}'>
            <input type="number" value={$delays[unit]} on:input={sanitize(unit)} min='0'>
        </div>
    {/each}
</div>




<div>
    {#each $units as unit,i}
        <div>
            Priority {i+1} is thrown after {Math.round($delays[unit])-topDiffs[i]+topMax} frames.
        </div>
    {/each}
</div> 




 {#if ($units.length > 0)}
<div class='container-visual' 
     style='grid-template-columns: repeat({$units.length},1fr) 4.5%;'
     transition:slide="{{axis : 'x'}}"
     bind:this={containerVisual}>

    {#each $units as unit,i }

    <UnitFrames
        frameSize = {frameSize}
        frames={directFrames[i]}
        topDiff={topDiffs[i]}
        bind:delay={$delays[unit]}
        breaks = {fBreaks[i]}>
    </UnitFrames>

    {/each}
    <div class='infobar'
        class:expand> 

        <span>There's {countBreaks(fBreaks)} breaks.</span>
        {#each results as i}
            <span class='result'>p{i+1}:{$delays[$units[i]]-topDiffs[i]+topMax} </span>
        {/each}

    <!-- 
        <button class='infobuttons'
            on:click={()=>{expand=!expand}}
            >
            {expand? '-' : '+'}
        </button> 
    -->

    </div>
</div>
{/if}


<!------------------------------------------------------------------------------------->

<style>

/* Is not fully PROGRAMMATIC in terms of frameSize */
.container-visual{
    display:grid;
    column-gap:0px;
    background-image: 
    linear-gradient(to right,
                        rgba(0, 0, 0, .85) 0px 1px,
                        rgba(23, 25, 143, 0) 1px 10px)  
                        ,
    linear-gradient(to bottom,
                        rgba(255, 255, 255, 0) 3.5px,
                        rgb(100, 100, 100) 4px 5px,
                        rgba(23, 25, 143, 0) 5.5px 9px);

    width:100%;
}

.container-controls{
    display: flex;
    flex-direction: column;

    display:none;
}

.control{
    padding: 1em 0;
    /* margin-top:1em; */
    display:flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    border-bottom: 1px solid black;
}

.control > *{
    font-size: large;
    /* flex:1; */
    width:300px;
    height:2em;
    text-align: center;
}

.control:last-child{
    margin-bottom:0;
    border-bottom:none;
}

.infobar{
    /* padding-inline-start: 35px; */
    text-indent: 10px;
    font-size: min(4vw,30px);
    background-color: rgb(248, 248, 248);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    position: sticky;
    top:0;
    right:0;
    max-height:100vh;
    /* display: flex; */
    justify-content: space-evenly;
}

.infobar .result::after{
    content: '→ ';
}

.infobar .result:last-child::after{
    content: '';
}

/* .infobar button{
    width: 20px;
    height: 25px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: large;
    background-color: unset;
    border: 1px solid gray;
}

.infobar span{
  
} */
</style>