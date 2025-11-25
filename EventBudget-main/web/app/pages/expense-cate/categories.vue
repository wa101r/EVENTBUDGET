<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  layout: "header",
  title: "Expense Categories",
});

import { useCategories } from "@/composables/useCategories";
import CategoryCard from "@/components/category/CategoryCard.vue";
import CategoryAddModal from "@/components/category/CategoryAddModal.vue";
import CategoryEditModal from "@/components/category/CategoryEditModal.vue";

const {
  categories,
  loadCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = useCategories();

const search = ref("");
const showAddModal = ref(false);
const showEditModal = ref(false);
const editingCategory = ref(null);

onMounted(loadCategories);

const filteredCategories = computed(() =>
  categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

const openEdit = (cat) => {
  editingCategory.value = { ...cat };
  showEditModal.value = true;
};

const confirmDelete = (cat) => {
  if (!confirm("ต้องการลบหมวดหมู่นี้หรือไม่?")) {
    return;
  }
  deleteCategory(cat.id);
};
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <button class="px-6 py-2 rounded-full bg-[#FFD578] text-white text-lg font-semibold shadow">
        All
      </button>
      <input v-model="search" placeholder="Search categories..."
        class="flex-grow px-5 py-3 bg-[#ededed] rounded-full" />
      <button @click="showAddModal = true" class="w-12 h-12 rounded-full bg-[#F6A441] text-white text-2xl shadow">
        +
      </button>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <CategoryCard v-for="cat in filteredCategories" :key="cat.id" :cat="cat" @edit="openEdit"
        @delete="confirmDelete" />
    </div>
    <CategoryAddModal v-if="showAddModal" @close="showAddModal = false" @save="createCategory" />

    <CategoryEditModal v-if="showEditModal" :category="editingCategory" @close="showEditModal = false"
      @save="updateCategory" />
  </div>
</template>
