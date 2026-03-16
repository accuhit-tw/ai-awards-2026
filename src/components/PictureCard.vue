<template>
  <div
    :style="messageStyle"
    class="w-[228px] rounded-[20px]"
  >
    <img
      :src="productData.imgUrl"
      alt="productImage"
      class="h-[138px] w-full rounded-[20px] object-cover"
    />
    <div class="px-4 pb-2 pt-2 font-noto-sans text-[10px] leading-[1.4] tracking-normal">
      <p class="my-1 font-semibold">{{ productData.title }}</p>
      <div class="my-1 font-semibold">
        <p class="mb-1">售價：{{ thousandSeparatorFormatter(productData.price) }} NT</p>
        <p class="text-[#00B42A]">特價：{{ thousandSeparatorFormatter(productData.specialPrice) }} NT</p>
      </div>
      <p class="my-1 line-clamp-4 overflow-hidden font-normal">
        {{ productData.context }}
      </p>
    </div>
    <div class="flex justify-center border-t border-[#E8E8E8] py-4">
      <a
        :href="productData.button.url"
        target="_blank"
      >
        <p class="text-xs text-[#2F59CC]">{{ productData.button.title }}</p>
      </a>
    </div>
  </div>
</template>

<script setup>
import { thousandSeparatorFormatter } from '@/utils/format/numberFormatter'
defineProps({
  productData: {
    type: Object,
    default: () => ({})
  },
  messageStyle: {
    type: Object,
    default: () => ({})
  }
})
</script>
