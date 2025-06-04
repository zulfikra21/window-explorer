<script setup>
import { ref, watch } from 'vue'
import { fetcher } from '../utils/network'

const props = defineProps({
  folder: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.root && 
             value.root.id && 
             value.root.name && 
             value.children !== undefined
    }
  },
  selectedFolder: Object,
  expandedFolders: {
    type: Set,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['select', 'toggle', 'loadContents'])

async function selectFolder(folder) {
  
  emit('select', folder)
  try {
    const response = await fetcher(`/folders/${folder.root.id}`, 'GET', null)
    if (response.success) {
      emit('loadContents', response.data)
    }
  } catch (error) {
    console.error('Error loading folder contents:', error)
  }
}
const isLoading = ref(false)
const children = ref(props.folder.children)

watch(() => props.expandedFolders.has(props.folder?.root?.id), async (expanded) => {
  if (expanded && children.value.length === 0) {
    try {
      isLoading.value = true
      const response = await fetcher(`/folders/${props.folder.root.id}`, 'GET', null)
      if (response.success) {
        children.value = response.data
          .filter(item => item.is_folder)
          .map(folder => ({
            root: folder,
            children: []
          }))
      }
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<template>
  <li>
      <div 
        
        class="folder-item flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
        :class="{ 'bg-base-300': selectedFolder?.id === folder?.root?.id }"
        :style="{ paddingLeft: `${depth * 16 + 12}px` }"
        @click.stop="selectFolder(folder)"
      >
        <span 
          v-if="folder?.children?.length" 
          class="mr-2 text-base-content/50 cursor-pointer"
          @click.stop="emit('toggle', folder?.root?.id)"
        >
          {{ expandedFolders.has(folder.root.id) ? '▼' : '▶' }}
        </span>
        <span>{{ folder.root.name }}</span>
      </div>
    <transition name="slide">
      <ul 
        v-if="(children.length || isLoading) && expandedFolders.has(folder?.root?.id)"
        class="pl-2 overflow-hidden"
      >
        <div v-if="isLoading" class="loading-indicator">
          Loading...
        </div>
        <FolderItem
          v-for="child in children"
          :key="child?.root?.id"
          :folder="child"
          :selectedFolder="selectedFolder"
          :expandedFolders="expandedFolders"
          :depth="depth + 1"
          @select="emit('select', $event)"
          @toggle="emit('toggle', $event)"
        />
      </ul>
    </transition>
  </li>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.loading-indicator {
  padding: 8px 16px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-align: center;
}
</style>
