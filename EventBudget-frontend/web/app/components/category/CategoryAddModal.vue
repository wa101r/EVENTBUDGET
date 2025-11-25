<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

// minimal color/icon meta (ฝังไว้ก่อนให้รันได้)
const colorOptions = [
  "#FFE5B4","#FFD6A5","#FDFFB6","#CAFFBF","#9BF6FF",
  "#A0C4FF","#BDB2FF","#FFC6FF","#FFADAD",
];

const iconCategoryList = [
  { key: "money", label: "Money" },
  { key: "food", label: "Food" },
  { key: "travel", label: "Travel" },
  { key: "work", label: "Work" },
  { key: "other", label: "Other" },
];

const iconCategories = {
  money: ["mdi:cash","mdi:currency-usd","mdi:credit-card"],
  food: ["mdi:food","mdi:coffee","mdi:silverware-fork-knife"],
  travel: ["mdi:airplane","mdi:car","mdi:train"],
  work: ["mdi:briefcase","mdi:account-group","mdi:laptop"],
  other: ["mdi:tag","mdi:shape","mdi:dots-horizontal"],
};

const emit = defineEmits(["close", "save"]);

const name = ref("");
const icon = ref("");
const color = ref("#FFE5B4");
const selectedIconCategory = ref("money");

const save = () => {
  if (!name.value.trim()) return;
  emit("save", {
    name: name.value.trim(),
    icon: icon.value || iconCategories[selectedIconCategory.value][0],
    color: color.value,
  });
  emit("close");
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    @click="$emit('close')"
  >
    <div
      class="bg-white w-full max-w-[420px] rounded-[32px] p-6 shadow-xl relative"
      @click.stop
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-400 text-2xl"
      >
        ✕
      </button>

      <div class="text-center mb-4">
        <p class="text-xl font-semibold">{{ name || "Add Category" }}</p>
      </div>

      <!-- COLOR PICK -->
      <div class="flex gap-3 justify-center mb-4">
        <div
          v-for="c in colorOptions"
          :key="c"
          class="w-7 h-7 rounded-full border cursor-pointer"
          :style="{ backgroundColor: c }"
          @click="color = c"
        ></div>
      </div>

      <input
        v-model="name"
        placeholder="Name"
        class="w-full p-3 mb-3 bg-gray-100 rounded-xl"
      />

      <!-- ICON GROUP -->
      <select
        v-model="selectedIconCategory"
        class="w-full p-3 mb-3 bg-gray-100 rounded-xl"
      >
        <option v-for="cat in iconCategoryList" :key="cat.key" :value="cat.key">
          {{ cat.label }}
        </option>
      </select>

      <!-- ICON LIST -->
      <div class="grid grid-cols-5 gap-3">
        <div
          v-for="ic in iconCategories[selectedIconCategory]"
          :key="ic"
          class="p-3 rounded-xl border cursor-pointer bg-gray-50 hover:bg-gray-100 flex justify-center"
          @click="icon = ic"
        >
          <Icon :icon="ic" class="text-3xl" />
        </div>
      </div>

      <button
        class="w-full py-3 mt-4 bg-[#FF7A1A] text-white rounded-xl"
        @click="save"
      >
        Confirm
      </button>
    </div>
  </div>
</template>
