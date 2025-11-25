<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useSettingsApi } from "~/composables/useSettingsApi";

definePageMeta({
  layout: "header",
  title: "Team Management",
});

const route = useRoute();
const { getTeamMember } = useSettingsApi();

const loading = ref(true);
const member = ref(null);

onMounted(async () => {
  const id = route.params.id;
  member.value = await getTeamMember(id);
  loading.value = false;
});
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">

    <div v-if="loading" class="text-center text-gray-500 py-10">
      กำลังโหลดข้อมูล...
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold mb-4">
        {{ member.personalname || member.given_name + ' ' + member.surname }}
      </h1>

      <!-- รูปโปรไฟล์ -->
      <div v-if="member.profile_image" class="mb-4">
        <img 
          :src="`http://localhost:8000/storage/${member.profile_image}`"
          class="w-40 h-40 object-cover rounded-lg shadow"
        />
      </div>

      <!-- รายละเอียด -->
      <div class="space-y-2 text-lg">

        <p><b>Full Name:</b> {{ member.given_name }} {{ member.surname }}</p>
        <p><b>Name (Thai):</b> {{ member.given_name_th }} {{ member.surname_th }}</p>
        <p><b>Passport No.:</b> {{ member.passport_no }}</p>
        <p><b>Nationality:</b> {{ member.nationality }}</p>

        <p><b>DOB:</b> {{ member.dob }}</p>
        <p><b>Sex:</b> {{ member.sex }}</p>

        <p><b>Date Issue:</b> {{ member.date_issue }}</p>
        <p><b>Date Expiry:</b> {{ member.date_expiry }}</p>

        <p><b>Personal No.:</b> {{ member.personal_no }}</p>
        <p><b>Issuing Authority:</b> {{ member.issuing_authority }}</p>

      </div>

      <div class="mt-6">
        <NuxtLink to="/team-manage">
          <button class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
            ◀ กลับไปรายการทีม
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
