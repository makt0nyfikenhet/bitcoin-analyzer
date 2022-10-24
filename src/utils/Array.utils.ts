type TSortType = "number" | "object";

interface ISortBy {
  arr: any;
  sortType: TSortType;
  objectKey?: string;
}

class ArrayUtils {
  checkArray(arr: any) {
    return Array.isArray(arr) ? arr : [];
  }
  sortBy({ arr, objectKey, sortType }: ISortBy) {
    return {
      number: arr.sort((a: any, b: any) => a - b),
      object: !objectKey
        ? arr
        : arr.sort((a: any, b: any) => {
            if (a[objectKey] > b[objectKey]) return 1;
            if (a[objectKey] < b[objectKey]) return -1;
            return 0; // a must be equal to b
          }),
    }[sortType];
  }
}

export default ArrayUtils;
