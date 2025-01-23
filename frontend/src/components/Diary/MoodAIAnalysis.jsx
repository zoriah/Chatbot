import { useRef, useState, useEffect } from 'react';
import { Charts } from '@/components/Diary';
import axios from "axios";

const MoodAIAnalysis = ({ entries, concatedEntrieDesc }) => {
  const modalRef = useRef();
  const [eintraege, setEintraege] = useState([])

  useEffect(() => {
    (async () => {
      try {
        concatedEntrieDesc.length === 0 ?
          await concatedEntrieDesc :
          concatedEntrieDesc
      } catch (error) {
        toast.error(error.message);
      }
    })();
  }, [])

  const getEintraege = async () => {
    const eintrage = await axios.get("http://localhost:8080/entries")
    setEintraege(eintraege.data)
  }
  const handleAISummary = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_PROXY_OPENAI}`, {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: "You are a Textassistant"
          },
          {
            role: 'user',
            content: `I want to have a summarized info about the entries below: ${concatedEntrieDesc}`,
          },
        ],
      },
        {
          headers: {
            'Content-Type': 'application/json',
            provider: 'open-ai',
            mode: 'production',
            Authorization: `${import.meta.env.VITE_OPENAI_APIKEY}`,
          },
        })
      // console.log(response.data)
      setEintraege(response.data);
    } catch (error) {
      console.error("Fehler bei der KI-Analyse:", error);
    }
  };

  return (
    <>
      <div className='fixed bottom-4 right-4'>
        <button
          onClick={() => modalRef.current.showModal()}
          className='bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10'
        >
          ✨
        </button>
      </div>
      <dialog id='modal-note' className='modal' ref={modalRef}>
        <div className='modal-box h-[600px] py-0 w-11/12 max-w-5xl'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get your AI Gen Mood Analysis</h1>
            <form method='dialog'>
              <button className='btn'>&times;</button>
            </form>
          </div>
          <div className='flex items-center gap-3'>
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>
              {
                JSON.stringify(eintraege, null, 2)
              }
            </div>
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>
              <Charts aiSummary={eintraege} />
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'
              onClick={handleAISummary}
            >
              {
                "Gen AI mood analysis ✨"
              }
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MoodAIAnalysis;
