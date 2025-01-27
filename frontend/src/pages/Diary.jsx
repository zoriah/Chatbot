import { useEffect, useState } from 'react';
import axios from 'axios';
import { CreateEntry, MoodAIAnalysis, EntriesList } from '@/components/Diary';
import { toast } from 'react-toastify';

const Diary = () => {
  const [entries, seEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [concatedEntrieDesc, setConcatedEntrieDesc] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_NOTES_API}/entries`);
        // console.log("Content:", data)
        seEntries(data);
        setConcatedEntrieDesc(entries.map((entry) => entry.content).join(' '))
        // setConcatedEntrieDesc(entries.map(entry => console.log(entry.content)))
      } catch (error) {
        // console.log("Diary.jsx")
        toast.error(error.message);
      } finally {
        setLoading(false)
      }
    })();
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      setConcatedEntrieDesc(entries.map((entry) => entry.content).join(' '));
    }
  }, [entries]);

  return (
    <>
      <EntriesList entries={entries} />
      <CreateEntry setEntries={seEntries} />
      {loading ?
        "Daten werden geladen!" :
        <MoodAIAnalysis entries={entries} concatedEntrieDesc={concatedEntrieDesc} />
      }

    </>
  );
};

export default Diary;
