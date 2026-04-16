
<template>
  <div class="rounded-xl bg-white p-4 overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
      <thead class="bg-blue-100 sticky top-0 z-10">
        <tr>
          <th
            v-for="header in headers"
            :key="header.value"
            :class="[
              'px-3 py-2 font-semibold align-middle',
              header.center ? 'text-center' : 'text-left',
              header.color ? header.color : 'text-blue-700'
            ]"
          >
            {{ header.text }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <template v-if="items && items.length">
          <tr v-for="(item, rowIndex) in items" :key="rowIndex" class="align-middle bg-white">
            <td
              v-for="header in headers"
              :key="header.value"
              :class="[
                'px-3 py-2 text-sm align-middle !text-black',
                header.center ? 'text-center' : (header.right ? 'text-right' : 'text-left')
              ]"
              style="color: #000 !important;"
            >
              <slot :name="header.value" :item="item" :index="rowIndex">
                {{ item[header.value] }}
              </slot>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td :colspan="headers.length" class="text-center py-8">
              <slot name="empty">
                <span class="text-gray-400">Tidak ada data</span>
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: Array, // [{ text: 'Nama', value: 'nama' }, ...]
  items: Array
})
</script>