<script setup>
import { getCurrencyLabel } from "~/shared/currencyMeta";

defineProps({
  modelValue: { type: Boolean, required: true },
  isEditing: { type: Boolean, required: true },
  newEvent: { type: Object, required: true },
  previewFormBudget: { type: String, default: null },
  budgetCurrency: { type: String, required: true },

  isEventCurrencyDropdownOpen: { type: Boolean, required: true },
  eventCurrencyQuery: { type: String, required: true },
  filteredEventCurrencyCodes: { type: Array, required: true },
});

const emit = defineEmits([
  "update:modelValue",
  "save",
  "toggleEventCurrencyDropdown",
  "setEventCurrency",
  "update:eventCurrencyQuery",
  "addTeamMember",
  "removeTeamMember",
]);
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
  >
    <Transition name="fade-scale">
      <div
        v-show="modelValue"
        class="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-200">
          <h2 class="text-xl font-semibold text-slate-900">
            {{ isEditing ? "Edit Event" : "Add New Event" }}
          </h2>

          <button
            @click="emit('update:modelValue', false)"
            class="text-slate-400 hover:text-slate-600 text-2xl leading-none transition-transform hover:rotate-90"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="emit('save')" class="px-6 py-5 overflow-y-auto space-y-5">
          <FormField label="Event Name">
            <input v-model="newEvent.name" class="form-input-light" placeholder="Enter event name" required />
          </FormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Start Date">
              <input v-model="newEvent.start_date" type="date" class="form-input-light" required />
            </FormField>
            <FormField label="End Date">
              <input v-model="newEvent.end_date" type="date" class="form-input-light" required />
            </FormField>
          </div>

          <FormField label="Client">
            <input v-model="newEvent.client_name" class="form-input-light" />
          </FormField>

          <FormField label="Location">
            <input v-model="newEvent.location" class="form-input-light" />
          </FormField>

          <FormField label="Event Currency">
            <div class="event-currency-dropdown relative">
              <button
                type="button"
                @click.stop="emit('toggleEventCurrencyDropdown')"
                class="form-input-light flex items-center justify-between gap-2"
              >
                <span class="truncate">
                  {{ (newEvent.currency_code || 'THB').toUpperCase() }} -
                  {{ getCurrencyLabel(newEvent.currency_code || 'THB') || 'Unknown currency' }}
                </span>
                <Icon name="ph:caret-down-bold" size="14" class="shrink-0" />
              </button>

              <Transition name="fade-scale">
                <div
                  v-if="isEventCurrencyDropdownOpen"
                  class="absolute left-0 right-0 mt-2 z-30 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
                >
                  <div class="p-2 border-b border-slate-100">
                    <input
                      :value="eventCurrencyQuery"
                      @input="emit('update:eventCurrencyQuery', $event.target.value)"
                      type="text"
                      placeholder="Search currency..."
                      class="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div class="max-h-72 overflow-auto py-1">
                    <button
                      v-for="code in filteredEventCurrencyCodes"
                      :key="code"
                      type="button"
                      @click="emit('setEventCurrency', code)"
                      class="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center justify-between gap-2"
                      :class="code === (newEvent.currency_code || 'THB').toUpperCase() ? 'bg-slate-100 font-medium' : ''"
                    >
                      <span class="truncate">
                        {{ code }} - {{ getCurrencyLabel(code) || 'Unknown' }}
                      </span>
                      <Icon
                        v-if="code === (newEvent.currency_code || 'THB').toUpperCase()"
                        name="ph:check-bold"
                        size="12"
                      />
                    </button>

                    <p v-if="filteredEventCurrencyCodes.length === 0" class="px-3 py-3 text-xs text-slate-400">
                      ไม่พบสกุลเงินที่ค้นหา
                    </p>
                  </div>
                </div>
              </Transition>
            </div>
          </FormField>

          <FormField label="Total Budget (ตามสกุล Event)">
            <input v-model="newEvent.total_budget" type="number" min="0" class="form-input-light" required />
            <p class="mt-1 text-[11px] text-slate-500">
              สกุลเงิน: {{ (newEvent.currency_code || "THB").toUpperCase() }}
            </p>
            <p v-if="previewFormBudget" class="mt-0.5 text-[11px] text-slate-500">
              ≈ {{ previewFormBudget }} ({{ budgetCurrency }})
            </p>
          </FormField>

          <FormField label="Description">
            <textarea v-model="newEvent.description" rows="4" class="form-input-light"></textarea>
          </FormField>

          <hr class="border-slate-200 my-4" />
          <h3 class="text-lg font-semibold text-slate-900">Event Details</h3>

          <FormField label="Venue Name">
            <input v-model="newEvent.venue_name" class="form-input-light" />
          </FormField>

          <FormField label="Venue Website/Map URL">
            <input v-model="newEvent.venue_url" class="form-input-light" placeholder="https://..." />
          </FormField>

          <FormField label="Accommodation Name">
            <input v-model="newEvent.accommodation_name" class="form-input-light" />
          </FormField>

          <FormField label="Accommodation Website/Map URL">
            <input v-model="newEvent.accommodation_url" class="form-input-light" placeholder="https://..." />
          </FormField>

          <FormField label="Online Drive URL">
            <input v-model="newEvent.drive_link" class="form-input-light" placeholder="https://..." />
          </FormField>

          <hr class="border-slate-200 my-4" />
          <h3 class="text-lg font-semibold text-slate-900">Team Management</h3>

          <div v-for="(member, index) in newEvent.team" :key="index" class="flex items-center gap-3 mt-3">
            <input v-model="member.name" class="form-input-light" placeholder="Team Member" />
            <button
              type="button"
              @click="emit('removeTeamMember', index)"
              class="text-slate-400 hover:text-red-500 text-xl transition-transform hover:scale-110"
            >
              🗑
            </button>
          </div>

          <button
            type="button"
            @click="emit('addTeamMember')"
            class="mt-3 flex items-center gap-2 border border-orange-300 text-orange-500 px-4 py-2 rounded-lg
                   hover:bg-orange-50 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-150 ease-out"
          >
            <span class="text-xl leading-none">+</span> Add Team Member
          </button>

          <div class="flex justify-end gap-2 pt-6 border-t border-slate-200">
            <button
              type="button"
              @click="emit('update:modelValue', false)"
              class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 hover:-translate-y-0.5 transition-all duration-150 ease-out"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="px-5 py-2 bg-[#F47A27] text-white rounded-lg shadow-sm hover:bg-[#d96b22] hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-150 ease-out"
            >
              {{ isEditing ? "Update" : "Save" }}
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>