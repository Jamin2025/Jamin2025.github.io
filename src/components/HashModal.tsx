"use client"
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StatusInfoBar from './alg/components/StatusInfoBar';
import ReactiveTMRDashboard from './alg/components/ReactiveTMR';
import TMRDashboard from './alg/components/TMR';
import TwoPhaseTMRDashboard from './alg/components/TwoPhaseTMR';

const HashModal = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get('modal')
  const router = useRouter();
  
  const [showModal, setShowModal] = useState(false);

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
            <div className="pl-[10%] pt-20">
              <StatusInfoBar />
            </div>
            <TMRDashboard />
            <div className="border-t-2 border-gray-200 mt-10"></div>
            <TwoPhaseTMRDashboard />
            <div className="border-t-2 border-gray-200 mt-10"></div>
            <ReactiveTMRDashboard />
            <div className="border-t-2 border-gray-200 mt-10"></div>
            {/* <GraphVisiualization /> */}
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