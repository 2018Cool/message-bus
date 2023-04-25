<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { MessageBus } from 'iframe-msg-bus';
const state = reactive({ msg: '', receivedMsg: '' })
const bus = new MessageBus(window)

const handler = (data: any) => state.receivedMsg = data.msg
const handler2 = (data: any) => console.log('receive msg:', data.msg)
onMounted(() => {
  bus.on('msg', handler)
  bus.on('msg', handler2)
})

const sendMsg = () => {
  bus?.emit('msg', { msg: state.msg })
}

const close = () => {
  bus?.off('msg', handler)
}

</script>

<template>
  <el-card style="margin-bottom: 10px;">
    <template #header>
      <div class="card-header">
        <span>发送消息</span>
        <el-button type="primary" @click="sendMsg">发送</el-button>
      </div>
    </template>
    <el-input v-model="state.msg" placeholder="Please input" />

  </el-card>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>收到的消息</span>
        <el-button type="primary" @click="close">关闭事件监听</el-button>
      </div>
    </template>
    <el-input v-model="state.receivedMsg" :rows="2" type="textarea" />
  </el-card>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  display: block;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>