import './App.css';
import Header from './pages/Header';
import Layout from './Layout';
import Post from './pages/Post';
import {Route,Routes} from 'react-router-dom';
import IndexPage from './pages/index-page';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import { UserContext, UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/Post-page';
import EditPost from './pages/editPost';

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
        <Route path='/create' element = {
          <CreatePost/>
        }/>
        <Route path='/post/:id' element = {
          <PostPage/>
        }/>
        <Route path='/edit/:id' element = {
          <EditPost/>
        }/>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
