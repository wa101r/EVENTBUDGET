<script setup>
import { ref, onMounted } from "vue";
import UiCard from "~/components/ui/UiCard.vue";
import UiButton from "~/components/ui/UiButton.vue";
import UiInput from "~/components/ui/UiInput.vue";
import EventFabButton from "~/components/event/EventFabButton.vue";
import { useSettingsApi } from "~/composables/useSettingsApi";

definePageMeta({
  layout: "header",
  title: "Team Management",
});

// API
const {
  teamMembers,
  loadTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = useSettingsApi();

const isModalOpen = ref(false);
const isEditing = ref(false);
const loading = ref(true);

// FORM DATA
const form = ref({
  id: null,
  personalname: "",
  given_name: "",
  surname: "",
  given_name_th: "",
  surname_th: "",
  passport_no: "",
  nationality: "",
  dob: "",
  sex: "",
  date_issue: "",
  date_expiry: "",
  personal_no: "",
  issuing_authority: "",
  passport_image: "",
  profile_image: "",
});

// IMAGE PREVIEW
const passportPreview = ref(null);
const profilePreview = ref(null);

// =====================================
// LOAD LIST
// =====================================
onMounted(async () => {
  await loadTeamMembers();
  loading.value = false;
});

// RESET FORM
const resetForm = () => {
  Object.assign(form.value, {
    id: null,
    personalname: "",
    given_name: "",
    surname: "",
    given_name_th: "",
    surname_th: "",
    passport_no: "",
    nationality: "",
    dob: "",
    sex: "",
    date_issue: "",
    date_expiry: "",
    personal_no: "",
    issuing_authority: "",
    passport_image: "",
    profile_image: "",
  });

  passportPreview.value = null;
  profilePreview.value = null;
};

// Convert file to Base64
const toBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

// Passport Upload
const onPassportSelected = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  passportPreview.value = URL.createObjectURL(file);
  form.value.passport_image = await toBase64(file);
};

// Profile Upload
const onProfileSelected = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  profilePreview.value = URL.createObjectURL(file);
  form.value.profile_image = await toBase64(file);
};

// SAVE (Create / Update)
const handleSave = async () => {
  const payload = { ...form.value };

  if (isEditing.value) {
    await updateTeamMember(form.value.id, payload);
  } else {
    await createTeamMember(payload);
  }

  isModalOpen.value = false;
  await loadTeamMembers();
};

// DELETE TEAM MEMBER
const handleDelete = (item) => {
  if (confirm(`ต้องการลบ "${item.personalname || item.given_name}" ?`)) {
    deleteTeamMember(item.id);
  }
};

// OPEN EDIT
const openEdit = (item) => {
  isEditing.value = true;
  form.value = { ...item };

  passportPreview.value = item.passport_image
    ? `http://localhost:8000/storage/${item.passport_image}`
    : null;

  profilePreview.value = item.profile_image
    ? `http://localhost:8000/storage/${item.profile_image}`
    : null;

  isModalOpen.value = true;
};

// OPEN CREATE
const openCreate = () => {
  isEditing.value = false;
  resetForm();
  isModalOpen.value = true;
};
</script>

