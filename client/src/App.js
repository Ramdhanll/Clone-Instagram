import React, {useEffect, createContext, useReducer, useContext} from 'react';
import Navbar from './components/Navbar'
import './App.css'
import { BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom'
import Home from '../src/components/screens/Home'
import Signin from './components/screens/SignIn'
import Profile from '../src/components/screens/Profile'
import Signup from './components/screens/SignUp'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import {reducer, initialState} from './reducers/userReducer'
import SubscribedUserPost from './components/screens/SubscribedUserPost';
import ResetPassword from './components/screens/ResetPassword';
import NewPassword from './components/screens/NewPassword';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)

  // jalankan pertama, jika ada user lakukan reduce
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({type:"USER", payload:user})
    } else {
      if (!history.location.pathname.startsWith('/reset-password'))
      if (!history.location.pathname.startsWith('/reset-password/:token'))
      if (!history.location.pathname.startsWith('/signup'))
      history.push('/signin')
    }
  }, [])

  return (
    <Switch>
      {/* <Route exact path="/">
        <Home />
      </Route> */}
      <Route exact path="/">
        <SubscribedUserPost />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route exact path="/reset-password">
        <ResetPassword />
      </Route>
      <Route path="/reset-password/:token">
        <NewPassword />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userId">
        <UserProfile />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState) 
  return (
    <div className="App">
      <UserContext.Provider value={{state,dispatch}}>
        <Router>
          <Navbar/>
          <Routing/>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
