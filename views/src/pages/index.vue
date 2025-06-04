<script setup>
import { ref, onMounted, watch } from 'vue'
import { debounce } from 'lodash-es'
import { fetcher } from '../utils/network'
import FolderItem from '../components/FolderItem.vue'

const folders = ref([])
const isLoading = ref(true)
const error = ref({
  isError: false,
  message: ''
})

onMounted(async () => {
  try {
    const response = await fetcher('/folders', 'GET', null)
    if (response.success) {
      const newFolders = response.data.map(folder => {
        console.log('Processing folder:', folder)
        // Try to find existing folder to preserve its children
        const existing = findFolder(folders.value, folder.id)
        return folder
      })
      folders.value = newFolders
    }
  } catch (error) {
    console.error('Error loading folders:', error)
  } finally {
    isLoading.value = false
  }
})

const selectedFolder = ref(null)
const folderContents = ref([])
const searchQuery = ref('')

const searchFolders = async () => {
  try {
    if(!searchQuery.value.trim()) {
      // If search query is empty, reset folder contents
      const url = `/folders${selectedFolder.value ? `/${selectedFolder.value.id}` : ''}`
      const response = await fetcher(url, 'GET', null)
      if (response.success) {
        folderContents.value = response.data
      }
      return
    }
    const url = `/folders${searchQuery.value ? `?search=${encodeURIComponent(searchQuery.value)}` : ''}`
    const response = await fetcher(url, 'GET', null)
    
    if (response.success) {
      // Convert API response to folder structure format
      folderContents.value = response.data
      error.value.isError = false
    }else {
      error.value.isError = true
      error.value.message =  'Search query contains invalid characters'
    }
  } catch (error) {
    console.error('Error searching folders:', error)
  }
}

// Watch for search query changes with debounce
watch(searchQuery, debounce(searchFolders, 300))

function handleLoadContents(contents) {
  folderContents.value = contents
}
const showCreatePopup = ref(false)
const newFolderName = ref('')
const parentFolderId = ref(null)
const expandedFolders = ref(new Set())

function selectFolder(folder) {
  // console.log("Selecting folder:", folder)
  selectedFolder.value = folder.root
  
  // Automatically expand the folder when selected
  if (!expandedFolders.value.has(folder.root.id)) {
    expandedFolders.value.add(folder.root.id)
  }

  // Load folder contents
  if (folder.children.length > 0) {
    folderContents.value = folder.children.map(child => ({
      root: child.root,
      children: child?.children || []
    }))
  } else {
    folderContents.value = []
  }
}

function toggleFolder(folderId) {
  if (expandedFolders.value.has(folderId)) {
    expandedFolders.value.delete(folderId)
  } else {
    expandedFolders.value.add(folderId)
  }
}

async function createFolder() {
  if (!newFolderName.value.trim()) {
    // alert('Folder name cannot be empty')
    error.value.isError = true
    error.value.message = 'Folder name cannot be empty'
    return
  }
  
  try {
    const response = await fetcher('/folders', 'POST', {
      name: newFolderName.value,
      parentId: parentFolderId.value
    })

    if (response.success) {
      const newFolder = {
        root: response.data,
        children: []
      }

      if (parentFolderId.value) {
        const parent = findFolder(folders.value, parentFolderId.value)
        if (parent) {
          console.log('Adding new folder to parent:', parent)
          parent.children.push(newFolder)
          expandedFolders.value.add(parentFolderId.value)
          folderContents.value = parent.children.map(child => ({
            root: child.root,
            children: child.children || []
          }))
        }
      } else {
        console.log('Adding new folder to root folders:', response.data)
        folders.value.push({
          root: response.data,
          children: []
        })
        // folders.value.push(response.data)
      }

      newFolderName.value = ''
      parentFolderId.value = null
      showCreatePopup.value = false
    }
  } catch (error) {
    console.error('Error creating folder:', error)
  }
}

// findFolder function to search for a folder by ID
function findFolder(folders, id) {
  for (const folder of folders) {
    if (folder.root.id === id) return folder
    if (folder.children.length) {
      const found = findFolder(folder.children, id)
      if (found) return found
    }
  }
  return null
}

function getAllFolders(folders) {
  let all = []
  for (const folder of folders) {
    all.push(folder.root)
    if (folder.children.length) {
      all = all.concat(getAllFolders(folder.children))
    }
  }
  return all
}

