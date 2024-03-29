import { App, Component, h, inject, InjectionKey, Ref, render, shallowRef, triggerRef } from 'vue'

import ToastContainer from './components/ToastContainer.vue'
import Timer from './timer'

/**
 * Available toast positions.
 */
export type ToastPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'

/**
 * Available toast types.
 */
export type ToastType = 'error' | 'info' | 'success' | 'warn'

/**
 * Options to configure a {@link Toast}.
 */
export interface ToastOptions {
  /**
   * Close the toast when it is clicked. Defaults to `true`.
   */
  closeOnClick: boolean

  /**
   * Custom Vue component to use instead of the default one.
   *
   * This component will receive a {@link StoredToast} as a `toast` prop.
   */
  component?: Component | string

  /**
   * Toast duration in milliseconds. Defaults to `3000` (3 seconds).
   */
  duration: number

  /**
   * Hide the close button. Defaults to `false`
   */
  hideCloseButton: boolean

  /**
   * Hide the progress bar. Defaults to `false`.
   */
  hideProgress: boolean

  /**
   * Pause delay on toast hover. Defaults to `true`.
   */
  pauseOnHover: boolean

  /**
   * Toast position. Defaults to `bottom`.
   */
  position: ToastPosition
}

/**
 * Options of {@link StoredToast}
 */
interface StoredToastOptions extends ToastOptions {
  /**
   * Toast type. Defaults to `info`.
   */
  type: ToastType
}

/**
 * Toast object.
 */
interface Toast {
  /**
   * Toast message.
   */
  message: string

  /**
   * Toast options.
   */
  options: ToastOptions
}

/**
 * Toast object that can be used in custom Toast components.
 */
export interface StoredToast extends Toast {
  options: StoredToastOptions

  /**
   * Internal timer of the toast.
   */
  timer: Timer

  /**
   * Toast key. Used internally for Vue transitions.
   */
  transitionKey: string
}

/**
 * Options to configure a {@link Toaster} instance.
 */
export interface ToasterOptions extends ToastOptions {
  /**
   * Should the `ToastContainer` be globally mounted or not.
   * It means that it is automatically mounted to the DOM.
   * Defaults to `true`
   */
  globalMount: boolean
}

/**
 * Toaster instance.
 */
export interface Toaster {
  /**
   * Original options object used to create the Toaster.
   */
  readonly options: ToasterOptions

  /**
   * List of active toasts.
   */
  readonly toasts: Ref<StoredToast[]>

  /**
   * Remove a stored toast. Should not be called manually by the user.
   *
   * @param toast - Stored toast to remove
   */
  removeToast(toast: StoredToast): void

  /**
   * Display an error (red) toast
   *
   * @param message - Message to display
   * @param options - Toast options
   */
  error(message: string, options?: Partial<ToastOptions>): void

  /**
   * Display an info (blue) toast.
   *
   * @param message - Message to display
   * @param options - Toast options
   */
  info(message: string, options?: Partial<ToastOptions>): void

  /**
   * Display a success (green) toast.
   *
   * @param message - Message to display
   * @param options - Toast options
   */
  success(message: string, options?: Partial<ToastOptions>): void

  /**
   * Display a warn (orange) toast.
   *
   * @param message - Message to display
   * @param options - Toast options
   */
  warn(message: string, options?: Partial<ToastOptions>): void

  /**
   * Called automatically by `app.use(toaster)`. Should not be called manually by the user.
   *
   * @param app - Application that uses the toaster
   */
  install(app: App): void
}

/**
 * @internal
 */
const toasterKey = Symbol('toaster') as InjectionKey<Toaster>

/**
 * @internal
 */
const defaultOptions: ToasterOptions = {
  closeOnClick: true,
  duration: 3000,
  globalMount: true,
  hideCloseButton: false,
  hideProgress: false,
  pauseOnHover: true,
  position: 'bottom'
}

/**
 * Creates a Toaster instance that can be used by a Vue app.
 *
 * @param options - {@link ToasterOptions}
 */
export function createToaster(options?: Partial<ToasterOptions>): Toaster {
  function removeToast(toast: StoredToast) {
    const i = toaster.toasts.value.indexOf(toast)
    if (i < 0) return
    toaster.toasts.value.splice(i, 1)
    triggerRef(toaster.toasts)
  }

  function show(message: string, type: ToastType, options?: ToastOptions): void {
    const opts: StoredToastOptions = {
      ...toaster.options,
      ...options,
      type
    }
    const toast: StoredToast = {
      message,
      options: opts,
      timer: new Timer(() => removeToast(toast), opts.duration),
      transitionKey: (Math.random() + 1).toString(36).substring(7)
    }
    toaster.toasts.value.push(toast)
    triggerRef(toaster.toasts)
  }

  const toaster: Toaster = {
    options: { ...defaultOptions, ...options },

    toasts: shallowRef([]),

    removeToast,

    error: function (message: string, options?: ToastOptions): void {
      show(message, 'error', options)
    },

    info: function (message: string, options?: ToastOptions): void {
      show(message, 'info', options)
    },

    success: function (message: string, options?: ToastOptions): void {
      show(message, 'success', options)
    },

    warn: function (message: string, options?: ToastOptions): void {
      show(message, 'warn', options)
    },

    install: function (app: App): void {
      const toaster = this
      app.config.globalProperties.$toaster = toaster
      app.provide(toasterKey, toaster)

      if (typeof window !== 'undefined') {
        if (!this.options.globalMount) return

        if (document.querySelector('#toast-container')) return
        const vNode = h(ToastContainer)
        if (app && app._context) {
          vNode.appContext = app._context
        }
        render(vNode, document.body)
      }
    }
  }

  return toaster
}

/**
 * Returns the toaster instance. Equivalent to using `$toaster` inside templates.
 */
export function useToaster(): Toaster {
  return inject(toasterKey)!
}
