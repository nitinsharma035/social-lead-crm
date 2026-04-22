import React, { useState } from 'react';
import Layout from '../components/Layout';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: 'Nitin Sharma',
    role: 'Asst. Manager - Software Developer',
    business: 'Being Inginious Media Pvt. Ltd.'
  });

  return (
    <Layout>
      <div className="max-w-2xl text-left">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Settings</h2>
        <p className="text-gray-500 mb-8">Manage your profile and CRM preferences.</p>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">User Name</label>
            <input 
              type="text" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Designation</label>
            <input 
              type="text" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={profile.role}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
            <input 
              type="text" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={profile.business}
            />
          </div>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
            Save Settings
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;