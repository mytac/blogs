/***
 * @Description: 
 * @Author: mytac
 * @Date: 2020-07-15 08:34:57
 */
const quickSort = (arr, low, high) => {
    if (low >= high) return;
    let i = low,
        j = high,
        pivot = arr[low]
    while (i < j) {
        while (i < j && arr[j] > pivot) j--
        if (i < j) arr[i++] = arr[j]
        while (i < j && arr[i] < pivot) i++
        if (i < j) arr[j--] = arr[i]
    }
    arr[i] = pivot
    qs(arr, low, i - 1)
    qs(arr, i + 1, high)
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


const ss = (arr) => {
    for (j = 0; j < arr.length; j++) {
        let min = arr[j],
            k = j
        for (let i = j + 1; i < arr.length; i++) {
            if (arr[i] < min) {
                min = arr[i]
                k = i
            }
        }
        const temp = arr[j]
        arr[j] = min
        arr[k] = temp
    }

}

const ms = (arr) => {
    let final = null
    const merge = (myArr) => {
        if (myArr.length < 2) return myArr;
        const midLen = Math.floor(myArr.length / 2)
        const left = merge([...myArr.slice(0, midLen)])
        const right = merge([...myArr.slice(midLen)])
        const res = mergeSort(left, right)
        return res
    }

    const mergeSort = (left, right) => {
        const res = []
        while (left.length && right.length) {
            if (left[0] <= right[0]) {
                res.push(left.shift())
            } else {
                res.push(right.shift())
            }
        }

        while (left.length) {
            res.push(left.shift())
        }
        while (right.length) {
            res.push(right.shift())
        }
        return res
    }
    final = [...merge(arr)]
    return final

}

const is=(arr)=>{
    if(arr.length<2) return arr;
   for(let i=1;i<arr.length;i++){
       let j=i-1;
       const current=arr[i]
       while(j>=0&&current<arr[j]){
           arr[j+1]=arr[j]
           arr[j]=current
            j--;
       }
   }
   return arr
}

const swap=(arr,a,b)=>{
    const temp=arr[a]
    arr[a]=arr[b]
    arr[b]=temp
 }

const hs=(arr)=>{
    
    const gap=Math.floor(arr.length/2)
    for(let i=0;i<gap;i++){
        let j=i;
        while(){

        }
        if(arr[i]<arr[i+gap]){
            swap(arr,i,i+gap)
        }
    }

    
}

const arr = [4, 3, 2, 1]
const arr1 = [1, 2, 3, 45, 6, 999, 100000000, 3]
const arr2=[8,-1,3,0,6,8,0,-5]

console.log(is(arr2))
