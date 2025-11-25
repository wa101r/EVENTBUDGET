<script setup>
import { ref } from 'vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'

// State สำหรับควบคุมการเปิด/ปิด Sidebar
const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 text-text-primary font-sans">
    
    <header class="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        
        <div class="flex items-center gap-4">
          <button 
            @click="toggleSidebar" 
            class="p-2.5 -ml-2 rounded-xl text-gray-500 hover:text-accent hover:bg-orange-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent/30 active:scale-95"
            title="เปิดเมนู"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
          </button>

          <div class="flex items-center gap-3 select-none">
            <div class="w-9 h-9 bg-gradient-to-br from-accent to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 transform -rotate-3">
              <span class="font-bold text-lg">EB</span>
            </div>
            <h1 class="text-xl font-extrabold tracking-tight text-gray-900">
              <slot name="header-title">
                Event<span class="text-accent">Budget</span>
              </slot>
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-4">
          
          <button class="hidden sm:flex items-center justify-center p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          <button class="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span class="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

         

        </div>

      </div>
    </header>

    <main class="relative z-10 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <slot />
    </main>

    <AppSidebar :isOpen="isSidebarOpen" @close="toggleSidebar" />
    <slot name="fab" />
    
  </div>
</template>