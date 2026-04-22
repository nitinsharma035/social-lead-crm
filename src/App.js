import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LeadDetails from './pages/LeadDetails';
import Tasks from './pages/Tasks';
import Leads from './pages/Leads';
import Settings from './pages/Settings';
import PublicForm from './pages/PublicForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lead/:id" element={<LeadDetails />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/leads" element={<Leads />} />
<Route path="/settings" element={<Settings />} />
<Route path="/contact-us" element={<PublicForm />} />
      </Routes>
    </Router>
  );
}
export default App;