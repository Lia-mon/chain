function sequence(start: number ,step :number,count :number):number[]{
    const frames : number[] = [];
    for(let i = 0; i < count ; i++){
        frames.push(start+step*i)
    }
    return frames;
}

export const chains =[
    {name : "BS" , value : sequence(42,6,9)},
    {name : "AMoE", value : sequence(70,6,8)},
    {name : "CWA", value : sequence(42,20,8)},
    {name : "Extreme Nova", value : sequence(60,5,30)},
    {name : "SR", value : sequence(110,10,10)},
    {name : "AR", value : sequence(45,4,30)},
    {name : "3 x BS (var 2)" , value : [42,48,54,60,66,72,78,84,90,95,101,107,113,119,125,131,137,143,148,154,160,166,172,178,184,190,196]},
    {name : "3 x AMoE" , value : [70,76,82,88,94,100,106,112,123,129,135,141,147,153,159,165,176,182,188,194,200,206,212,218]},
    {name : "old 3 x BS (var 1)", value :[42,48,54,60,66,72,78,84,90,96,102,108,114,120,126,132,138,144,150,156,162,168,174,180,186,192,198]},
    {name : "Mystic Breath", value :[42,  50,  58,  66,  74,  82,  90,  98,  106,  114,  122,  130,  138,  146,  154,  162]}
    // {name : "LB 3 x AmoE", value : [58,64,70,76,82,88,94,100,111,117,123,129,135,141,147,153,164,170,176,182,188,194,200,206]}
]