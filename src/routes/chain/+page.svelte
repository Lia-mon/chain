<script lang="ts">
import Unit from './Unit.svelte';
import Framer from './Framer.svelte';

// import { breaks } from '../../chaining/chains.js'
import { units, delays } from '../../stores.js'

function addUnit(){
    const max = 6;
    if($units.length >= max){
        return;
    }

    const pick = [0,1,2,3,4,5].find(e=>!$units.includes(e));

    if(pick !== undefined){
        units.update(e=>[...e,pick]);
        $delays[pick]=0;
    }
}

</script>

<!-- HTML HERE -->

<button on:click={addUnit}>Add a unit + </button>
<div class='unit-flex' >

{#each $units as uid (uid)}
    <Unit uid={uid} priority={$units.findIndex(e=>e===uid)} ></Unit>
{/each}
</div>

<hr>
<Framer></Framer>





<!-- css STARTS HERE -->
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
    /* margin-top: 12px; */
    /* align-items: center; */
    justify-content: space-around;
}

</style>