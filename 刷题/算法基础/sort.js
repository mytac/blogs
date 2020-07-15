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


const arr=[8,11,0,8,23,46]
quickSort(arr,0,arr.length-1)
console.log(arr)