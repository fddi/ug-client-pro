import './style/app.less';
import {
  BrowserRouter, Route, Routes
} from 'react-router-dom';
import asyncComponent from "./util/AsyncComponent";

const Login = asyncComponent(() => import('./page/Login'));
const Index = asyncComponent(() => import('./page/Index'));
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
