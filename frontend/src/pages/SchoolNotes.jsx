import { useEffect, useState } from 'react';
import axios from 'axios';
import { CreateNote, NotesAISummary, NotesList } from '@/components/Notes';
import { toast } from 'react-toastify';

const SchoolNotes = () => {
  const [notes, setNotes] = useState([]);
  // const []

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_NOTES_API}/notes`);
        setNotes(data);
      } catch (error) {
        console.log("SchoolNotes.jsx")
        toast.error(error.message);
      }
    })();
  }, []);

  return (
    <>
      <NotesList notes={notes} />
      <CreateNote setNotes={setNotes} />
      <NotesAISummary notes={notes} />
    </>
  );
};

export default SchoolNotes;
