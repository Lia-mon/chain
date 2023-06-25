export interface Hit{
    frame : number;
    elements : boolean[];
    unit: number; //display
    cast: number;
    tag: boolean;
}

//or uneccessary
// interface unitCast{
//     frames : number[];
//     elements : boolean[]; //do we want this functionality at all? //or just a chain breaker?
//     unit: number;
//     cast: number;
// }

type unitCast = Hit[];

//expensive to re-order whenever we change? //maybe draw based on other info
//call on secondary thread?
//O(n*logn) - kinda slow? (compared to what seems possible)
//data already has some slight pre-ordering when received use that for a faster thingy
export function ordering(unitCasts : unitCast[]) : Hit[] {
    const unOrdered:Hit[] = [];

    for(const uc of unitCasts){
        unOrdered.push(...uc);
    }

    const compareHits = (h1: Hit, h2: Hit) : number =>{

        if(h1.frame!==h2.frame){
            return h1.frame - h2.frame;
        }

        if(h1.cast!==h2.cast){
            return h1.cast - h2.cast;
        }

        if(h1.unit!==h2.unit){
            return h1.unit - h2.unit;
        }

        return 0;
    }


    return unOrdered.sort(compareHits)
}

export function breaks(unitFrames: Hit[][], 
    count : number,
    delays : number[],
    topDiffs : number[],
    topMax : number) : Hit[]{

    const hits : Hit[] = merger(unitFrames,count,delays,topDiffs,topMax);
    const breaks : Hit[] = [];

    for(let i = 1; i < hits.length ; i++){
        const previous = hits[i-1];
        const current = hits[i];

        if(current.frame - previous.frame > 20){
            breaks.push(current);
        }
        if(current.unit === previous.unit && !current.tag){
            // console.log(current);
            breaks.push(current);
        }
    }

    return breaks;
}

// export function breaks(unitFrames : Hit[][]) : Hit[][]{



//     return [[]];
// }

export function merger(unitFrames: Hit[][], 
    count : number,
    delays : number[],
    topDiffs: number[],
    topMax : number) : Hit[]{

    const merged : Hit[] = [];

    let indexes = Array(count).fill(0);
    let lastIndex : number;
    let lastFrame : number;

    while(indexes.some((e,i)=>e < unitFrames[i].length)){ //scary scary loop :B
        // console.log(`am running ${indexes}`)
        lastIndex = -1;
        lastFrame = Number.MAX_SAFE_INTEGER;
        let currentFrame = -1;

        for(let i = 0 ; i < count ; i++){

            if(indexes[i] >= unitFrames[i].length){
                continue; //go to next 
            }
            currentFrame = unitFrames[i][indexes[i]].frame+delays[i]+topMax-topDiffs[i];
            if( currentFrame < lastFrame){
                lastFrame = currentFrame;
                lastIndex = i;
            }
        }

        if(lastIndex!==-1){

            merged.push({
                frame :currentFrame,
                elements :unitFrames[lastIndex][indexes[lastIndex]].elements,
                unit :unitFrames[lastIndex][indexes[lastIndex]].unit,
                cast :unitFrames[lastIndex][indexes[lastIndex]].cast,
                tag : unitFrames[lastIndex][indexes[lastIndex]].tag
            });
            indexes[lastIndex]++;
        }
    }

    return merged;
}

export type Break = [number,number, string];

export function breakMerge(unitFrames: Hit[][], 
    count : number,
    delays : number[],
    topDiffs: number[]): Break[][]{

    let index : number [] = Array(count).fill(0);
    let frameIndex : number[] = Array(count).fill(0);

    let breaks : Break[][] = Array(count);
    for(let k = 0; k < count ; k++){
        breaks[k] = [];
    }//initialize array like this. Array.fill for objects is bad juju
    
    let unit : number = 0 ;
    let lastUnit : number = 0;
    let carry : number = 0;
    let lastFrame : number = 0;
    
    const groupSize = (unit:number, lastFrame : number) =>{
        let increment = 1;
        while(index[unit]+increment < unitFrames[unit].length){
            const totalIndex = index[unit]+increment;
            const currentFrame = unitFrames[unit][totalIndex].frame + delays[unit] - topDiffs[unit];
            if(currentFrame != lastFrame){
                break;
            }
            increment++;
        }
        return increment;
    }

    const allPairs = (unit:number,increment:number,frame:number)=>{
        let pairs : number[] = [];
        let c = 1;
        for(; c < count ; c++){
            if(increment === groupSize(unit+c % count,frame) ){
                pairs.push(unit+c % count);
            }
        }
        return pairs;
    }

    const smallestPack = (frame:number,size:number)=>{
        let c = 0;
        let u = 1;
        for(; c < count ; c++){
            const cSize = groupSize(unit+c % count,frame);
            if(cSize < size){
                size = cSize;
            }
        }
        return Math.max(size,2);
    }

    const nextUnit = ()=>{
        let frame = Number.MAX_SAFE_INTEGER;
        let unit = 0;

        for(let u = count-1; u >=0 ; u--){ //go backwards to find the highest prio unit
            if(index[u] < unitFrames[u].length){ //this check might be unneeded
                const uFrame = unitFrames[u][index[u]].frame + delays[u] - topDiffs[u];
                if(uFrame <= frame){
                    unit = u;
                    frame = uFrame;
                }
            }
        }

        return unit;
    }

    lastUnit = -1;
    lastFrame = Math.min(...delays) ;

    while(index.some((e,i)=>e < unitFrames[i].length)){ //scary scary loop :B
    
        unit = nextUnit();
        const currentHit = unitFrames[unit][index[unit]];
        const currentFrame = currentHit.frame + delays[unit] - topDiffs[unit];
        //break check here
        if(currentFrame - lastFrame > 20){
            breaks[unit].push([frameIndex[unit],0,'gap more than 20 frames']);
        }

        if(unit === lastUnit && !currentHit.tag){
            breaks[unit].push([frameIndex[unit],0,'same unit in a row']);
        }


        let increment = groupSize(unit, currentFrame);

        if(increment > 1){

            let sizes = [];
            for(let u = 0; u < count ; u++){
                sizes.push(groupSize(u,currentFrame));
            }

            let small = Math.min(...sizes.filter(e=>e>1));

            
            if(sizes.filter(e=>e>=small).length < 2){ //there's an idea where we check for sub-pairs too but ugh that's so annoying really
                for(let k = 1; k < small ; k ++){ //looking for smallest pack let's us rewrite this even better, will do that >_< TODO
                    if(!unitFrames[unit][index[unit]+k].tag){ //5 levels deep :b
                        breaks[unit].push([frameIndex[unit],k,`packed frame without pair`]);
                    }
                }
                index[unit] += small;
                lastUnit = unit;
                frameIndex[unit]++
            }
            else{ 
                for(let u = 0; u < count ; u++){ 
                    const size = sizes[u];
                    if(size===small){
                        frameIndex[u]++;
                    }
                    if(size>=small){
                        index[u]+=small;
                        lastUnit=u;
                        carry=small;
                    }
                }
            }

        }else{
            carry = 0;
            index[unit]++; 
            lastUnit = unit;
            frameIndex[unit]++; //maybe leave this for later
        }   

        //update last frame :D
        lastFrame = currentFrame;
    }

    return breaks;
}
