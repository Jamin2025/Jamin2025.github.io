const Node_ = require('./Node_.js')
const poisson = require('./poisson.js')
const Task = require('./Task.js')
const NodeReactiveTMR = require('./NodeReactiveTMR.js')
const NodeTwoPhaseTMR = require('./NodeTwoPhaseTMR.js')
const NodeTMR = require('./NodeTMR.js')
const { setExperimentStateForTMR, setExperimentStateForTwoPhaseTMR, setLeaderForClusterTMR } = require("../util")
// const taskGraph = JSON.parse(require('./dataset/fpppp.json'))

const taskLen = 3
/**
 * @todo
 * @todo 将该任务集改成standard task graph
 * 任务构成仿真应用，交给node的是一个应用，node记录这个应用出现多少次，进行roundEnd还有回退等操作
 */
const App = new Array(taskLen).fill(null).map(() => new Task());
App.pid = 1

function PoF(arr) {
    const len = arr.length;
    let failedCount = 0
    for (let i = 0; i < len; i++) {
        if (arr[i] == "wrong") failedCount++
    }
    return failedCount / len
}
// node.brokeCore(1)

export const ReactiveTMRIntialState = {
    cores: ['Broke', 'Idel', 'Idel', 'Idel'],
    storages: ['Idel', 'Idel', 'Idel', 'Idel']
}
export async function ReactiveTMR() {
    const node = new NodeReactiveTMR(2)
    for (let i = 0; i < 4; i++) {
        if (ReactiveTMRIntialState.cores[i] === "Broke") node.brokeCore(i)
    }
    for (let i = 0; i < 3; i++) {
        const eachAppRes = await node.runWithReactiveTMR(App)
        console.log(eachAppRes)
    }
    
}


export const TwoPhaseTMRIntialState = {
    cores: ['Broke', 'Broke', 'Idel', 'Idel'],
    storages: ['Idel', 'Idel', 'Idel', 'Idel']
}

export async function TwoPhaseTMR() {
    const node = new NodeTwoPhaseTMR(1)
    for (let i = 0; i < 4; i++) {
        if (TwoPhaseTMRIntialState.cores[i] === "Broke") node.brokeCore(i)
    }
    setExperimentStateForTwoPhaseTMR((prev) => {
        const news = [...prev]
        news[0] = App.length 
        return news
    })
    const eachAppRes = await node.runWithTwoPhaseTMR(App)
    console.log(eachAppRes)
    // console.log("TwoPhase TMR: ", node.getTaskRunCount())
    // console.log("PoF: ", PoF(result))
}

export const TMRIntialState = {
    cores: ['Broke', 'Broke', 'Idel', 'Idel'],
    storages: ['Idel', 'Idel', 'Idel', 'Idel']
}

export async function TMR() {
    const node = new NodeTMR(0)
    for (let i = 0; i < 4; i++) {
        if (TMRIntialState.cores[i] === "Broke") node.brokeCore(i)
    }
    setExperimentStateForTMR((prev) => {
        const news = [...prev]
        news[0] = App.length 
        return news
    })
    const AppRes = await node.runWithTMR(App)
    console.log(AppRes)
}

export const hybirdFT_FD_InitialCoreState = [
  ['Broke', 'Idel', 'Idel', 'Idel'],
  ['Idel', 'Idel', 'Idel', 'Idel'],
  ['Broke', 'Broke', 'Broke', 'Broke'],
  ['Broke', 'Broke', 'Broke', 'Idel'],
  ['Broke', 'Broke', 'Idel', 'Idel'],
]
export const ClusterNumber = 5;


async function test() {
    const node = new Node_()
    const App = new Array(2).fill(null).map(() => new Task());
    node.runWithReactiveTMR(App)
}
// test()
// TMR()
// TwoPhaseTMR()
// ReactiveTMR()

