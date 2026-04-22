import React, { useState } from 'react';

const PublicForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', source: 'Website Form' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Website se CRM ke LocalStorage mein data bhejni ki simulation
    const existingLeads = JSON.parse(localStorage.getItem('crm_leads')) || [];
    const newInboundLead = {
      ...formData,
      id: Date.now(),
      status: 'New',
      date: new Date().toISOString().split('T')[0]
    };

    localStorage.setItem('crm_leads', JSON.stringify([newInboundLead, ...existingLeads]));
    
    alert("Inquiry Sent Successfully! Check your CRM Dashboard.");
    setFormData({ name: '', email: '', company: '', source: 'Website Form' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-left">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-blue-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Enquiry Form</h2>
        <p className="text-gray-500 mb-6 text-sm">Vikas Marble Murti Arts - Contact Us</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
            <input type="text" required className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
            <input type="email" required className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Requirement</label>
            <input type="text" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="e.g. Marble Statue" />
          </div>
        </div>
        
        <button type="submit" className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition">
          Send Inquiry
        </button>
      </form>
    </div>
  );
};

export default PublicForm;