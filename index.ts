function lengthOfLongestSubstring(s: string): number {
    const window = new Map<number, number>();
    let max = 0;
    for (let i = 0; i < s.length; i++) {
        if (window.has(s.charCodeAt(i))) {
            console.log(s)
            if (window.size > max) {
                max = window.size;
            }
            window.clear();
        }
        window.set(s.charCodeAt[i], i);
    }
    return window.size;
};

lengthOfLongestSubstring("abcabcbb")