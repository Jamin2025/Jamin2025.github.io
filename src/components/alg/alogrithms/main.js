const NodeReactiveTMR = require('./NodeReactiveTMR.js')
const NodeTwoPhaseTMR = require('./NodeTwoPhaseTMR.js')
const NodeTMR = require('./NodeTMR.js')
// const { setLeaderForClusterTMR, setExperimentStateForClusterTMR } = require("../util")
// const taskGraph = JSON.parse(require('./dataset/fpppp.json'))

/**
 * @todo
 * @todo 将该任务集改成standard task graph
 * 任务构成仿真应用，交给node的是一个应用，node记录这个应用出现多少次，进行roundEnd还有回退等操作
 */

// node.brokeCore(1)
const Turn = 50

export const hybirdFT_FD_InitialCoreState = [
    ['Broke', 'Idel', 'Idel', 'Idel'],
    ['Idel', 'Idel', 'Idel', 'Idel'],
    ['Broke', 'Broke', 'Broke', 'Broke'],
    ['Broke', 'Broke', 'Broke', 'Idel'],
    ['Broke', 'Broke', 'Idel', 'Idel'],
]

export const ClusterNumber = 5;

function genCoreStartExecution(NodeID, setCoresState) {
    return (id) => {
        setCoresState((prevCoreState) => {
            const newCoreState = [...prevCoreState]
            const cores = [...newCoreState[NodeID]]
            cores[id] = "Busy"
            newCoreState[NodeID] = cores
            return newCoreState
        })
    }
}

function genCoreEndExecution(NodeID, setCoresState) {
    return (id, isPermentFault) => {
        setCoresState((prevCoreState) => {
            const newCoreState = [...prevCoreState]
            const cores = [...newCoreState[NodeID]]
            cores[id] = isPermentFault ? "Broke" : "Idel"
            newCoreState[NodeID] = cores
            return newCoreState
        })
    }
}

function genCoreActiveStateChange(NodeID, setCoresDisabled) {
    return (coreId, isActive) => {
        setCoresDisabled((prevCoreState) => {
            const newCoreState = [...prevCoreState]
            const cores = [...newCoreState[NodeID]]
            cores[coreId] = isActive
            newCoreState[NodeID] = cores
            return newCoreState
        })
    }
}

export async function TMR(AppBeTest, isRandomData, setTMRExcutedNumsComp, setTMRExcutedPofComp, setCoresState, setExperimentStatesForTMR) {
    // 同样也是五个机器
    const nodes = new Array(ClusterNumber).fill(null).map((_, NodeID) => new NodeTMR(NodeID, genCoreStartExecution(NodeID, setCoresState), genCoreEndExecution(NodeID, setCoresState)))
    for (let i = 0; i < ClusterNumber; i++) {
        for (let j = 0; j < 4; j++) {
            if (hybirdFT_FD_InitialCoreState[i][j] === "Broke") nodes[i].brokeCore(j)
        }
    }
    const res = []
    let taskNums = 0, excutedNums = 0, failedNums = 0;
    const newExcutedNumsComp = [], newExcutedPofComp = [];

    const updateExperimentData = (taskNum, excutedNum, taskRes) => {
        taskNums += taskNum;
        excutedNums += excutedNum;
        if (taskRes !== 0.5) failedNums += 1;
        const pof = (failedNums / taskNums).toFixed(4)
        newExcutedNumsComp.push([taskNums, excutedNums, 'C-TMR'])
        newExcutedPofComp.push([taskNums, pof, 'C-TMR'])
        setTMRExcutedNumsComp([...newExcutedNumsComp])
        setTMRExcutedPofComp([...newExcutedPofComp])
        // 更新单个组件的实验数据
        setExperimentStatesForTMR([taskNums, excutedNums, taskNums - failedNums, failedNums, pof])
    }
    for (let i = 0; i < Turn; i++) {
        for (let j = 0; j < ClusterNumber; j++) {
            const node = nodes[j];
            if (isRandomData) {
                res.push(node.runWithTMRForRandomData(AppBeTest, updateExperimentData))
            } else {
                res.push(node.runWithTMRForGraphData(AppBeTest, updateExperimentData))
            }
        }
        await Promise.all(res)
    }
    return res;
}

