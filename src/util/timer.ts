import { AUTO_SAVE_INTERVAL } from '../constants/timer'

let timer: number | null = null

export function startTimer(fn: Function, interval = AUTO_SAVE_INTERVAL) {
  if (timer) {
    return
  }
  timer = setInterval(() => {
    fn()
  }, interval * 1000)
}

export function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
