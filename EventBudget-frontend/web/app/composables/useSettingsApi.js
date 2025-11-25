import { ref } from "vue";

export const useSettingsApi = () => {
  const API = "http://localhost:8000/api";

  // ==============================
  // TEAM MEMBERS
  // ==============================
  const teamMembers = ref([]);

  const loadTeamMembers = async () => {
    teamMembers.value = await $fetch(`${API}/team-members`);
  };

  const getTeamMember = async (id) => {
    return await $fetch(`${API}/team-members/${id}`);
  };

  const createTeamMember = async (data) => {
    return await $fetch(`${API}/team-members`, {
      method: "POST",
      body: data,
    });
  };

  const updateTeamMember = async (id, data) => {
    return await $fetch(`${API}/team-members/${id}`, {
      method: "PUT",
      body: data,
    });
  };

  const deleteTeamMember = async (id) => {
    return await $fetch(`${API}/team-members/${id}`, {
      method: "DELETE",
    });
  };

  // ==============================
  // CATEGORIES
  // ==============================
  const categories = ref([]);

  const loadCategories = async () => {
    categories.value = await $fetch(`${API}/categories`);
  };

  const createCategory = async (data) => {
    return await $fetch(`${API}/categories`, {
      method: "POST",
      body: data,
    });
  };

  const updateCategory = async (id, data) => {
    return await $fetch(`${API}/categories/${id}`, {
      method: "PUT",
      body: data,
    });
  };

  const deleteCategory = async (id) => {
    return await $fetch(`${API}/categories/${id}`, {
      method: "DELETE",
    });
  };

  // ==============================
  // CURRENCIES
  // ==============================
  const currencies = ref([]);

  const loadCurrencies = async () => {
    currencies.value = await $fetch(`${API}/currencies`);
  };

  const createCurrency = async (data) => {
    return await $fetch(`${API}/currencies`, {
      method: "POST",
      body: data,
    });
  };

  const updateCurrency = async (id, data) => {
    return await $fetch(`${API}/currencies/${id}`, {
      method: "PUT",
      body: data,
    });
  };

  const deleteCurrency = async (id) => {
    return await $fetch(`${API}/currencies/${id}`, {
      method: "DELETE",
    });
  };

  // ==============================
  // RETURN EXPORT — อยู่นี่!
  // ==============================
  return {
    // Team
    teamMembers,
    loadTeamMembers,
    getTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,

    // Categories
    categories,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,

    // Currencies
    currencies,
    loadCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
  };
};
