public class javaTest {
    public static void main(String[] args){
        // int[] array = {6,23,67,67,32,5,2,65,78,3,52,4,7,8564,524,4,45,6,68,14,235,346,547,568,4,25,23453,4645,756,8,435};
        int[] array = new int[100000000];
        for(int i=0;i<array.length;i++){
            array[i] = (int) Math.random()*(1000000-1)+1;
        }
        sort(array);
        System.out.println("done");
        // for(int i=0;i<array.length;i++){
        //     System.out.println(array[i]);
        // }
    }
    public static void bubble(int arr[]){
        int n = arr.length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - i - 1; j++)
                if (arr[j] > arr[j + 1]) {
                    // swap arr[j+1] and arr[j]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
    }
    public static void heap(int arr[], int n, int i){
        int largest = i;
        int l = 2*i+1;
        int r = 2*i+2;
        if(l<n && arr[l] > arr[largest]){
            largest = l;
        }
        if(r<n && arr[r] > arr[largest]){
            largest = r;
        }
        if(largest != i){
            int hold = arr[i];
            arr[i] = arr[largest];
            arr[largest] = hold;
            heap(arr, n, largest);
        }
    }
    public static void sort(int[] arr){
        int n = arr.length;
        for(int i=n/2-1;i>=0;i--){
            heap(arr, n, i);
        }
        for(int i=n-1;i>0;i--){
            int hold = arr[0];
            arr[0] = arr[i];
            arr[i] = hold;
            heap(arr,i,0);
        }
    }
}