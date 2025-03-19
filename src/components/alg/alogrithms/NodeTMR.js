const Node_ = require('./Node_')

const { 
    setExperimentStateForTMR,
} = require("../util")

class NodeTMR extends Node_ {
    constructor(NodeID) {
        super(0, NodeID)
    }

    async runWithTMR(App) {
        const res = []
        const AppLen = App.length
        for(let i = 0; i < AppLen; i++) {
            let task = App[i]
            const { callArr: waitVotintThreeRes} = await this.runOnDistinctFreeCores(3, null, task)
            // const waitVotintThreeRes = await this.calTask(task, 0);
            // 投票异步防止阻塞
            res.push(Promise.all(waitVotintThreeRes).then(res => {
                const votRes = Node_.FT.TMR(...res);
                setExperimentStateForTMR((prev) => {
                    const news = [...prev]
                    news[1] += 3
                    if (votRes !== 0.5) news[3] += 1
                    else news[2] += 1
                    news[4] = news[3] / AppLen 
                    return news
                })
                return votRes
            }))
        }
        const finalRes = await Promise.all(res)
        return finalRes
    }
}

module.exports = NodeTMR
