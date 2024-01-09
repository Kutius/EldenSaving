import { For } from 'solid-js'
import { Icon } from './Icon'
import { SaveRecord } from '../types/record'
import { deleteSave, restoreSave } from '../util/file'

interface SaveListProps {
  saves: SaveRecord[]
  refresh: () => Promise<void>
}

export default function SaveList(props: SaveListProps) {
  const runSave = async (name: string) => {
    await restoreSave(name)
    await props.refresh()
  }

  const removeSave = async (name: string) => {
    await deleteSave(name)
    await props.refresh()
  }
  return (
    <div class="w-full flex-1 mt-10 h-full flex flex-col gap-4 px-4 scrollbar">
      <table class="w-full table-auto">
        <thead>
          <tr>
            <th>备注</th>
            <th>文件名</th>
            <th>时间</th>
            <th></th>
          </tr>
        </thead>
        <tbody text-sm>
          <For each={props.saves}>
            {save => (
              <tr>
                <td py-1>{save.note}</td>
                <td py-1>{save.name}</td>
                <td py-1>{save.time}</td>
                <td py-1>
                  <div class="flex items-center justify-around">
                    <Icon name="i-solar:bolt-broken" title="替换为该存档" onClick={() => runSave(save.name)} />
                    {/* <Icon name="i-solar:folder-with-files-bold" title='打开文件夹' /> */}
                    <Icon name="i-solar:trash-bin-trash-bold" title="删除" onClick={() => removeSave(save.name)} />
                  </div>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  )
}
