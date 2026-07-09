import { Route } from "lucide-react";
import { BrowserRouter, Routes } from "react-router";

export function App() {
  return<BrowserRouter>
    <Routes>
      <Route path="/auth" element={<Auth />} />
    </Routes>
  </BrowserRouter>;
}

export default App;
