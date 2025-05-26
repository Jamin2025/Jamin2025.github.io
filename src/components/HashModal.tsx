"use client"
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StatusInfoBar from './alg/components/StatusInfoBar';
import ReactiveTMRDashboard from './alg/components/ReactiveTMR';
import TMRDashboard from './alg/components/TMR';
import TwoPhaseTMRDashboard from './alg/components/TwoPhaseTMR';
import Task from './alg/alogrithms/Task';
import DataSelector from './alg/components/DataSelection';
import ExperimentCompare from './alg/components/ExperimentCompare';
const DataTypes = ["random", 'robot', 'fpppp', 'sparse']
const HashModal = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get('modal')
  const router = useRouter();
  
  const [showModal, setShowModal] = useState(false);

  const [selected, setSelected] = useState(DataTypes[0]);
  const [taskLen, setTaskLen] = useState('10')
  const [graphData, setGraphData] = useState(undefined)
  const isRandomData = selected === "random"
  const randomTask = useMemo(() => isRandomData ? new Array(+taskLen).fill(null).map((_, i) => {
    const task = new Task();
    task.id = i
    return task;
  }) : [], [taskLen, isRandomData])
  // const [excutedNumComp, setexcutedNumComp] = useState([])

  const [TMRexcutedNumsComp, setTMRExcutedNumsComp] = useState([])
  const [TPTMRexcutedNumsComp, setTPTMRexcutedNumsComp] = useState([])
  const [RTMRexcutedNumsComp, setRTMRexcutedNumsComp] = useState([])
  const [TPTDTMRDexcutedNumsComp, setTPTDTMRexcutedNumsComp] = useState([])

  const [TMRexcutedPofComp, setTMRExcutedPofComp] = useState([])
  const [TPTMRexcutedPofComp, setTPTMRexcutedPofComp] = useState([])
  const [RTMRexcutedPofComp, setRTMRexcutedPofComp] = useState([])
  const [TPTDTMRDexcutedPofComp, setTPTDTMRexcutedPofComp] = useState([])

  const taskNumExperimentData = useMemo(() => {
    const D: any[] = TMRexcutedNumsComp.concat(TPTMRexcutedNumsComp, RTMRexcutedNumsComp, TPTDTMRDexcutedNumsComp).sort((a, b) => a[0] - b[0])
    if (TPTDTMRDexcutedNumsComp.length > 1000) console.log(TPTDTMRDexcutedNumsComp[TPTDTMRDexcutedNumsComp.length - 1])
    console.warn = () => null
    D.unshift(["Orginal Tasks Num", "Excuted Tasks Num", "Method"])
    return D
  }, [TMRexcutedNumsComp, TPTMRexcutedNumsComp, RTMRexcutedNumsComp, TPTDTMRDexcutedNumsComp])

  const taskPofExperimentData = useMemo(() => {
    const D: any[] = TMRexcutedPofComp.concat(TPTMRexcutedPofComp, RTMRexcutedPofComp, TPTDTMRDexcutedPofComp).sort((a, b) => a[0] - b[0])
    D.unshift(["Orginal Tasks Num", "PoF", "Method"])
    return D
  }, [TMRexcutedPofComp, TPTMRexcutedPofComp, RTMRexcutedPofComp, TPTDTMRDexcutedPofComp])
 
  // 创建多个状态，最后合并一起，归并排序
  const AppBeTest = isRandomData ? randomTask  : graphData;

  // 监听路由变化
  useEffect(() => {
    
    if (search === "alg") {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "scroll"
    }
    // 初始检查
    setShowModal(search === 'alg');
  }, [search]);

  function closeModal() {
    router.replace('/')
  }

  function prevent(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
  }

  return (
    <div>
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={prevent}>
            <DataSelector
              selected={selected}
              setSelected={setSelected}
              taskLen={taskLen}
              setTaskLen={setTaskLen}
              graphData={graphData}
              setGraphData={setGraphData}
              randomTask={randomTask}
            />
          <div className="pl-[10%] pt-20">
            <StatusInfoBar />
          </div>
          <TMRDashboard
            AppBeTest={AppBeTest}
            isRandomData={isRandomData}
            setTMRExcutedNumsComp={setTMRExcutedNumsComp}
            setTMRExcutedPofComp={setTMRExcutedPofComp}
          />
          <div className="border-t-2 border-gray-200 mt-10"></div>
          <TwoPhaseTMRDashboard
            AppBeTest={AppBeTest}
            isRandomData={isRandomData}
            setTPTMRexcutedNumsComp={setTPTMRexcutedNumsComp}
            setTPTMRexcutedPofComp={setTPTMRexcutedPofComp}
          />
          <div className="border-t-2 border-gray-200 mt-10"></div>
          <ReactiveTMRDashboard
            AppBeTest={AppBeTest}
            isRandomData={isRandomData}
            setRTMRexcutedNumsComp={setRTMRexcutedNumsComp}
            setRTMRexcutedPofComp={setRTMRexcutedPofComp}
          />
          <div className="border-t-2 border-gray-200 mt-10"></div>
          <ExperimentCompare
            taskNumExperimentData={taskNumExperimentData}
            taskPofExperimentData={taskPofExperimentData}
          />
          </div>
        </div>
      )}

      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          
        }
        
        .modal-content {
          background: white;
          height: 40rem;
          // width: 100rem;
          padding: 2rem;
          border-radius: 8px;
          // max-width: 500px;
          overflow: scroll;
        }
      `}</style>
    </div>
  );
};

export default HashModal;