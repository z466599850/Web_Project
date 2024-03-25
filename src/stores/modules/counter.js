import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('big-counter', () => {
  const count = ref(999)

  const addCount = (newValue) => {
    count.value += newValue
  }
  return {
    count,
    addCount
  }
})
