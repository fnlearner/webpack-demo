<template>
  <div id="container">
    <h1>{{ initData }}</h1>
    <ul>
      <li v-for="item in list" :key="item.id">
        {{ item.data }}
      </li>
    </ul>
  </div>
</template>
<style lang="less" scoped>
#container {
  color: red;
}
</style>
<script>
import { findItem } from "@/common/util";
export default {
  data() {
    return {
      initData: "vue has started",
      list: [],
    };
  },
  mounted() {
    this.initList();
  },
  methods: {
    initList() {
      const arr = Array.from({ length: 100 }, (v, index) => {
        return {
          id: index,
          data: index,
        };
      });
      this.list = arr;
    },
    getItem() {
      const arr = Array.from(
        { length: 10 },
        (_,
        (index) => {
          return index + 1;
        })
      );

      const item = findItem(arr, 1);
      console.log(item);
    },
  },
};
</script>
