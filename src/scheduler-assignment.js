import DefaultScheduler from './default-scheduler'

let scheduler = null

export function setScheduler (customScheduler) {
  scheduler = customScheduler
}

export function getScheduler () {
  if (!scheduler) {
    scheduler = new DefaultScheduler()
  }
  return scheduler
}
