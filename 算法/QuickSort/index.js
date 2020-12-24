function quick_sort(s = [], l, r)
{
    if (l < r) {
        let i = l, j = r, x = s[l];
        while (i < j) {
            while (i < j && s[j] >= x) // 从右向左找第一个小于x的数
                j--;
            if (i < j)
                s[i++] = s[j];

            while (i < j && s[i] < x) // 从左向右找第一个大于等于x的数
                i++;
            if (i < j)
                s[j--] = s[i];
        }
        s[i] = x;
        quick_sort(s, l, i - 1); // 递归调用 
        quick_sort(s, i + 1, r);
    }
}
let a = [3,3423,343,4];
quick_sort(a,0,3);
console.log(a);