<script setup lang="ts">
import { ref } from 'vue'

import { ToastOptions, ToastType, useToaster } from '../packages/toaster/src/index'
import CustomToast from './components/CustomToast.vue';
import NestedComponent from './components/NestedComponent.vue'

const toaster = useToaster()

const msg = ref('Trigger me!')
const type = ref<ToastType>('info')
const options = ref<Partial<ToastOptions>>({
  closeOnClick: true,
  duration: 3000,
  hideCloseButton: false,
  hideProgress: false,
  pauseOnHover: true,
  position: 'bottom',
})

function trigger() {
  toaster[type.value](msg.value, options.value)
}

function triggerCustom() {
  toaster[type.value](msg.value, {...options.value, component: CustomToast})
}

function triggerAll() {
  toaster.error('Error toast', options.value)
  toaster.info('Info toast', options.value)
  toaster.success('Success toast', options.value)
  toaster.warn('Warn toast', options.value)
}
</script>

<template>
  <div id="letsplay">
    <div class="header">Play with me!</div>
    <div class="body">
      <div class="form-input">
        <strong><label for="message">Message</label></strong>
        <input id="message" type="text" v-model="msg" />
      </div>
      <div class="form-input">
        <strong><label for="duration">Duration (ms)</label></strong>
        <input id="duration" type="number" v-model="options.duration" />
      </div>
      <div class="form-control">
        <strong>Position</strong>
        <div class="radio-group">
          <div class="form-radio">
            <label for="top-left">top-left</label>
            <input type="radio" id="top-left" v-model="options.position" value="top-left" />
          </div>
          <div class="form-radio">
            <label for="top">top</label>
            <input type="radio" id="top" v-model="options.position" value="top" />
          </div>
          <div class="form-radio">
            <label for="top-right">top-right</label>
            <input type="radio" id="top-right" v-model="options.position" value="top-right" />
          </div>
          <div class="form-radio">
            <label for="bottom-left">bottom-left</label>
            <input type="radio" id="bottom-left" v-model="options.position" value="bottom-left" />
          </div>
          <div class="form-radio">
            <label for="bottom">bottom</label>
            <input type="radio" id="bottom" v-model="options.position" value="bottom" checked />
          </div>
          <div class="form-radio">
            <label for="bottom-right">bottom-right</label>
            <input type="radio" id="bottom-right" v-model="options.position" value="bottom-right" />
          </div>
        </div>
      </div>
      <div class="form-control">
        <strong>Type</strong>
        <div class="radio-group">
          <div class="form-radio">
            <label for="error">error</label>
            <input type="radio" id="error" v-model="type" value="error" />
          </div>
          <div class="form-radio">
            <label for="info">info</label>
            <input type="radio" id="info" v-model="type" value="info" checked />
          </div>
          <div class="form-radio">
            <label for="success">success</label>
            <input type="radio" id="success" v-model="type" value="success" />
          </div>
          <div class="form-radio">
            <label for="warn">warn</label>
            <input type="radio" id="warn" v-model="type" value="warn" />
          </div>
        </div>
      </div>
      <div class="form-control">
        <strong>Misc.</strong>
        <div class="form-checkbox">
          <label for="closeOnClick">Close on click</label>
          <input type="checkbox" v-model="options.closeOnClick" id="closeOnClick" />
        </div>
        <div class="form-checkbox">
          <label for="hideCloseButton">Hide close button</label>
          <input type="checkbox" v-model="options.hideCloseButton" id="hideCloseButton" />
        </div>
        <div class="form-checkbox">
          <label for="hideProgress">Hide progress</label>
          <input type="checkbox" v-model="options.hideProgress" id="hideProgress" />
        </div>
        <div class="form-checkbox">
          <label for="pauseOnHover">Pause on hover</label>
          <input type="checkbox" v-model="options.pauseOnHover" id="pauseOnHover" />
        </div>
      </div>
      <NestedComponent />
    </div>
    <div class="footer">
      <button @click="trigger">Launch!</button>
      <button @click="triggerCustom">Launch custom!</button>
      <button @click="triggerAll">Launch all!</button>
    </div>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  font-family: sans-serif;
  margin: 0;
}

#letsplay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  box-shadow: 3px 3px 10px hsl(0, 0%, 85%);
  border-radius: 8px;

  .header {
    font-size: 24px;
    font-weight: bold;
    padding: 16px;
  }

  .body {
    display: grid;
    gap: 16px;
    padding: 16px;

    .form-control {
      display: grid;
      gap: 8px;
    }

    .form-input {
      display: grid;
      gap: 8px;

      input {
        border: 1px solid lightgray;
        padding: 8px 12px;
        font-size: 16px;
      }
    }

    .form-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-radio {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .radio-group {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .footer {
    display: flex;
    justify-content: space-evenly;
    padding: 16px;
    gap: 16px;

    button {
      border: none;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 16px;
    }
  }
}
</style>
