/***
 * @Description: 
 * @Author: mytac
 * @Date: 2020-07-15 08:34:57
 */
const quickSort=(arr,low,high)=>{
    if(low>=high) return;
    let i=low,j=high,pivot=arr[low]
    while(i<j){
        while(i<j&&arr[j]>pivot) j--
        if(i<j) arr[i++]=arr[j]
        while(i<j&&arr[i]<pivot) i++
        if(i<j) arr[j--]=arr[i]
    }
    arr[i]=pivot
    quickSort(arr,low,i-1)
    quickSort(arr,i+1,high)
}

const bubbleSort=(arr)=>{
    for(let i=0;i<arr.length;i++){
        let j=0
        while(j<arr.length-i){
            if(arr[j]>arr[j+1]){
                const temp=arr[j+1]
                arr[j+1]=arr[j]
                arr[j]=temp
            }
            j++
            console.log(arr)
        }
    }
}


const arr=[8,11,0,8,23,-1,9,8,46]
bubbleSort(arr)
console.log(arr)