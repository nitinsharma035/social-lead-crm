import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddLeadModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', status: 'New', source: 'Google' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', email: '', company: '', status: 'New', source: 'Google' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-[110] p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-left">Add New Lead</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Name" required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="text" placeholder="Company" required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
              
              <div className="text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Lead Source</label>
                <select className="w-full mt-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})}>
                  <option value="Google">Google</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Save Lead</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default AddLeadModal;