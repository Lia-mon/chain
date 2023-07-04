<script lang="ts">
import Unit from './Unit.svelte';
import Framer from './Framer.svelte';

// import { breaks } from '../../chaining/chains.js'
import { units, delays, unitNames } from '$lib/stores.js'

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

function showHelp(){
    return;
}

</script>


<div class='wrapper'>
    <div class='flex-h'>

        <button on:click={showHelp}>How to use</button>
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

:global(body){
    /* background-color: rgb(255, 207, 255); */
    max-width:850px;
}
</style>