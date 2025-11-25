export function useCategories() {
  const API = "http://localhost:8000/api/categories";

  const categories = ref([]);

  const loadCategories = async () => {
    categories.value = await $fetch(API);
  };

  const createCategory = async (data) => {
    await $fetch(API, { method: "POST", body: data });
    loadCategories();
  };

  const updateCategory = async (cat) => {
    await $fetch(`${API}/${cat.id}`, {
      method: "PUT",
      body: cat,
    });
    loadCategories();
  };

  const showDeleteConfirm = ref(false);
  const categoryToDelete = ref(null);

  const askDelete = (cat) => {
    categoryToDelete.value = cat;
    showDeleteConfirm.value = true;
  };

  const confirmDelete = () => {
    deleteCategory(categoryToDelete.value.id);
    showDeleteConfirm.value = false;
  };
  const deleteCategory = async (id) => {
    await $fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    loadCategories();
  };

  return {
    categories,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
