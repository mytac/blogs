/***
 * @Description: 
 * @Author: mytac
 * @Date: 2020-07-13 08:22:34
 */
const data=[
    {start:1,len:3,value:5},
    {start:3,len:2,value:1},
    {start:0,len:6,value:8},
    {start:4,len:3,value:4},
    {start:3,len:6,value:6},
    {start:5,len:4,value:3},
    {start:6,len:4,value:2},
    {start:8,len:3,value:4},
]

// 创建prev
const prev={}
data.forEach((d,idx)=>{
    const currentStart=d.start
    let currentPrev=-1
    for(let i=currentStart-1;i>=0;i--){
        const item=data[i]
        if((item.start+item.len)<=currentStart){
            currentPrev=i;
            break;
        }
    }
    prev[idx]=currentPrev
})


console.log('prev',prev)

// OPT[i]=max(data[i].value+prev[i],OPT[i-1])
const opt={}
for(let i=0;i<data.length;i++){
    if(i==0){
        opt[i].value=data[i].value
        opt[i].path=[i]
        continue;
    }
    const val=Math.max(opt[i-1],data[i].value+(prev[i]<0?0:opt[prev[i]].value))
    opt[i].value=
    opt[i].path=[]
}

console.log('opt',opt)