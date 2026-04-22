import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Firebase connection

const Leads = () => {
  const [leads, setLeads] = useState([]);

  // 1. Firebase se Real-time data fetch karna
  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leadsArray = [];
      querySnapshot.forEach((doc) => {
        leadsArray.push({ ...doc.data(), id: doc.id });
      });
      setLeads(leadsArray);
    });
    return () => unsubscribe();
  }, []);

  // 2. Status Update karne ka logic (Firebase)
  const updateStatus = async (id, newStatus) => {
    try {
      const leadRef = doc(db, "leads", id);
      await updateDoc(leadRef, { status: newStatus });
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  return (
    <Layout>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 text-left">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">All Leads</h2>
          <p className="text-gray-500 font-medium">Manage your cloud database in real-time.</p>
        </div>
        <div className="text-sm font-bold bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl border border-blue-100 shadow-sm">
          Lead Count: {leads.length}
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Lead Name</th>
                <th className="px-8 py-5">Source</th>
                <th className="px-8 py-5">Date Added</th>
                <th className="px-8 py-5 text-center">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.length > 0 ? leads.map(lead => (
                <tr key={lead.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-8 py-5">
                    <Link to={`/lead/${lead.id}`} className="font-bold text-gray-800 hover:text-blue-600 transition">
                      {lead.name}
                    </Link>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">{lead.email || 'No Email'}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                      {lead.source || 'Direct'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                    {lead.date}
                  </td>
                  <td className="px-8 py-5 text-center">
                    {/* --- STATUS DROPDOWN --- */}
                    <select 
                      value={lead.status} 
                      onChange={(e) => updateStatus(lead.id, e.target.value)} 
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full outline-none cursor-pointer border-none transition-all shadow-sm ${
                        lead.status === 'New' ? 'bg-blue-100 text-blue-700' : 
                        lead.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-gray-400 italic font-medium">
                    Cloud database is empty. Waiting for leads...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Leads;