'use strict'

/*
 * Dependencies.
 */

import { PropTypes, Component } from 'react'

import { onPending, onFulfilled, onRejected } from './statusConstant'

/**
 * `makeHandlers` makes promise handlers of `component`
 * and function to disable them.
 *
 * @param {PromiseComponent} component - a target component.
 * @return {Object} - it contains handlers and function to disable them.
 */
function makeHandlers (component) {
  return {
    /**
     * disable `onFulfilled` and `onRejected`.
     */
    disable () {
      component = null
    },

    /**
     * handler called by fulfilled.
     *
     * @param {any} value - an value passed by promise.
     */
    onFulfilled (value) {
      if (component) {
        component.onFulfilled(value)
      }
    },

    /**
     * handler called by rejected.
     *
     * @param {any} value - an value passed by promise.
     */
    onRejected (value) {
      if (component) {
        component.onRejected(value)
      }
    }
  }
}

/**
 * Promise wrapper component.
 *
 * @example
 * // use fetch API. it returns Promise instance.
 * // see also https://fetch.spec.whatwg.org/.
 * let request = fetch('https://example.com').then((res) => res.text())
 *
 * render(<PromiseComponent promise={request}
 *   onPending={() => {
 *     return <div>Loading...</div>
 *   }}
 *   onFulfilled={text => {
 *     return <pre>{text}</pre>
 *   }}
 *   onRejected={error => {
 *     return <div>{error.message}</div>
 *   }}
 * />)
 */
export default class PromiseComponent extends Component {
  constructor (props) {
    super(props)
  }

  /*
   * React lifecycle callbacks.
   */

  componentWillMount () {
    let disable = () => undefined
    if (this.props.promise) {
      let onFulfilled, onRejected
      ;({ disable, onFulfilled, onRejected } = makeHandlers(this))
      this.props.promise.then(onFulfilled, onRejected)
    }

    this.state = {
      status: onPending,
      value: null,
      disable
    }
  }

  componentWillUnmount () {
    // release `this` component from `promise` callbacks
    this.state.disable()
  }

  render () {
    return this.props[this.state.status](this.state.value)
  }

  /*
   * Private methods (handlers.)
   *
   * They are called by `makeHandlers`'s handlers.
   */

  /**
   * @private
   */
  onFulfilled (value) {
    this.setState({
      status: onFulfilled,
      disable: this.state.disable,
      value
    })
  }

  /**
   * @private
   */
  onRejected (value) {
    this.setState({
      status: onRejected,
      disable: this.state.disable,
      value
    })
  }
}

/*
 * PropTypes for React component.
 *
 * @see https://facebook.github.io/react/docs/reusable-components.html#prop-validation
 */
PromiseComponent.propTypes = {
  promise: PropTypes.instanceOf(Promise),
  [onPending]: PropTypes.func.isRequired,
  [onFulfilled]: PropTypes.func.isRequired,
  [onRejected]: PropTypes.func.isRequired
}
