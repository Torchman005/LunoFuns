<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui'

// Customize Naive UI theme to match our ACG pink/pastel style
const themeOverrides = {
  common: {
    primaryColor: '#ff85a2',
    primaryColorHover: '#ff6b8f',
    primaryColorPressed: '#e65c81',
    primaryColorSuppl: '#ff85a2',
    infoColor: '#74c0fc',
    infoColorHover: '#5ab0f9',
    infoColorPressed: '#4a9ee6',
    infoColorSuppl: '#74c0fc',
    borderRadius: '12px',
    fontFamily: "'Nunito', 'PingFang SC', 'Microsoft YaHei', sans-serif"
  },
  Button: {
    borderRadiusMedium: '999px', // fully rounded buttons for actions
  }
}
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <NMessageProvider>
      <NDialogProvider>
        <RouterView />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
