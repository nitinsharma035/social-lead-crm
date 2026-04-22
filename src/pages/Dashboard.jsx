import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { collection, query, onSnapshot, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Ensure your firebase.js path is correct
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import EditLeadModal from '../components/EditLeadModal';

const Dashboard = () => {
  const [leads, setLeads] = useState([]); // Default empty array for Firebase
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditLead, setCurrentEditLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // --- 1. FIREBASE REAL-TIME LISTENER ---
  useEffect(() => {
    // Leads collection se data uthana, latest pehle
    const q = query(collection(db, "leads"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leadsArray = [];
      querySnapshot.forEach((doc) => {
        leadsArray.push({ ...doc.data(), id: doc.id });
      });
      setLeads(leadsArray);
    }, (error) => {
      console.error("Firebase Error:", error);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // --- 2. ACTIONS (Firebase Version) ---
  const addNewLead = async (newLead) => {
    try {
      await addDoc(collection(db, "leads"), {
        ...newLead,
        date: new Date().toISOString().split('T')[0],
        timestamp: serverTimestamp() // Firebase auto-timestamp
      });
    } catch (err) {
      alert("Error adding lead: " + err.message);
    }
  };

  const updateLead = async (updatedLead) => {
    try {
      const leadRef = doc(db, "leads", updatedLead.id);
      await updateDoc(leadRef, {
        name: updatedLead.name,
        email: updatedLead.email,
        company: updatedLead.company,
        source: updatedLead.source || 'Direct'
      });
    } catch (err) {
      alert("Error updating lead: " + err.message);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const leadRef = doc(db, "leads", id);
      await updateDoc(leadRef, { status: newStatus });
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm("Delete this lead permanently?")) {
      try {
        await deleteDoc(doc(db, "leads", id));
      } catch (err) {
        alert("Error deleting lead: " + err.message);
      }
    }
  };

  // --- 3. LOGIC (Local to UI) ---
  const exportToCSV = () => {
    const headers = ["Name,Email,Company,Source,Status,Date Added\n"];
    const rows = leads.map(l => `${l.name},${l.email},${l.company},${l.source || 'Direct'},${l.status},${l.date}\n`);
    const blob = new Blob([headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Leads_Export_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getChartData = () => {
    const counts = {};
    leads.forEach(l => {
      const source = l.source || 'Direct';
      counts[source] = (counts[source] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  const filteredLeads = leads.filter(l => {
    const nameMatch = l.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = l.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStat = statusFilter === "All" || l.status === statusFilter;
    return (nameMatch || companyMatch) && matchStat;
  });

  return (
    <Layout>
      {/* Stats & Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center text-left">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Leads</p>
              <p className="text-3xl font-black text-blue-600">{leads.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl text-2xl">📈</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center text-left">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Conversion</p>
              <p className="text-3xl font-black text-green-600">
                {leads.length > 0 ? Math.round((leads.filter(l => l.status === 'Closed').length / leads.length) * 100) : 0}%
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl text-2xl">🎯</div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64">
          <h4 className="text-sm font-bold text-gray-500 uppercase mb-2 text-left">Lead Sources Distribution</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={getChartData()} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {getChartData().map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="middle" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search name or company..." 
            className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <span className="absolute left-3 top-3.5">🔍</span>
        </div>
        
        <select 
          className="px-4 py-3 bg-white border rounded-xl outline-none font-medium text-gray-600"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Closed">Closed</option>
        </select>

        <button onClick={exportToCSV} className="bg-green-100 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-200 transition flex items-center justify-center gap-2">
          📥 Export
        </button>

        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
          + Add Lead
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Company</th>
                <th className="px-8 py-5">Source</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <Link to={`/lead/${lead.id}`} className="font-bold text-gray-800 hover:text-blue-600">{lead.name}</Link>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">{lead.email}</div>
                  </td>
                  <td className="px-8 py-5 text-gray-600 text-sm font-medium">{lead.company}</td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase">{lead.source || 'Direct'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <select 
                      value={lead.status} 
                      onChange={(e) => updateStatus(lead.id, e.target.value)} 
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full outline-none cursor-pointer border-none ${
                        lead.status === 'New' ? 'bg-blue-100 text-blue-700' : 
                        lead.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setCurrentEditLead(lead); setIsEditModalOpen(true); }} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition">✏️</button>
                      <button onClick={() => deleteLead(lead.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="p-10 text-center text-gray-400 italic">No leads found in Cloud database...</div>
          )}
        </div>
      </div>

      <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addNewLead} />
      <EditLeadModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onUpdate={updateLead} leadData={currentEditLead} />
    </Layout>
  );
};

export default Dashboard;