<template>
  <div class="p-6 space-y-4 max-w-4xl">
    <!-- LOADING -->
    <div v-if="loading" class="text-center text-gray-500 py-10">
      กำลังโหลดข้อมูลทีม...
    </div>

    <!-- TEAM LIST -->
    <div v-else class="space-y-3">
      <UiCard
        v-for="m in teamMembers"
        :key="m.id"
        class="flex justify-between items-center hover:shadow-md transition p-4"
      >
        <div class="flex items-center gap-4">
          <!-- AVATAR (รูปจริง หรือ ตัวอักษร) -->
          <div>
            <img
              v-if="m.profile_image"
              :src="`http://localhost:8000/storage/${m.profile_image}`"
              class="w-10 h-10 rounded-full object-cover"
            />

            <div
              v-else
              class="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg"
            >
              {{ (m.personalname || m.given_name || m.surname || "?")[0] }}
            </div>
          </div>

          <div>
            <NuxtLink
              :to="`/team-manage/${m.id}`"
              class="font-semibold text-text-primary text-lg hover:text-accent"
            >
              {{ m.personalname || m.given_name + " " + m.surname }}
            </NuxtLink>

            <p class="text-xs text-gray-400">
              Passport: {{ m.passport_no || "-" }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <UiButton variant="secondary" @click="openEdit(m)">แก้ไข</UiButton>
          <UiButton variant="danger" @click="handleDelete(m)">ลบ</UiButton>
        </div>
      </UiCard>
    </div>

    <!-- Floating Button -->
    <EventFabButton @click="openCreate" class="fixed bottom-8 right-8" />

    <!-- MODAL -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-start justify-center pt-16 p-4 overflow-y-auto"
    >
      <div
        class="w-full max-w-2xl bg-[#0f172a] text-white rounded-2xl shadow-xl p-6 space-y-6 animate-fadeIn"
      >
        <!-- Header -->
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">
            {{ isEditing ? "Edit Team Member" : "Add Team Member" }}
          </h2>
          <button @click="isModalOpen = false" class="text-gray-400 text-xl">
            ✕
          </button>
        </div>

        <!-- PROFILE UPLOAD -->
        <div class="space-y-2">
          <p class="text-sm text-gray-300">Profile Photo</p>

          <label
            class="bg-green-600 px-4 py-2 rounded cursor-pointer inline-flex items-center gap-2"
          >
            📷 Upload Profile
            <input
              type="file"
              accept="image/*"
              @change="onProfileSelected"
              class="hidden"
            />
          </label>

          <img
            v-if="profilePreview"
            :src="profilePreview"
            class="w-24 h-24 rounded-lg object-cover"
          />
        </div>

        <!-- PASSPORT UPLOAD -->
        <div
          class="border border-gray-700 rounded-xl p-6 text-center space-y-3 bg-[#1e293b]"
        >
          <h3 class="text-lg font-semibold">Scan Passport with AI</h3>

          <label
            class="cursor-pointer bg-blue-500 px-4 py-2 rounded inline-flex items-center gap-2"
          >
            📤 Upload Passport Photo
            <input
              type="file"
              accept="image/*"
              @change="onPassportSelected"
              class="hidden"
            />
          </label>

          <img
            v-if="passportPreview"
            :src="passportPreview"
            class="mx-auto mt-3 w-40 rounded shadow object-cover"
          />
        </div>

        <!-- Display Name -->
        <UiInput v-model="form.personalname" label="Display Name" />

        <!-- PASSPORT DETAILS -->
        <div
          class="border border-gray-700 rounded-xl p-4 bg-[#1e293b] space-y-4"
        >
          <h3 class="text-lg font-semibold">Passport Details</h3>

          <div class="grid grid-cols-2 gap-3">
            <UiInput v-model="form.given_name" label="Given Name" />
            <UiInput v-model="form.surname" label="Surname" />

            <UiInput v-model="form.given_name_th" label="Given Name (TH)" />
            <UiInput v-model="form.surname_th" label="Surname (TH)" />

            <UiInput v-model="form.passport_no" label="Passport No." />
            <UiInput v-model="form.nationality" label="Nationality" />

            <UiInput type="date" v-model="form.dob" label="Date of Birth" />
            <UiInput v-model="form.sex" label="Sex" />

            <UiInput
              type="date"
              v-model="form.date_issue"
              label="Date of Issue"
            />
            <UiInput
              type="date"
              v-model="form.date_expiry"
              label="Date of Expiry"
            />

            <UiInput v-model="form.personal_no" label="Personal No." />
            <UiInput
              v-model="form.issuing_authority"
              label="Issuing Authority"
            />
          </div>
        </div>

        <!-- SAVE BUTTONS -->
        <div class="flex justify-end gap-3 pt-2">
          <UiButton variant="secondary" @click="isModalOpen = false"
            >Cancel</UiButton
          >
          <UiButton variant="primary" @click="handleSave">Save</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
</style>
