'use strict'

import { describe, it } from 'mocha'
import assert from 'power-assert'
import { shouldFulfilled } from 'promise-test-helper'
import React from 'react'

import { makePromise, makeProps, render } from './helper'

import PromiseComponent, {
  onPending, onFulfilled, onRejected
} from '..'

/*
 * @test {PromiseComponent}
 */
describe('PromiseComponent', () => {
  it('should handle promise (pending)', () => {
    const { promise } = makePromise()
    const { promise: test, resolve: testResolve } = makePromise()

    render(<PromiseComponent {...makeProps({
      promise,
      [onPending] () {
        testResolve()
        return <div>dummy</div>
      }
    })} />)

    return shouldFulfilled(test)
  })

  it('should handle promise (fulfilled)', () => {
    const { promise, resolve } = makePromise()
    const { promise: test, resolve: testResolve } = makePromise()
    const ok = Symbol('ok')

    render(<PromiseComponent {...makeProps({
      promise,
      [onFulfilled] (value) {
        testResolve(value)
        return <div>dummy</div>
      }
    })} />)

    resolve(ok)
    return shouldFulfilled(test).then((value) => {
      assert(value === ok)
    })
  })

  it('should handle promise (rejected)', () => {
    const { promise, reject } = makePromise()
    const { promise: test, resolve: testResolve } = makePromise()
    const ok = Symbol('ok')

    render(<PromiseComponent {...makeProps({
      promise,
      [onRejected] (value) {
        testResolve(value)
        return <div>dummy</div>
      }
    })} />)

    reject(ok)
    return shouldFulfilled(test).then((value) => {
      assert(value === ok)
    })
  })

  it('should call `onPending` when `promise` is falsly value (undefined)', () => {
    const { promise: test, resolve: testResolve } = makePromise()

    render(<PromiseComponent {...makeProps({
      promise: undefined,
      [onPending] () {
        testResolve()
        return <div>dummy</div>
      }
    })} />)

    return shouldFulfilled(test)
  })

  it('should call `onPending` when `promise` is falsly value (null)', () => {
    const { promise: test, resolve: testResolve } = makePromise()

    render(<PromiseComponent {...makeProps({
      promise: null,
      [onPending] () {
        testResolve()
        return <div>dummy</div>
      }
    })} />)

    return shouldFulfilled(test)
  })

  it('should not call handlers if component is unmounted', () => {
    const { promise, resolve } = makePromise()

    const { renderer } = render(<PromiseComponent {...makeProps({
      promise,
      [onFulfilled] () {
        assert(false, 'should not be called')
        return <div>dummy</div>
      }
    })} />)

    renderer.unmount()

    resolve()
    return shouldFulfilled(promise.then(() => undefined))
  })
})
