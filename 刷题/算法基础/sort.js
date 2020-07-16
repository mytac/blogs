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
    // 构造大顶堆
    const buildHeap=(arr)=>{
        for(let i=Math.floor(arr.length/2)-1;i>=0;i-=1){
            heapify(arr,i)
        }
    }

    const heapify=(arr,i)=>{
       let left=i*2+1,right=i*2+2,
       largest=i
       // 注意下面typeof 这行，如果某节点有零会false。。造成包含0的用例测试不过的原因
       if(typeof arr[left]!=='undefined'&&arr[left]>arr[largest]){
           largest=left
       }
       if(typeof arr[right]!=='undefined'&&arr[right]>arr[largest]){
           largest=right
       }

       if(largest!==i){ // 改变了
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
        while(arr.length){
            swap(arr,0,arr.length-1)
            const item=arr.pop()
            res.push(item)
            heapify(arr,0)
        }
        return res
    }

    return sort(myArr)
}

const arr1=[1,2,3,4,5]
const arr=[1,2,3,-99,2,1,0]
//heapSort(arr)
console.log(heapSort(arr))
/* console.log(arr) */