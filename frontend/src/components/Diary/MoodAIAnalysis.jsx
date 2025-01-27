import { useRef, useState, useEffect } from 'react';
import { Charts } from '@/components/Diary';
import axios from "axios";

const MoodAIAnalysis = ({ entries, concatedEntrieDesc }) => {
  const modalRef = useRef();
  const [res, setResponse] = useState('');
  const [loading, setLoading] = useState(false)
  const [ratings, setRatings] = useState([])

  const extractPercentages = (str) => {
    const regex = /(\d+)%/g
    const matches = str.match(regex)

    if (matches) {
      // console.log(matches, "res:", res)
      return matches.map(match => match.slice(0, -1));

    } else {
      return []; // Gibt ein leeres Array zurück, wenn keine Prozentzahlen gefunden wurden
    }

  };

  const handleAISummary = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_PROXY_OPENAI}`, {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Gib mir eine Zusammenfassung eines jeden Autors und eine prozentuelle Bewertung zu den Einträgen ${concatedEntrieDesc}`,

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
      // console.log(response.data.message.content)
      setResponse(response.data.message.content + "50%")
      setRatings([...res, extractPercentages(res)])
    } catch (error) {
      console.error("Fehler bei der KI-Analyse:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    ratings.length > 0 ?
      console.log(ratings) :
      null
  }, [])

  // const getEintraege = async () => {
  //   const eintrage = await axios.get("http://localhost:8080/entries")
  // }


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
              <p className='underline'>
                {loading ?
                  "Data is loading..." :
                  JSON.stringify(res)
                    .replace(/^"|"$/g, '')
                  // .replace(/\\n\\n/g, '\n\n')
                  // .replace(/\./g, '.\n')
                }
              </p>
            </div>
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>
              <Charts aiSummary={entries} />
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
