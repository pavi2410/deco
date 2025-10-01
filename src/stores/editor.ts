import { persistentAtom } from '@nanostores/persistent'
import { computed } from 'nanostores'

// Example: Persistent console logs state
export const persistConsoleLogs = persistentAtom<boolean>('deco-persist-logs', false, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

// Example: Active file state (could be made persistent if needed)
export const activeFileStore = persistentAtom<string>('deco-active-file', 'script.js', {
  encode: (value) => value,
  decode: (value) => value,
})

// Example: Editor settings that persist
export const editorSettings = persistentAtom<{
  fontSize: number
  tabSize: number
  lineNumbers: boolean
}>(
  'deco-editor-settings',
  {
    fontSize: 14,
    tabSize: 2,
    lineNumbers: true,
  },
  {
    encode: JSON.stringify,
    decode: (str) => {
      try {
        return JSON.parse(str)
      } catch {
        return {
          fontSize: 14,
          tabSize: 2,
          lineNumbers: true,
        }
      }
    },
  }
)

// Computed store example
export const editorFontSizeClass = computed(editorSettings, (settings) => {
  return `text-[${settings.fontSize}px]`
})

// Helper functions
export function setEditorFontSize(size: number) {
  const current = editorSettings.get()
  editorSettings.set({ ...current, fontSize: size })
}

export function setEditorTabSize(size: number) {
  const current = editorSettings.get()
  editorSettings.set({ ...current, tabSize: size })
}

export function toggleLineNumbers() {
  const current = editorSettings.get()
  editorSettings.set({ ...current, lineNumbers: !current.lineNumbers })
}
