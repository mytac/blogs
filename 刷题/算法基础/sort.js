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

const heapSort=(myArr)=>{
    let len;
    // 构造大顶堆
    const buildHeap=(arr)=>{
        len=arr.length
        for(let i=Math.floor(len/2)-1;i>=0;i--){
            heapify(arr,i)
        }
    }

    const heapify=(arr,i)=>{
       let left=i*2+1,right=i*2+2,
       largest=i
       if(arr[left]&&arr[left]>arr[largest]){
           largest=left
       }
       if(arr[right]&&arr[right]>arr[largest]){
           largest=right
       }

       if(largest!==i){
           swap(arr,largest,i)
           heapify(arr,largest)
       }

    }

    const swap=(arr,a,b)=>{
       const temp=arr[a]
       arr[a]=arr[b]
       arr[b]=temp
    }

    const sort=(arr)=>{
        const res=[]
        buildHeap(arr)
        console.log('build init',arr)
        while(arr.length){
            swap(arr,0,arr.length-1)
            res.push(arr.pop())
            heapify(arr,0)
        }
        return res
    }

    return sort(myArr)
}


const arr=[1,2,3,-99,2,1,0]
//heapSort(arr)
console.log(heapSort(arr))
/* console.log(arr) */