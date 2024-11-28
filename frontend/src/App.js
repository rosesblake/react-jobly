import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CompanyList } from "./CompanyList";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/companies" element={<CompanyList />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
