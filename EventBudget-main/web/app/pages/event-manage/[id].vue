<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="p-6">

    <h1 class="text-3xl font-bold text-green-600">
      Hello World
    </h1>

    <p class="text-gray-700 mt-4">
      Your route ID is: {{ route.params.id }}
    </p>

  </div>
</template>
