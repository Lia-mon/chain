// @ts-ignore
export function stretch(node,{
    delay = 0,
    duration = 400
}){
    const h = getComputedStyle(node).height;
    const hval = Number(h.match(/\d+/)) ;

    const m = getComputedStyle(node).marginTop;
    const mval = Number(m.match(/\d+/)) ;
    let o = 1;
    return {
        delay,
        duration,
        // @ts-ignore
        // @ts-ignore
        css: (t,u) => {
            let basic = `height: ${t*hval}px; 
                        margin-top : ${t*mval}px;`

            return basic + `opacity : ${t*o}`;
        }
    }
}

// @ts-ignore
export function hstretch(node,{
    delay = 0,
    duration = 400
}){
    const w = getComputedStyle(node).width;
    const wval = Number(w.match(/\d+/)) ;

    const mL = getComputedStyle(node).marginLeft;
    const mvalL = Number(mL.match(/\d+/)) ;

    const mR = getComputedStyle(node).marginRight;
    const mvalR = Number(mR.match(/\d+/)) ;
    return {
        delay,
        duration,
        // @ts-ignore
        css: (t,u) => {
            let basic = `max-width: ${t*wval}px;` 
            return basic;
        }
    }
}

// margin-left : ${t*mvalL}px;
// margin-right : ${t*mvalR}px;`