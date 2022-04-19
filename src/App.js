import './style/app.less';
import {
  BrowserRouter, Route, Routes
} from 'react-router-dom';
import LoadPage from "./util/LoadPage";

const Login = LoadPage(() => import('./page/Login'));
const Index = LoadPage(() => import('./page/Index'));
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/index" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
