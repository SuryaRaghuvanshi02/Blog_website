import './App.css';
import Header from './pages/Header';
import Layout from './Layout';
import Post from './pages/Post';
import {Route,Routes} from 'react-router-dom';
import IndexPage from './pages/index-page';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import { UserContext, UserContextProvider } from './UserContext';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element ={<Layout/>}>
        <Route index element={
          <IndexPage/>
        }/>
        <Route path='/login' element = {
          <LoginPage/>
        }/>
        <Route path='/register' element = {
          <RegisterPage/>
        }/>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
