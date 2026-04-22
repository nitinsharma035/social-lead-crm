import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  // Tasks load karne ka function (isey hum baar-baar call karenge update ke baad)
  const loadTasks = () => {
    const allTasks = [];
    const savedLeads = JSON.parse(localStorage.getItem('crm_leads')) || [];

    savedLeads.forEach(lead => {
      const leadNotes = JSON.parse(localStorage.getItem(`notes_${lead.id}`)) || [];
      leadNotes.forEach(note => {
        if (note.reminder) {
          allTasks.push({ 
            id: note.id, 
            text: note.text, 
            dueDate: note.reminder, 
            status: note.taskStatus || 'New', // Default 'New' agar pehle se nahi hai
            leadName: lead.name, 
            leadId: lead.id 
          });
        }
      });
    });

    allTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    setTasks(allTasks);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Task ka status update karne ka function
  const updateTaskStatus = (leadId, noteId, newStatus) => {
    const leadNotes = JSON.parse(localStorage.getItem(`notes_${leadId}`)) || [];
    const updatedNotes = leadNotes.map(note => 
      note.id === noteId ? { ...note, taskStatus: newStatus } : note
    );
    
    localStorage.setItem(`notes_${leadId}`, JSON.stringify(updatedNotes));
    loadTasks(); // UI refresh karne ke liye
  };

  return (
    <Layout>
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-bold text-gray-800">Pipeline Tasks</h2>
        <p className="text-gray-500">Manage follow-up stages for each client note.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Client</th>
                <th className="px-8 py-5">Task Description</th>
                <th className="px-8 py-5">Due Date</th>
                <th className="px-8 py-5 text-right">Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.length > 0 ? tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition group">
                  <td className="px-8 py-5">
                    <Link to={`/lead/${task.leadId}`} className="font-bold text-blue-600 hover:underline">
                      {task.leadName}
                    </Link>
                  </td>
                  <td className="px-8 py-5 text-gray-700 text-sm max-w-xs truncate">
                    {task.text}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter ${
                      new Date(task.dueDate) < new Date().setHours(0,0,0,0) && task.status !== 'Done'
                      ? 'bg-red-50 text-red-600' 
                      : 'bg-blue-50 text-blue-600'
                    }`}>
                      {task.dueDate}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {/* Status Dropdown */}
                    <select 
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.leadId, task.id, e.target.value)}
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg outline-none cursor-pointer border transition-all ${
                        task.status === 'New' ? 'border-blue-200 text-blue-600 bg-white' :
                        task.status === 'Process' ? 'border-yellow-200 text-yellow-600 bg-white' :
                        task.status === 'Done' ? 'border-green-200 text-green-600 bg-green-50' :
                         task.status === 'Pending' ? 'border-red-200 text-red-600 bg-red-50' :
                        'border-gray-200 text-gray-600 bg-white'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Process">In Process</option>
                      <option value="Done">Completed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-gray-400 italic">No scheduled tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;