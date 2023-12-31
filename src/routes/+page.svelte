<script lang="ts">
import Unit from './Unit.svelte';
import Framer from './Framer.svelte';

// import { breaks } from '$lib/chaining/chains.js'

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

let showHelp = false;

</script>


<div class={`help ${showHelp ? 'visible' : ''}`}>
    <button class='exit' on:click={()=>{showHelp = !showHelp}}>X</button>
    <p>
        You can add up to 6 units. 
        To remove a unit click the [X] button on the unit card.
    </p>
    <p>
        You can add up to 5 casts for each unit using the [+] button 
        and remove a cast with the [-] button. 
        Ticking the associated checkbox makes an ability TAG, i.e. allow self-chaining.
    </p>
    <p>
        Custom frames accept two formats, comma (,) and dash(-) seperated.
        The comma format is used to input the absolute frames for an ability, while
        the dash seperated one is used for relative frames e.g.
    </p>
    
        <ul>
            <li>
                BS: "42,48,54,60,66,72,78,84,90"
            </li>
            <li>
                BS: "42-6-6-6-6-6-6-6-6"
            </li>
        </ul>
    
    <p>
        The selected skills can be seen at the bottom, 
        each cast is represented with a different colour.
        Breaks get red-ish stripes on them. 
        The unit order on the grid is from left to right, 
        like this 1&rightarrow;2&rightarrow;3 etc based on priority.
    </p>
    <p>
        You can long press on a unit's frames on the grid 
        to unlock them and make them movable. 
        If you long press again they lock.
    </p>
    <p>
        There's a vertical (sorry) infobar that displays
        how many breaks there are and when each unit is fired off
        in absolute frames based on priority.
    </p>
    <p>
        Play around for more, I'm not good at explaining.
    </p>
</div>


<div class={`wrapper ${showHelp ? 'unclick' : ''}`}>
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
    border: 1px solid gray;
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
    max-width:850px;
    margin: 0 auto;
}

.flex-h{
    display:flex;
    margin-bottom: 5px;
}

.help{
    display: none;
    position: fixed;
    top:50%;
    left:50%;
    max-width: calc(0.8*850px);
    width:80%;
    height:80%;
    overflow-y: auto;
    background-color: rgba(241, 241, 241, 0.95);
    z-index: 10;
    transform: translate(10%,10%);
    /* border: 2px solid gray; */
    box-shadow: black 0px 0px 9px;
    transform: translate(-50%,-50%);
}

.visible{
    display:block;
}

.unclick{
    pointer-events: none;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.help .exit{
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
    background-color: rgba(255, 255, 255, 0.85);
    text-align: center;
}

.help p{
    width: 80%;
    margin:1.5em auto;
}
.help ul{
    width: 80%;
    margin:1.5em auto;
}

.help p:first-of-type{
    margin-top: 12%;
}

:global(*){
    font-family: sans-serif;
}
</style>