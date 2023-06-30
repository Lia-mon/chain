<script lang="ts">
import type {Hit, Break} from '../chaining/chains.js'
import { longpress, moving} from '../actions/pressmove.js'

export let frames : Array<Hit>;
export let delay :number = 0;
export let topDiff : number = 0;
export let breaks : Break[]  = [];

export let frameSize = 7;

let totalChange = 0 ;
let initDelay = delay;
let activeMove = false;
let oldBreaks :Break[]= [];

let container:HTMLDivElement;

function setHeight(e : HTMLDivElement,height:number){
    if(!e){
        return;
    }
    e.style.minHeight = `${height}px`;
}

function handleMoving(e:CustomEvent){
    const pixelDiff = e.detail.value;

    if(pixelDiff !== undefined){

        totalChange += pixelDiff;
        delay = Math.max(0,initDelay + Math.round(totalChange/frameSize));
    }
}

function handleEnd(e:CustomEvent){
    initDelay = delay;
    totalChange = 0;
}

function handleStart(e:CustomEvent){
    initDelay = delay;
    totalChange = 0;
}

$:if(container){ //draw everything, if I box/group the data before sending them in I can use each blocks, might have less issues too
    const newElements :Array<HTMLElement> = [];
    let clearElements :Array<HTMLElement> = [];
    let count = 0;
    for(const hit of frames){

        const visualFrame = document.createElement('div');
        visualFrame.style.flex = '1';
        visualFrame.style.height = `${frameSize}px`;
        visualFrame.classList.add(`c-${hit.cast}`);
        
        //topDiff normalizes the start as 0 
        //position is relative to themselves, each child appears at count*frameSize initially 
        //correct position is therefore (frame - topDiff - count)*frameSize -> to end up in 'absolute' frame*frameSize
        if(newElements[hit.frame] === undefined){
            const miniContainer = document.createElement('div');
            miniContainer.classList.add(`mini-container`);                      
            miniContainer.style.top = `${(hit.frame-topDiff-count)*frameSize}px` 
            miniContainer.appendChild(visualFrame);

            newElements[hit.frame] = miniContainer;
            count++;

        }else{
            newElements[hit.frame].appendChild(visualFrame);
        }
        
    }
    clearElements = newElements.filter(e=>e!==undefined);
    container?.replaceChildren(...clearElements);
    if(frames.length > 0){
        setHeight(container,frameSize*(frames[frames.length-1].frame-topDiff+2));
    }

    //apply breaks here when adding
    // for(const b of breaks){
    //         console.log(`new error [${b}]`);
    //         container.children[b[0]].children[b[1]].classList.add('break');
    //     }

    oldBreaks = [];
}

$:if(container) container.style.paddingTop = `${delay*frameSize}px`;


$: if(container){
    if(container.children.length > 0 ){

        for(const b of oldBreaks){
            container.children[b[0]].children[b[1]].classList.remove('break');
        }
    
        for(const b of breaks){
            container.children[b[0]].children[b[1]].classList.add('break');
        }
    }
    oldBreaks =  breaks.slice();   
}

</script>

<div class='top'
    class:shadow = {activeMove}
    use:longpress = {1600}
    use:moving = {activeMove} 
    on:longpress = {()=>{activeMove = !activeMove}}
    on:moving ={handleMoving}
    on:moveEnd = {handleEnd}
    on:moveStart = {handleStart}
    bind:this={container}>
</div>


<style>
/* .top{
    border-right: 1px solid black;
    transtion: padding-top 1ms;
}

.top:last-child{
    border-right: none;
} */

.shadow{
    box-shadow: 0 0 3px 0px blue ;
    transition: box-shadow 0.4s;
}

:global(.c-0){
    background-color:#E69F00;
}
:global(.c-1){
    background-color: #56B4E9;
}
:global(.c-2){
    background-color:#009E73;
}
:global(.c-3){
    background-color:#F0E442;
}
:global(.c-4){
    background-color:#0072B2;
}

:global(.break){
    background-image: repeating-linear-gradient(
    to left,
    #CC79A7 0 8px,
    rgba(255, 255, 255, 0) 8px 16px
  );
    /* background-color:#CC79A7; */
}

:global(.mini-container){
    display: flex;
    box-sizing: border-box;
    width: 100%;
    position: relative;
    padding: 0px 2.5px;
}

:global(.mini-container > *){
    border-right:1px solid black;
}

:global(.mini-container > *:last-child){
    border-right:none;
}

</style>