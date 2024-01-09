import { createSignal, onMount } from 'solid-js'
import Operator from './components/Operator'
import SaveList from './components/SaveList'
import { SaveRecord } from './types/record'
import { loadBackup } from './util/file'
import './App.css'

function App() {
  const [records, setRecords] = createSignal<SaveRecord[]>([])

  async function refreshRecords() {
    const newRecords = await loadBackup()
    setRecords(newRecords)
  }

  onMount(() => {
    refreshRecords()
  })

  return (
    <div class="container h-screen p-3">
      <Operator refresh={refreshRecords} />
      <SaveList saves={records()} refresh={refreshRecords} />
    </div>
  )
}

export default App
