import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';

import { useAppStore } from './store/useAppStore';

function App() {
  const darkMode = useAppStore(s => s.darkMode);

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen`}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<AppShell />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
