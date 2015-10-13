'use strict'

import React from 'react'
import { createRenderer } from 'react-addons-test-utils'

import { onPending, onFulfilled, onRejected } from '..'

export function makePromise () {
  let resolve, reject
  const promise = new Promise((resolve_, reject_) => {
    resolve = resolve_
    reject = reject_
  })

  return { promise, resolve, reject }
}

export function dummy () {
  return <div>dummy</div>
}

export function makeProps (props) {
  return Object.assign({}, {
    [onPending]: dummy,
    [onFulfilled]: dummy,
    [onRejected]: dummy
  }, props)
}

export function render (component) {
  const renderer = createRenderer()
  renderer.render(component)

  return {
    renderer,
    output: renderer.getRenderOutput()
  }
}
