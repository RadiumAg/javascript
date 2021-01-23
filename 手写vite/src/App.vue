<template>
    {{count}}
    <button @click="addCount">加1</button>
</template>

<script>
export default {
    name:"index",
    data() {
        return {
            count:1
        }
    },
    methods:{
       addCount(){
           this.count++;
       }
    }
}
</script>