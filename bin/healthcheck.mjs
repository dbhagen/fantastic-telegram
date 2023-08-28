#!/bin/sh
':' //# https://medium.com/@patrickleet ; exec /usr/bin/env node --experimental-modules "$0" "$@"

// import servicebus from 'servicebus-bus-common'
// import { config } from '../config.mjs'

export const exit = ({ healthy = true } = {}) => {
  return healthy ? process.exit(0) : process.exit(1)
}

// export const check = () => {
//   return Promise.all([
//     servicebus.makeBus(config.servicebus)
//   ])
// }

export const handleSuccessfulConnection = (healthcheck) => {
  return () => {
    healthcheck({ healthy: true })
  }
}

export const handleUnsuccessfulConnection = (healthcheck) => {
  return (e) => {
    healthcheck({ healthy: false })
  }
}

check()
  .then(handleSuccessfulConnection(exit))
  .catch(handleUnsuccessfulConnection(exit))
