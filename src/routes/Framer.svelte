<script lang="ts">
import UnitFrames from './UnitFrames.svelte';
import { units, unitFrames,delays, unitNames } from '$lib/stores.js'
import  { slide } from 'svelte/transition'
import type { Hit } from '$lib/chaining/chains.js';
import { breakMerge } from '$lib/chaining/chains.js';

let directFrames : Array<Hit[]> = Array(6).fill([]);
let topDiffs = Array(6).fill(0); //tied to priority, updated when frames change (which are also tied to priority)
let topMax = 0;

//delays tied to the unit
//a unit's index plays the role of priority


//reference to the big container, used to dynamically adjust the grid columns
let containerVisual: HTMLDivElement;

//used to decide the size of the drawn frames, grids and other elements depend on this too.
const frameSize = 9;

//unused / possibly has use to expand the infobar. abandoned. 
let expand = false;

//Used to store the starting frame for each unit
let results : number[] = [];
let leading : number = 0;



const countBreaks=(as: Array<Array<any>>):number =>{
    let s = 0;
    for(const a of as){
        s+=a.length;
    }
    return s;
}

//used to sort a unit's frames before being passed to the renderer and break function
const inUnitCmp = (h1 : Hit ,h2 : Hit)=>{
        if(h1.frame !== h2.frame){
            return h1.frame - h2.frame;
        }

        if(h1.cast !== h2.cast){
            return h1.cast - h2.cast;
        }
        
        return 0;
}

//makes sure no negative values get in the numerical input elements
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

//another comparison function, this time compares the 'true' delay between unit presses
const compare = (delays:number[],topDiffs:number[])=>(index1:number,index2:number) : number=>{
    const unit1 = $units[index1];
    const unit2 = $units[index2];

    return delays[unit1]+topDiffs[index2]-delays[unit2]-topDiffs[index1];
}

//Reactive calculations

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

$: {
    topMax = 0; 
    for(let i = 0; i < $units.length ; i++){
        const thingy = topDiffs[i] - $delays[$units[i]];
        if(topMax < thingy){
            topMax = thingy;
        }
    }
}

$: fBreaks =  breakMerge(directFrames,$units.length,$delays,topDiffs);

$:{
    results = Array($units.length).fill(0).map((a,i)=>i);
    results.sort(compare($delays,topDiffs));
    if(results.length > 1){
        leading = results[0];
    }
}

//Uses frame size (9px) should prolly make that a setting somewhere

$:if(containerVisual) containerVisual.style.backgroundSize = `${(100-4.5)/$units.length}% ${frameSize}px`;


</script>
<!------------------------------------------------------------------------------------->

<!-- 
<label for="container-controls" class='header'>Position offset / change</label>
 -->

<div class='container-controls'
    style='grid-template-columns: repeat({$units.length},1fr) 4.5%;'
    id='container-controls'
>
    {#each $units as unit,i (unit) }

        <div class='control'>
            <label for='{`prio-${i}`}'>{`${$unitNames[unit]}`}</label>
            <input type="number" value={$delays[unit]} on:input={sanitize(unit)} min='0' id={`prio-${i}`}>
        </div>

    {/each}

</div> 

 <!-- 

<div>
    {#each $units as unit,i}
        <div>
                Priority {i+1} is thrown after {Math.round($delays[unit])-topDiffs[i]+topMax} frames.
                <input type="number" bind:value={$delays[unit]} min=0 on:input={sanitize(unit)}>
                <input type="range" min='0' max='100' bind:value={$delays[unit]} name='{`prio-${i}`}'> 
        </div>
    {/each}
</div>

-->




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

        <span>
            There's {countBreaks(fBreaks) === 1 ? '1 break' : `${countBreaks(fBreaks)} breaks`}. 
        </span>

        {#each results as i}
        
            <span class='result'>
                p{i+1}:{$delays[$units[i]]-topDiffs[i]+topMax} 
            </span>

        {/each}

    </div>
</div>
{/if}


<!------------------------------------------------------------------------------------->

<style>

/* Is not fully PROGRAMMATIC in terms of frameSize */
/* Grid depends on some absolute numbers, we can rewrite this but meh :D*/
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
    /* grid-template-columns: repeat(3,1fr); */
    display: grid;
    flex-wrap:wrap;
    flex-direction: row;
    width:100%;
    /* display:none; */
    margin: 1em auto;
}

.control{
    display:flex;
    flex-direction: column;
    /* padding: 1em 1em; */
    /* border-bottom: 1px solid black; */
    align-items: center;
}

.control > *{
    font-size: large;
    height:1.1em;
    text-align: center;
    vertical-align:text-bottom;
}

.control input{
    margin-top: 0.3em;
    min-width: 4ch;
    width:70%;
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
} */

 /* .header{
    display: none;
    font-weight: bolder;
    margin:0 auto;
    width:70%;
    border-bottom: 1px solid black;
    text-align: center;
}  */

</style>