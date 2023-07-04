<script lang="ts">
import Unit from './Unit.svelte';
import Framer from './Framer.svelte';

// import { breaks } from '../../chaining/chains.js'
import { units, delays, unitNames } from '$lib/stores.js'
    import { prevent_default } from 'svelte/internal';

function addUnit(){
    const max = 6;
    if($units.length >= max){
        return;
    }

    const pick = [0,1,2,3,4,5].find(e=>!$units.includes(e));

    if(pick !== undefined){
        units.update(e=>[...e,pick]);

        $unitNames[pick] = `Unit ${pick+1}`
        $delays[pick]=0;
    }
}

let showHelp = true;

</script>

{#if showHelp}
    <div class=help>
        <button on:click={()=>{showHelp = !showHelp}}>x</button>
    </div>
{/if}

<div class='wrapper'>
    <div class='flex-h'>

        <button on:click={()=>{showHelp = !showHelp}}>How to use</button>
        <button on:click={addUnit}>Add a unit</button>

    </div>

    <div class='unit-flex' >  

        {#each $units as uid (uid)}
            <Unit uid={uid} priority={$units.findIndex(e=>e===uid)} ></Unit>
        {/each}

    </div>
 
    <Framer></Framer>
</div>


<style>
button{
    line-height: 2.5em;
    font-size: larger;
    width: 100%;
    font-weight: bold;
}
.unit-flex{
    display:flex;
    /* width:876px; */
    flex-direction: column;
    margin: 0 auto;
    margin-bottom: 5px;
    /* align-items: center; */
    justify-content: space-around;
}

.wrapper{
    margin: 0 auto;
}

.flex-h{
    display:flex;
    margin-bottom: 5px;
}

.help{
    position: fixed;
    top:0%;
    left:0%;
    width: 80%;
    height:80%;
    background-color: rgba(241, 241, 241, 0.95);
    z-index: 10;
    transform: translate(10%,10%);
    /* border: 2px solid gray; */
    box-shadow: black 0px 0px 12px;
}

.help button{
    width:25px;
    aspect-ratio: 1/1;
    position:absolute;
    right:5%;
    top:2%;
    font-size: 20px;
    line-height:0;
    font-weight: 100;
    padding: 0;
    border-radius: 0;
    border: 1px solid black;
    background-color: rgba(255, 255, 255, 0.836);
    text-align: center;
}

:global(body){
    /* background-color: rgb(255, 207, 255); */
    max-width:850px;
}
</style>