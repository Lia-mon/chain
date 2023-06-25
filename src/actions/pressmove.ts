export function longpress(node :HTMLElement, duration :number) {
	let timer : number;
    let currentX = 0;
    let currentY = 0;

	const handleMousedown = (e : PointerEvent) => {
        // e.preventDefault();
        const initX = e.clientX;
        const initY = e.clientY;
        currentX = initX;
        currentY = initY;


		timer = setTimeout(() => {
            const xClose = Math.abs(initX - currentX) < 5 ;
            const yClose = Math.abs(initY - currentY) < 5 ;

            if(xClose && yClose ){
			    node.dispatchEvent(new CustomEvent('longpress'));
            }
            
		}, duration);
	};
    const handleMove = (e: PointerEvent) =>{

        currentX = e.clientX;
        currentY = e.clientY;
    }
	const handleMouseup = () => {
		clearTimeout(timer);
	};

	node.addEventListener('pointerdown', handleMousedown);
	node.addEventListener('pointermove', handleMove);
	node.addEventListener('pointerup', handleMouseup);

	return {
		update(newDuration : number) {
			duration = newDuration;
		},
		destroy() {
			node.removeEventListener('pointerdown', handleMousedown);
            node.removeEventListener('pointermove', handleMove);
			node.removeEventListener('pointerup', handleMouseup);
		}
	};
}


export function moving(node : HTMLElement, isActive : boolean = false){

    let isMoving : boolean = false;

    let lastY = 0;

    let pixelDiff = 0;

    const handleMousedown = (e:PointerEvent) => {
        lastY = e.pageY;
        isMoving = true;
        node.dispatchEvent(new CustomEvent('moveStart'));
    }

    const handleMousemove = (e: PointerEvent) =>{
        if(isMoving && isActive){
            // console.log(`fired at ${lastY}`);
            e.preventDefault();
            pixelDiff = e.pageY - lastY;
            lastY = e.pageY;
            node.dispatchEvent(new CustomEvent('moving', {detail : {value : pixelDiff}}));
        }
    }

    const handleMouseup = (e:PointerEvent) => {
        if(isMoving){
            lastY = 0;
            isMoving = false;
            node.dispatchEvent(new CustomEvent('moveEnd'));
        }    
    }

    const noDefault = (e : TouchEvent) => {
        if(isActive){
            e.preventDefault()
        }
    };

    node.addEventListener('pointerdown',handleMousedown,{capture : false});
    node.addEventListener('pointermove',handleMousemove,{capture : false});
    node.addEventListener('pointerup',handleMouseup,{capture : false});
    node.addEventListener('touchstart',noDefault);
   
    return {
        update(newActive :boolean) {
            isActive = newActive;
        },

        destroy(){
            node.removeEventListener('pointerdown',handleMousedown);
            node.removeEventListener('pointermove',handleMousemove);
            node.removeEventListener('pointerup',handleMousemove);
            node.removeEventListener('touchstart',noDefault);
       }
    }
}



