import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [reminderDate, setReminderDate] = useState(""); // Naya state

  useEffect(() => {
    const savedLeads = JSON.parse(localStorage.getItem('crm_leads')) || [];
    const foundLead = savedLeads.find(l => l.id.toString() === id);
    
    if (foundLead) {
      setLead(foundLead);
      const savedNotes = JSON.parse(localStorage.getItem(`notes_${id}`)) || [];
      setNotes(savedNotes);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteObj = {
      id: Date.now(),
      text: newNote,
      time: new Date().toLocaleString(),
      reminder: reminderDate // Reminder date save ho rahi hai
    };

    const updatedNotes = [noteObj, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${id}`, JSON.stringify(updatedNotes));
    setNewNote("");
    setReminderDate(""); // Form reset
  };

  if (!lead) return <div className="p-10 text-center">Loading Lead Details...</div>;

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left">
            <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-2xl font-bold text-white ${
              lead.status === 'New' ? 'bg-blue-500' : lead.status === 'Closed' ? 'bg-green-500' : 'bg-yellow-500'
            }`}>
              {lead.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{lead.name}</h2>
            <p className="text-gray-500 mb-6">{lead.company}</p>
            <div className="space-y-4 border-t pt-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</label>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                <p className="text-gray-700 font-medium">{lead.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 text-lg text-left">Activity Update</h3>
            <form onSubmit={handleAddNote} className="space-y-4">
              <textarea 
                rows="3"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="What happened today? (e.g. Sent sample photos)"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full text-left">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Next Follow-up Date</label>
                  <input 
                    type="date" 
                    className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                  />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition w-full md:w-auto">
                  Save Note
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 text-left">
                <p className="text-gray-700">{note.text}</p>
                <div className="mt-3 flex justify-between items-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{note.time}</p>
                  {note.reminder && (
                    <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded font-bold">
                      📅 Follow-up: {note.reminder}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeadDetails;