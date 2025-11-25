<script setup>
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  category: Object,
});

const emit = defineEmits(["close", "save"]);

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

const findCategoryByIcon = (ic) => {
  for (const key of Object.keys(iconCategories)) {
    if (iconCategories[key].includes(ic)) return key;
  }
  return "other";
};

const localName = ref("");
const localIcon = ref("");
const localColor = ref("#FFE5B4");
const selectedIconCategory = ref("other");

watch(
  () => props.category,
  (cat) => {
    if (!cat) return;
    localName.value = cat.name || "";
    localIcon.value = cat.icon || "";
    localColor.value = cat.color || "#FFE5B4";
    selectedIconCategory.value = findCategoryByIcon(cat.icon);
  },
  { immediate: true }
);

const save = () => {
  if (!props.category) return;
  if (!localName.value.trim()) return;

  emit("save", {
    id: props.category.id,
    name: localName.value.trim(),
    icon: localIcon.value || iconCategories[selectedIconCategory.value][0],
    color: localColor.value,
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
        <p class="text-xl font-semibold">Edit Category</p>
      </div>

      <!-- COLOR PICK -->
      <div class="flex gap-3 justify-center mb-4">
        <div
          v-for="c in colorOptions"
          :key="c"
          class="w-7 h-7 rounded-full border cursor-pointer"
          :style="{ backgroundColor: c }"
          @click="localColor = c"
        ></div>
      </div>

      <input
        v-model="localName"
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
          @click="localIcon = ic"
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