export async function TwoPhaseTMR(AppBeTest, isRandomData, setTPTMRexcutedNumsComp, setTPTMRexcutedPofComp, setCoresState, setExperimentStatesForTwoPhaseTMR) {
    // 同样也是五个机器
    const nodes = new Array(ClusterNumber).fill(null).map((_, NodeID) => new NodeTwoPhaseTMR(NodeID, genCoreStartExecution(NodeID, setCoresState), genCoreEndExecution(NodeID, setCoresState)))


    for (let i = 0; i < ClusterNumber; i++) {
        for (let j = 0; j < 4; j++) {
            if (hybirdFT_FD_InitialCoreState[i][j] === "Broke") nodes[i].brokeCore(j)
        }
    }
    const res = []
    let taskNums = 0, excutedNums = 0, failedNums = 0;
    const newExcutedNumsComp = [], newExcutedPofComp = [];

    const updateExperimentData = (taskNum, excutedNum, taskRes) => {
        taskNums += taskNum
        excutedNums += excutedNum
        if (taskRes !== 0.5) {
            failedNums += 1;
        }
        const pof = (failedNums / taskNums).toFixed(4)
        newExcutedNumsComp.push([taskNums, excutedNums, 'TP-TMR'])
        setTPTMRexcutedNumsComp([...newExcutedNumsComp])
        newExcutedPofComp.push([taskNums, pof, 'TP-TMR'])
        setTPTMRexcutedPofComp([...newExcutedPofComp])
        // 更新单个组件的实验数据
        setExperimentStatesForTwoPhaseTMR([taskNums, excutedNums, taskNums - failedNums, failedNums, pof])
    }

    for (let i = 0; i < Turn; i++) {
        for (let j = 0; j < ClusterNumber; j++) {
            const node = nodes[j];
            if (isRandomData) res.push(node.runWithTwoPhaseTMRForRandom(AppBeTest, updateExperimentData))
            else res.push(node.runWithTwoPhaseTMRForGraph(AppBeTest, updateExperimentData))
        }
        await Promise.all(res)
    }
}




export async function ReactiveTMR(AppBeTest, isRandomData, setRTMRexcutedNumsComp, setRTMRexcutedPofComp, setCoresState, setExperimentState, setCoresDisabled) {
    const nodes = new Array(ClusterNumber).fill(null).map((_, NodeID) => new NodeReactiveTMR(NodeID, genCoreStartExecution(NodeID, setCoresState), genCoreEndExecution(NodeID, setCoresState), genCoreActiveStateChange(NodeID, setCoresDisabled)));
    for (let i = 0; i < ClusterNumber; i++) {
        for (let j = 0; j < 4; j++) {
            if (hybirdFT_FD_InitialCoreState[i][j] === "Broke") nodes[i].brokeCore(j)
        }
    }
    const res = []
    let taskNums = 0, excutedNums = 0, failedNums = 0;
    const newExcutedNumsComp = [], newExcutedPofComp = [];

    const updateExperimentData = (taskNum, excutedNum, taskRes) => {
        taskNums += taskNum
        excutedNums += excutedNum
        if (taskRes !== 0.5) {
            failedNums += 1;
        }
        const pof = (failedNums / taskNums).toFixed(4)
        newExcutedNumsComp.push([taskNums, excutedNums, 'R-TMR'])
        setRTMRexcutedNumsComp([...newExcutedNumsComp])
        newExcutedPofComp.push([taskNums, pof, 'R-TMR'])
        setRTMRexcutedPofComp([...newExcutedPofComp])
        // 更新单个组件的实验数据
        setExperimentState([taskNums, excutedNums, taskNums - failedNums, failedNums, pof])
    }

    for (let i = 0; i < Turn; i++) {
        for (let j = 0; j < ClusterNumber; j++) {
            const node = nodes[j];
            if (isRandomData) res.push(node.runWithReactiveTMRForRandom(AppBeTest, updateExperimentData))
            else res.push(node.runWithReactiveTMRForGraph(AppBeTest, updateExperimentData))
        }
        await Promise.all(res)
    }
}

// test()
// TMR()
// TwoPhaseTMR()
// ReactiveTMR()

