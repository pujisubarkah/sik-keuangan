<!-- filepath: c:\Users\user\Documents\sik-keuangan\components\UI\v-data-table.vue -->
<template>
  <div class="w-full">
    <!-- Table Header with Search -->
    <div class="flex justify-between items-center mb-4" v-if="title || showSearch">
      <h3 class="text-lg font-semibold" v-if="title">{{ title }}</h3>
      <div class="flex items-center gap-2" v-if="showSearch">
        <div class="form-control">
          <input
            v-model="search"
            type="text"
            placeholder="Search..."
            class="input input-bordered input-sm"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.key" class="text-left">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id || item">
            <td v-for="header in headers" :key="header.key">
              <span v-if="header.key === 'actions'">
                <button
                  class="btn btn-ghost btn-xs mr-1"
                  @click="$emit('edit', item)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  class="btn btn-ghost btn-xs text-error"
                  @click="$emit('delete', item)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </span>
              <span v-else>
                {{ getItemValue(item, header.key) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Data State -->
    <div v-if="!loading && filteredItems.length === 0" class="text-center py-8">
      <p class="text-base-content/60 mb-4">No data available</p>
      <button
        class="btn btn-primary"
        @click="$emit('add')"
      >
        Add Item
      </button>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-4" v-if="showPagination && totalPages > 1">
      <div class="btn-group">
        <button
          class="btn btn-sm"
          :class="{ 'btn-disabled': currentPage === 1 }"
          @click="currentPage--"
        >
          «
        </button>
        <button class="btn btn-sm">Page {{ currentPage }} of {{ totalPages }}</button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-disabled': currentPage === totalPages }"
          @click="currentPage++"
        >
          »
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaisyTable',
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    title: {
      type: String,
      default: 'Data Table'
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    }
  },
  emits: ['edit', 'delete', 'add'],
  data() {
    return {
      search: '',
      currentPage: 1
    }
  },
  computed: {
    filteredItems() {
      let filtered = this.items

      if (this.search) {
        filtered = filtered.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(this.search.toLowerCase())
          )
        )
      }

      if (this.showPagination) {
        const start = (this.currentPage - 1) * this.itemsPerPage
        const end = start + this.itemsPerPage
        filtered = filtered.slice(start, end)
      }

      return filtered
    },
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  },
  methods: {
    getItemValue(item, key) {
      return item[key] || ''
    }
  },
  watch: {
    search() {
      this.currentPage = 1
    }
  }
}
</script>