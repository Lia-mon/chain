<script lang="ts">
import { units,unitFrames, unitNames, delays } from '$lib/stores.js';
import type { Hit } from '$lib/chaining/chains.js';
import { chains } from '$lib/chaining/chainData.js'

import { stretch, hstretch } from '$lib/chaining/transitions.js';


export let uid = 1 ;
export let priority = 0 ;

let casts = 1;
let castFlags : number[] = [];
let tagCasts :boolean[] = Array(5).fill(false);

let unitHits : Hit[] = [];

const castDelay  = 39;
const castOffset = 14;

const range = (n : number) =>{
    const res = Array(n).fill(0);
    return res.map((e,i)=>e+i);
}

const handleSelection = (id:number) => (e : Event) =>{
    
    unitHits = unitHits.filter(h=>h.cast !== id)
    
    if((e.target as HTMLSelectElement).value === '-1'){ //Custom dealing
        castFlags = [...castFlags,id];
        return;
    }

    if((e.target as HTMLSelectElement).value === ''){ //Empty dealing
        castFlags = castFlags.filter(e=>e!==id);
        unitHits = unitHits;
        return;
    }

    castFlags = castFlags.filter(e=>e!==id);
    const frames=(e.target as HTMLSelectElement).value.split(',').map(e=>Number(e));
    unitHits.push(...frames.map(f=>{
        const hit : Hit = {
            frame: f+id*(castOffset+castDelay), 
            unit: priority, 
            cast: id, 
            tag: tagCasts[id]
        } 
        
        return hit
        }
    ));

    unitHits = unitHits;
}

const handleCustom = (id:number) => (e : Event) =>{

    const framesRaw = (e.target as HTMLInputElement).value.trim() ;
    let frames = [];
    if(framesRaw.includes('-')){
        let last = 0;
        for(const frameDiff of framesRaw.split('-').map(e=>Number(e))){
            last +=frameDiff;
            frames.push(last);
        }
    }else{
        frames = framesRaw.split(',').map(e=>Number(e));
    }

    unitHits = unitHits.filter(h=>h.cast !== id); //clear already here
    if(frames.some(e=>isNaN(e) || e>6000) || frames.length > 150){ //SOME LIMITS ON CUSTOM INPUTS
        unitHits=unitHits; //trigger actions
        return;
    }

    unitHits = unitHits.filter(h=>h.cast !== id); //clear already here

    unitHits.push(...frames.map(f=>{ //update
        const hit : Hit = {
        frame: f+id*(castOffset+castDelay), 
        unit: priority, 
        cast: id, 
        tag: tagCasts[id]
        }
    
        return hit;
        }));

    unitHits=unitHits; //trigger actions
}


function killSwitch(){
    // unitHits = [];
    $unitFrames[uid] = [];
    $delays[uid] = 0;
    units.update(e=>e.filter(e=>e!==uid));
}

function changeCasts(n : number){
    const min = 1; //number of casts
    const max = 5;
    
    return () => {
        let newC = Math.max(min, Math.min(max, casts + n));
        if(n<0){
            unitHits = unitHits.filter(h=>h.cast < newC );
        }
        casts = newC ;
    }
}

$: castFlags = castFlags.filter(e=> e < casts)

$: unitHits.map(h=>{h.unit = priority}); //update on priority change /(other unit removal)

$: unitFrames.update(uf=>{ //update on priority change /(other unit removal)
    uf[priority] = unitHits;
    return uf;
    });


$:{for(const f of unitHits){
    f.tag = tagCasts[f.cast];
    }
    unitHits = unitHits
}

</script>

<fieldset class='unit' transition:stretch="{{duration: 400}}">
    <!-- Casts {casts} -->
    <div class='naming'>
        <!-- {priority+1}.
        {$unitNames[uid]} -->

        
        <label for="unitname">{priority+1}. </label>
        <input 
            type="text" bind:value={$unitNames[uid]}
            id='unitname'
            maxlength="18"
        > 
       
    </div>

    <div class='unit-buttons'>
        <!-- <button class='unit-settings'>{uid} </button> -->
        <button on:click={killSwitch}>x</button>
        <button on:click={changeCasts(+1)}> + </button>
        <button on:click={changeCasts(-1)}> - </button>
    </div>
   
    {#each range(casts) as id}
    <div 
        class = 'cast-selection'
        transition:stretch|local="{{duration: 400}}"
    >

        <input type="checkbox" class='checky' bind:checked={tagCasts[id]}>

        <select 
            name={`${uid}-cast${id}`} 
            id={`${uid}-cast${id}`} 
            class ='selection-menu'
            on:change = {handleSelection(id)}
        >

            <option value= ''>Empty</option>

            {#each chains as chain}
            <option value={chain.value}>{chain.name}</option>
            {/each}

            <option value= '-1'>Custom</option>

        </select>

        {#if castFlags.includes(id)}
            <input
                transition:hstretch|local="{{duration : 200}}"
                type="text"
                inputmode="numeric" 
                placeholder=""
                class="frame-input"
                on:change={handleCustom(id)}
            />
        {/if}
    </div>
    {/each}

</fieldset>

<style>

*{
    margin:0;
    font-size: larger;
}

.checky{
    max-width:50px;
}
.cast-selection{
    margin-top: 12px;
    text-align: center;
    width:100%;
    display:flex;
    flex-direction: row;
}

.cast-selection > *{
    padding:auto 0px;
    flex:1 1 7ch;
    /* min-width: 7ch; */
}

.cast-selection > select{
    padding:auto 0px;
    flex:1 1 4ch;
    min-width: 9ch;
}

.frame-input{
    width: 70%;
    /* flex: 1 0; */
    /* max-width:50%; */
}

.unit{
    padding: 0px 3px;
    margin-right: 3px;
    flex:0 1 0px;
    box-sizing:border-box;
    text-align: center;
    margin: 5px 0;
    padding: 5px 5px;
    border: 1.5px solid gray;
}

.naming{
    font-size: larger;
    font-weight: 600;
    margin: 9px 0;
}

.naming input{
    width:80%;
    padding: 0 0 0 0;
    text-align: center;
    border-width: 1px;
    box-sizing: border-box;
}

.unit-buttons{
    display:flex;
    flex-direction: row;
}

.unit-buttons > *{
    flex:1;
    border: 1px solid gray;
    border-right: none;
}

.unit-buttons > *:last-of-type{
    border-right: 1px solid gray; 
}

button{
    font-weight: bold;
}

.selection-menu{
    background-color: white;
    text-align: center;
    border: 1px solid gray;
    /* flex:1 1; */
}

.naming > * {
    font-weight: inherit;
    font-size: inherit;
}

#unitname{
    border:none;
    border-bottom: 1px solid black;
    min-width: 12ch;
}

/* Element selection stuff unused for now? */
/* 
.unit-settings{
    display: inline-block;
    background: url('../../images/gear-svgrepo-com.svg') no-repeat 10% 50%;
    background-size:contain;
    background-color:unset;
}
.selection-labels{
    display: flex;
    justify-content: space-around;
}

.selection-labels > * {
    flex:1;
}

.elem-container{
    display: flex;
    justify-content: space-around;
    border: 1px solid black;
} 

*/

</style>