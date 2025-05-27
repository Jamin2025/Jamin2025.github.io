const { coreNums, Core } = require('./Core')
class Node {
    cores = new Array(coreNums)

    brokeCore(id) {
        this.cores[id].broke()
    }

    NodeID = null

    // mode 0 TMR, 1 TwoPhase TMR, 2 ReactiveTMR, 3 DashBoard
    constructor(mode, id) {
        const { cores } = this
        this.NodeID = id
        for (let i = 0; i < coreNums; i++) {
            cores[i] = new Core(i, mode, this.NodeID)
        }
        
    }
    // 空闲内核优先调度
    async runOnDistinctFreeCores(num, exclude, task) {
        let i = 0
        const hasExclude = exclude instanceof Set
        if (hasExclude && exclude.size === 4) return Promise.reject("runOnDistinctFreeCores error");
        if (hasExclude && coreNums - exclude.size < num) return Promise.reject("no more distinct core")
        const freeCoresAndCalArr = await new Promise(async (resolve) => {
            let freeCores = []
            const callArr = []
            // 注册
            const filterCores = hasExclude ? this.cores.filter((item) => !exclude.has(item.id)) : [...this.cores];
            // 最空闲内核优先调度
            filterCores.sort((a, b) => a.scheduleQueue.length - b.scheduleQueue.length);
            for (let i = 0; i < num; i++) {
                const core = filterCores[i]
                freeCores.push(core.id);
                callArr.push(core.calculate(task))
            }
            resolve({ freeCores, callArr })
        })
        return freeCoresAndCalArr;
    }
    // 空闲内核优先调度
    async executeTask(task) {
        const core = [...this.cores].sort((a, b) => a.scheduleQueue.length - b.scheduleQueue.length)[0]
        return [core.calculate(task)];
    }

    getTaskRunCount() {
        const count = this.cores.reduce((a, b) => {
            return a + b.calCount
        }, 0)
        return count
    }
    static FT = {
        TMR_with_fault_core(a, b, c, cores) {
            if (a == b) return [a, cores[2]];
            if (a == c) return [c, cores[1]];
            if (b == c) return [b, cores[0]];
            // console.log('TMR_with_fault_core error Majority Voting can\'nt determine the result', a, b, c)
            return [0, cores];
        },
    
        TMR(a, b, c){
            if (a == b) return a;
            if (a == c) return c;
            if (b == c) return b;
            // console.log('TMR error Majority Voting can\'t determine the result', a, b, c)
            return 0;
        },
    
        TPTMR_Primary(a, b) {
            if (a == b) return a;
            return 'TPTMPnoPass';
        }
    }
    
}
module.exports = Node
