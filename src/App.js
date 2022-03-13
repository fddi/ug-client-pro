import './style/app.less';
import {
  BrowserRouter, Route, Routes
} from 'react-router-dom';
import asyncComponent from "./util/AsyncComponent";

const Login = asyncComponent(() => import('./page/Login'));
const Admin = asyncComponent(() => import('./page/Admin'));
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
