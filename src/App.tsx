import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
