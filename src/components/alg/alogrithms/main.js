const NodeReactiveTMR = require('./NodeReactiveTMR.js')
const NodeTwoPhaseTMR = require('./NodeTwoPhaseTMR.js')
const NodeTMR = require('./NodeTMR.js')
// const taskGraph = JSON.parse(require('./dataset/fpppp.json'))

/**
 * @todo
 * @todo 将该任务集改成standard task graph
 * 任务构成仿真应用，交给node的是一个应用，node记录这个应用出现多少次，进行roundEnd还有回退等操作
 */

// node.brokeCore(1)
const Turn = 100

export const hybirdFT_FD_InitialCoreState = [
    ['Broke', 'Idel', 'Idel', 'Idel'],
    ['Idel', 'Idel', 'Idel', 'Idel'],
    ['Broke', 'Broke', 'Broke', 'Broke'],
    ['Broke', 'Broke', 'Broke', 'Idel'],
    ['Broke', 'Broke', 'Idel', 'Idel'],
]

export const ClusterNumber = 5;

export const ReactiveTMRIntialState = {
    cores: ['Broke', 'Idel', 'Idel', 'Idel'],
    storages: ['Idel', 'Idel', 'Idel', 'Idel']
}
export async function ReactiveTMR(AppBeTest, isRandomData, setRTMRexcutedNumsComp, setRTMRexcutedPofComp) {
    const nodes = new Array(ClusterNumber).fill(null).map((_, i) => new NodeReactiveTMR(i))
    for (let i = 0; i < ClusterNumber; i++) {
        for (let j = 0; j < 4; j++) {
            if (hybirdFT_FD_InitialCoreState[i][j] === "Broke") nodes[i].brokeCore(j)
        }
    }
    const res = []
    let taskNums = 0, excutedNums = 0, failedNums = 0;
    const newExcutedNumsComp = [], newExcutedPofComp = [];
    if (isRandomData) {
        for (let i = 0; i < Turn; i++) {
            for(let j = 0; j < ClusterNumber; j++) {
                const node = nodes[j];
                res.push(node.runWithReactiveTMR(AppBeTest, (taskNum, excutedTaskNum, taskRes) => {
                    taskNums += taskNum;
                    excutedNums += excutedTaskNum;
                    newExcutedNumsComp.push([taskNums, excutedNums, 'R-TMR'])
                    if (taskNum !== 0) {
                        if (taskRes !== 0.5) failedNums += 1;
                        const pof = (failedNums / taskNums).toFixed(4)
                        newExcutedPofComp.push([taskNums, pof, 'R-TMR'])
                        setRTMRexcutedPofComp([...newExcutedPofComp])
                    }
                    setRTMRexcutedNumsComp([...newExcutedNumsComp])
                }))
            }
            await Promise.all(res)
        }
    }
}


export const TwoPhaseTMRIntialState = {
    cores: ['Broke', 'Broke', 'Idel', 'Idel'],
    storages: ['Idel', 'Idel', 'Idel', 'Idel']
}

export async function TwoPhaseTMR(AppBeTest, isRandomData, setTPTMRexcutedNumsComp, setTPTMRexcutedPofComp) {
        // 同样也是五个机器
    const nodes = new Array(ClusterNumber).fill(null).map((_, i) => new NodeTwoPhaseTMR(i))
    for (let i = 0; i < ClusterNumber; i++) {
        for (let j = 0; j < 4; j++) {
            if (hybirdFT_FD_InitialCoreState[i][j] === "Broke") nodes[i].brokeCore(j)
        }
    }
    const res = []
    let taskNums = 0, excutedNums = 0, failedNums = 0;
    const newExcutedNumsComp = [], newExcutedPofComp = [];
    if (isRandomData) {
        for (let i = 0; i < Turn; i++) {
            for(let j = 0; j < ClusterNumber; j++) {
                const node = nodes[j];
                res.push(node.runWithTwoPhaseTMR(AppBeTest, (taskNum, excutedNum, taskRes) => {
                    taskNums += taskNum
                    excutedNums += excutedNum
                    if (taskRes !== 0.5) failedNums += 1;
                    const pof = (failedNums / taskNums).toFixed(4)
                    newExcutedNumsComp.push([taskNums, excutedNums, 'TP-TMR'])
                    newExcutedPofComp.push([taskNums, pof, 'TP-TMR'])
                    setTPTMRexcutedNumsComp([...newExcutedNumsComp])
                    setTPTMRexcutedPofComp([...newExcutedPofComp])
                }))
            }
            await Promise.all(res)
        }
    }

}

export const TMRIntialState = {
    cores: ['Broke', 'Idel', 'Idel', 'Idel']
}

export async function TMR(AppBeTest, isRandomData, setTMRExcutedNumsComp, setTMRExcutedPofComp) {
    // 同样也是五个机器
    const nodes = new Array(ClusterNumber).fill(null).map((_, i) => new NodeTMR(i))
    for (let i = 0; i < ClusterNumber; i++) {
        for (let j = 0; j < 4; j++) {
            if (hybirdFT_FD_InitialCoreState[i][j] === "Broke") nodes[i].brokeCore(j)
        }
    }
    const res = []
    let taskNums = 0, excutedNums = 0, failedNums = 0;
    const newExcutedNumsComp = [], newExcutedPofComp = [];
    if (isRandomData) {
        for (let i = 0; i < Turn; i++) {
            for(let j = 0; j < ClusterNumber; j++) {
                const node = nodes[j];
                res.push(node.runWithTMR(AppBeTest, (taskNum, excutedNum, taskRes) => {
                    taskNums += taskNum;
                    excutedNums += excutedNum;
                    if (taskRes !== 0.5) failedNums += 1;
                    const pof = (failedNums / taskNums).toFixed(4)
                    newExcutedNumsComp.push([taskNums, excutedNums, 'C-TMR'])
                    newExcutedPofComp.push([taskNums,  pof, 'C-TMR'])
                    setTMRExcutedNumsComp([...newExcutedNumsComp])
                    setTMRExcutedPofComp([...newExcutedPofComp])
                }))
            }
            await Promise.all(res)
        }
    }
    
}





// test()
// TMR()
// TwoPhaseTMR()
// ReactiveTMR()

