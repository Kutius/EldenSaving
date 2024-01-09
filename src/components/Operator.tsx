// import { invoke } from '@tauri-apps/api'
import { createSignal, onMount } from 'solid-js'
import { startTimer, stopTimer } from '../util/timer'
import { saveNow } from '../util/file'

export default function Operator(props: { refresh: () => Promise<void> }) {
  const [note, setNote] = createSignal('')
  const [isAutoSave, setIsAutoSave] = createSignal(Boolean(localStorage.getItem('autoSave')) || false)

  async function submit() {
    await saveNow(note())
    await props.refresh()
  }

  async function autoSave(isSave: boolean) {
    setIsAutoSave(isSave)
    localStorage.setItem('autoSave', String(isSave))
    // await invoke(isSave ? 'resume_timer' : 'pause_timer')
    isSave ? startTimer(saveNow) : stopTimer()
  }

  onMount(() => {
    if (isAutoSave()) {
      startTimer(saveNow)
    }
  })

  return (
    <div w-full>
      <form
        class="row"
        onSubmit={e => {
          e.preventDefault()
          submit()
        }}
      >
        <input
          class="mr-2"
          onChange={e => setNote(e.currentTarget.value)}
          placeholder="输入存档备注"
          aria-autocomplete="none"
        />
        <button type="submit">保存</button>
      </form>

      <div class="w-full flex items-center justify-center mt-4 gap-4">
        <div class="flex items-center">
          <input
            type="checkbox"
            id="vehicle1"
            onChange={e => autoSave(e.currentTarget.checked)}
            checked={isAutoSave()}
          />
          <label for="vehicle1">自动保存</label>
        </div>
      </div>
    </div>
  )
}
