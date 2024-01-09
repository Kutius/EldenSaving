import { invoke, dialog } from '@tauri-apps/api'
import { FileEntry, SaveRecord } from '../types/record'

const GAME_PATH = 'EldenRing'
const RECORD = 'record.json'

export const readGameDir = async () => {
  const appdata = await invoke<string>('read_env', { key: 'APPDATA' })
  const gameDir = `${appdata}\\${GAME_PATH}`
  const dirs = await invoke<FileEntry[]>('read_dir', { path: gameDir }).then(dirs => dirs?.filter(dir => dir.is_dir))
  if (!dirs || dirs.length === 0) {
    await dialog.message('未找到游戏存档')
  }
  const path = dirs.pop()
  return `${gameDir}\\${path?.name}`
}

export const loadBackup = async () => {
  const path = await readGameDir()
  const bakPath = `${path}\\backup`
  const root = await invoke<FileEntry[]>('read_dir', { path })
  if (!root.some(dir => dir.name === 'backup')) {
    await invoke('create_dir', { path: bakPath })
  }
  const baks = await invoke<FileEntry[]>('read_dir', { path: bakPath })
  if (!baks.length) {
    await invoke('write_file', { path: `${bakPath}\\${RECORD}`, contents: '[]' })
    return []
  }
  const record = await invoke<string>('read_file', { file: `${bakPath}\\${RECORD}` })
  return JSON.parse(record || '[]') as SaveRecord[]
}

export const saveNow = async (note: string = '') => {
  const gameDir = await readGameDir()
  const records = await loadBackup()
  const time = new Date()
  const newSave = `ER0000_${time.getTime()}.sl2`
  const record: SaveRecord = {
    note,
    time: time.toLocaleString(),
    name: newSave,
  }
  records.push(record)
  await invoke('write_file', { path: `${gameDir}\\backup\\${RECORD}`, contents: JSON.stringify(records) })

  await invoke('copy_file', { src: `${gameDir}\\ER0000.sl2`, dst: `${gameDir}\\backup\\${newSave}` })
}

export const deleteSave = async (name: string) => {
  const records = await loadBackup()
  const gameDir = await readGameDir()

  const record = records.find(r => r.name === name)
  if (!record) {
    return
  }
  const index = records.indexOf(record)
  records.splice(index, 1)

  await invoke('write_file', { path: `${gameDir}\\backup\\${RECORD}`, contents: JSON.stringify(records) })
  await invoke('remove_file', { path: `${gameDir}\\backup\\${name}` })
}

export const restoreSave = async (name: string) => {
  const gameDir = await readGameDir()
  await invoke('copy_file', { src: `${gameDir}\\backup\\${name}`, dst: `${gameDir}\\ER0000.sl2` })
  await dialog.message('还原成功')
}