let timer: number | null = null

export function startTimer(fn: Function, interval = 5 * 60) {
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
