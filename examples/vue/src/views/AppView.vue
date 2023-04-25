<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { MessageBus } from 'iframe-msg-bus';
const state = reactive({ msg: '', receivedMsg: '' })
const iframeRef = ref<any>(null)
let bus: MessageBus

console.log('app rerun')
const handler = (data: any) => state.receivedMsg = data.msg
const handler2 = (data: any) => console.log('receive msg:', data.msg)
onMounted(() => {
    if (!iframeRef.value) return
    bus = new MessageBus(iframeRef.value?.contentWindow, { targetOrigin: 'http://localhost:8001', debug: false })
    bus.on('msg', handler)
    bus.on('msg', handler2)
})

const sendMsg = () => {
    bus?.emit('msg', { msg: state.msg })
}

const close = () => {
    bus?.off('msg')
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
    <el-card style="margin-bottom: 10px;">
        <template #header>
            <div class="card-header">
                <span>收到的消息</span>
                <el-button type="primary" @click="close">关闭事件监听</el-button>
            </div>
        </template>
        <el-input v-model="state.receivedMsg" :rows="2" type="textarea" />
    </el-card>
    <el-card class="card">
        <template #header>
            <div class="card-header">
                <span>嵌入页面</span>
            </div>
        </template>
        <iframe ref="iframeRef" src="http://localhost:8001/#/iframe" frameborder="none" width="100%" height="400px" />
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

.card {
    background-color: #d9d9d9;
}
</style>