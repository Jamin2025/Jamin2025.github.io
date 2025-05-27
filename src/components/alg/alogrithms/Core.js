
const { hitProbability } = require('./poisson.js')
const { coreToBusyForTMR,
        coreRestoreForTMR,
        
        coreToBusyForTwoPhaseTMR,
        coreRestoreForTwoPhaseTMR,
        
        coreRestoreForReactiveTMR,
        coreToBusyForReactiveTMR,
        
        coreToBusyForClusterTMR, 
        coreRestoreForClusterTMR 
    } = require('../util/index')
const coreNums = 4

class Core {
    isPermentFault = false;
    isCalculate = false;
    calCount = 0
    NodeID = null
    id = null
    mode = null
    active_ = true
    scheduleQueue = []

    constructor(id, mode, NodeID) {
        this.id = id
        this.mode = mode
        this.NodeID = NodeID
    }

    deactiveCore () {
        this.active_ = false
    }

    active() {
        this.active_ = true
    }

    promiseCalculate(task) {
        this.isCalculate = true;
        const isTMR = this.mode === 0
        const isTwoPhaseTMR = this.mode === 1
        const isReactiveTMR = this.mode === 2
        const isCluterTMR = this.mode === 3
        if (isTMR) coreToBusyForTMR(this.id, this.NodeID)
        else if (isTwoPhaseTMR) coreToBusyForTwoPhaseTMR(this.id, this.NodeID)
        else if (isReactiveTMR) {
            coreToBusyForReactiveTMR(this.id, this.NodeID)
            if (!this.active_) console.info("try reactive")
        }
        else if (isCluterTMR) coreToBusyForClusterTMR(this.id, this.NodeID)
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.isNormalOperate() && !hitProbability(task.transientFaultProbality)) task.result = 0.5
                else task.result = Math.random()
                this.isCalculate = false
                if (isTMR) coreRestoreForTMR(this.id, this.isPermentFault, this.NodeID)
                else if (isTwoPhaseTMR) coreRestoreForTwoPhaseTMR(this.id, this.isPermentFault, this.NodeID)
                else if (isReactiveTMR) coreRestoreForReactiveTMR(this.id, this.isPermentFault, this.NodeID)
                else if (isCluterTMR) coreRestoreForClusterTMR(this.id, this.isPermentFault, this.NodeID)
                resolve(task.result)
            }, task.duration * 1000)
        })
    }

    auxCalculate() {
        if (this.scheduleQueue.length) {
            const task = this.scheduleQueue[0];
            return task().then(() => {
                this.scheduleQueue.shift();
                this.auxCalculate();
            })
        }
    }

    calculate(task) {
        this.calCount++;
        return new Promise((resolve) => {
            this.scheduleQueue.push(() => this.promiseCalculate(task).then(resolve))
            if (this.scheduleQueue.length === 1) this.auxCalculate()
        })
        
        // 这里存在bug，应该从队列里调用，而不是这样，有调度bug
        // 调度完了结果怎么返回回去呢？
    }

    isCalculating() {
        return this.isCalculate
    }
    isNormalOperate() {
        return !this.isPermentFault
    }
    broke() {
        this.isPermentFault = true
    }
}

module.exports = {
    Core,
    coreNums
}