function getFolderPath(folder, folders, path = '') {
  for (const f of folders) {
    if (f.root.id === folder.id) return path + f.root.name
    if (f.children.length) {
      const found = getFolderPath(folder, f.children, path + f.root.name + ' > ')
      if (found) return found
    }
  }
  return ''
}
</script>

<template>
  <div class="h-screen bg-base-200">
    <div class="explorer-container grid grid-cols-[280px_1fr] h-full">
      <!-- Left panel -->
      <div class="folder-list bg-base-100 border-r border-base-300 p-4 overflow-y-auto">
        <div class="folder-header flex justify-between items-center mb-6 pb-2 border-b border-base-300">
          <h3 class="text-lg font-semibold">Folders</h3>
          <button 
            id="create-folder-popup"
            class="btn btn-primary btn-sm"
            @click="showCreatePopup = true"
          >
            + Create Folder
          </button>
        </div>
        <div v-if="isLoading" class="loading-indicator">
          <span class="loading loading-spinner loading-md"></span>
          Loading folders...
        </div>
        <div v-else-if="!folders.length" class="empty-state">
          No folders found
        </div>
        <ul v-else class="menu">
          <FolderItem 
            v-for="folder in folders" 
            :key="folder.id"
            :folder="folder"
            :selectedFolder="selectedFolder"
            :expandedFolders="expandedFolders"
            @select="selectFolder"
            @toggle="toggleFolder"
          />
        </ul>
      </div>
      <!-- Right panel -->
      <div class="subdirectory-view bg-base-100 p-6 overflow-y-auto">
        <div v-if="selectedFolder" class="mb-6">
          <div class="flex justify-between items-center pb-2 border-b border-base-300 mb-4">
            <h3 class="text-xl font-semibold">{{ selectedFolder.name }} Contents</h3>
            <button 
              id="create-subdirectory-popup"
              class="btn btn-primary btn-sm"
              @click="showCreatePopup = true; parentFolderId = selectedFolder.id"
            >
              + Create Folder
            </button>
          </div>
          <div class="search-box mb-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search contents..."
              class="input input-bordered w-full"
            />
          </div>
          <div v-if="error.isError" class="error-panel bg-error text-error-content p-4 rounded-lg">
            <span class="text-sm font-semibold">{{ error.message }}</span>
          </div>
        </div>
        <div v-if="selectedFolder" class="contents-grid">
          <div 
            v-for="item in folderContents" 
            :key="item.root.id" 
            class="content-item"
            @click="item.root.is_folder ? selectFolder(item) : null"
            :class="{'cursor-pointer': item.is_folder}"
          >
          <!-- folder content {{ folderContents.length }} {{ folderContents }} -->
            <div v-if="item.root.is_folder" class="folder-item">
              <span>📁</span>
              <span>{{ item.root.name }}</span>
            </div>
            <div v-else class="file-item">
              <span>📄</span>
              <span>{{ item.root.name }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center p-8 text-base-content/70 italic">
          Select a folder to view its contents
        </div>
      </div>
    </div>

    <!-- modal popup -->
    <Teleport to="body">
      <Transition name="popup">
        <div 
          v-if="showCreatePopup" 
          class="modal modal-open"
          @click.self="showCreatePopup = false"
        >
          <div class="modal-box">
            <h3 class="font-bold text-lg mb-6">Create New Folder</h3>
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Parent Folder</span>
              </label>
              <select 
                v-model="parentFolderId"
                class="select select-bordered w-full"
              >
                <option :value="null">(Root Level)</option>
                <option 
                  v-for="folder in getAllFolders(folders)" 
                  :key="folder.id"
                  :value="folder.id"
                >
                  {{ getFolderPath(folder, folders) }}
                </option>
              </select>
            </div>
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text">Folder Name</span>
              </label>
            <input 
              v-model="newFolderName" 
              type="text" 
              placeholder="Folder name"
              class="input input-bordered w-full"
              :class="{'input-error': !newFolderName.trim() || /[^a-zA-Z0-9 _-]/.test(newFolderName)}"
              @keyup.enter="createFolder"
            >
            <div v-if="error.isError" class="alert alert-error mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ error.message }}</span>
            </div>
            </div>
            <div class="modal-action">
              <button class="btn" @click="showCreatePopup = false">Cancel</button>
              <button id="create-folder" class="btn btn-primary" @click="createFolder">Create</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style>
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.contents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.content-item {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: var(--base-100);
  cursor: pointer;
  transition: all 0.2s ease;
}

.content-item:hover {
  background: var(--base-200);
}

.folder-item, .file-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
  color: var(--text-secondary);
}
</style>
