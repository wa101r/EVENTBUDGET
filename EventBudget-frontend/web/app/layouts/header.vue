<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const isOpen = ref(false)
const toggleMenu = () => (isOpen.value = !isOpen.value)

const route = useRoute()

// ใช้เช็คว่าเมนูไหนกำลัง active อยู่
const isActive = (path) => route.path.startsWith(path)
</script>

<template>
  <div class="min-h-screen bg-[#f5f7fb]">
    <!-- HEADER -->
    <header
      class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-[0_8px_24px_rgba(16,36,94,0.06)] 
             flex items-center justify-between px-6 py-4"
    >
      <div class="flex items-center gap-6">
        <!-- Hamburger Left -->
        <button
          @click="toggleMenu"
          class="w-10 h-10 rounded-full border border-[#ffd2b2] bg-[#fff6f1] flex flex-col 
                 items-center justify-center gap-[5px] shrink-0"
        >
          <span class="w-4 h-[2px] rounded-full bg-[#ff7a3c]"></span>
          <span class="w-4 h-[2px] rounded-full bg-[#ff7a3c]"></span>
          <span class="w-4 h-[2px] rounded-full bg-[#ff7a3c]"></span>
        </button>

        <!-- Brand -->
        <div class="flex flex-col border-l-4 border-[#ff7a3c] pl-3">
          <span class="text-[11px] tracking-widest text-gray-500 font-semibold">
            DINSOR ADVERTISING
          </span>
          <span class="text-[12px] text-gray-400">
            Event Management
          </span>
        </div>

        <!-- Page Title -->
        <h1 class="text-xl font-semibold text-[#222b45] ml-4">
          {{ route.meta.title }}
        </h1>
      </div>
    </header>

    <!-- SIDEBAR -->
    <aside
      :class="[
        'fixed top-0 left-0 w-72 h-full bg-white shadow-xl border-r border-gray-200 transition-all duration-300 z-[999] p-6',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex justify-between items-center mb-10">
        <h2 class="text-xl font-semibold text-[#1b2436]">EventBudget</h2>
        <button @click="toggleMenu" class="text-gray-400 text-xl">✕</button>
      </div>

      <nav class="flex flex-col gap-4">
        <!-- Event Management -->
        <NuxtLink
          to="/event-manage/eventname"
          :class="[
            'px-4 py-2 rounded-full transition',
            isActive('/event-manage')
              ? 'bg-[#fff3eb] text-[#ff7a3c]'
              : 'text-gray-500 hover:bg-[#fff3eb] hover:text-[#ff7a3c]'
          ]"
        >
          Event Management
        </NuxtLink>

        <!-- Expense Categories -->
        <NuxtLink
          to="/expense-cate"
          :class="[
            'px-4 py-2 rounded-full transition',
            isActive('/expense-cate')
              ? 'bg-[#fff3eb] text-[#ff7a3c]'
              : 'text-gray-500 hover:bg-[#fff3eb] hover:text-[#ff7a3c]'
          ]"
        >
          Expense Categories
        </NuxtLink>

        <!-- Currency Management -->
        <NuxtLink
          to="/currency-manage"
          :class="[
            'px-4 py-2 rounded-full transition',
            isActive('/currency-manage')
              ? 'bg-[#fff3eb] text-[#ff7a3c]'
              : 'text-gray-500 hover:bg-[#fff3eb] hover:text-[#ff7a3c]'
          ]"
        >
          Currency Management
        </NuxtLink>

        <!-- Team Management -->
        <NuxtLink
          to="/team-manage"
          :class="[
            'px-4 py-2 rounded-full transition',
            isActive('/team-manage')
              ? 'bg-[#fff3eb] text-[#ff7a3c]'
              : 'text-gray-500 hover:bg-[#fff3eb] hover:text-[#ff7a3c]'
          ]"
        >
          Team Management
        </NuxtLink>

        <!-- General Settings -->
        <NuxtLink
          to="/general-setting"
          :class="[
            'px-4 py-2 rounded-full transition',
            isActive('/general-setting')
              ? 'bg-[#fff3eb] text-[#ff7a3c]'
              : 'text-gray-500 hover:bg-[#fff3eb] hover:text-[#ff7a3c]'
          ]"
        >
          General Settings
        </NuxtLink>
      </nav>
    </aside>

    <!-- CONTENT -->
    <main class="px-6 py-6">
      <slot />
    </main>
  </div>
</template>
