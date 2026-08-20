import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TimelinePage from './pages/TimelinePage'
import ComposePage from './pages/ComposePage'
import MessageDetailPage from './pages/MessageDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <Routes>
          <Route path="/"              element={<TimelinePage />} />
          <Route path="/compose"       element={<ComposePage />} />
          <Route path="/message/:id"   element={<MessageDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
