import React from 'react';
import axios from 'axios'
import {Route, NavLink} from 'react-router-dom'
import {Navbar, Nav, NavItem, Button, Form, FormGroup, Label, Input, FormText} from 'reactstrap'

import './App.css';

import Register from './components/register'
import Login from './components/login'
import UserList from './components/userList'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {
        username: "",
        password: ""
      },
      users: []
    }
  }

  render() {
    return (
      <div className="user-model">
        <Route  path = '/register' component = {Register} />
        <Route path = '/login' component = {Login} />
        <Route path = '/userlist' render = {(props) => <UserList {...props} user = {this.state.user} />} />
        <h1>User Router</h1>
        <NavLink to = '/register'><Button>Register</Button></NavLink>
        <NavLink to = '/login'><Button>Login</Button></NavLink>
        <NavLink to = '/userlist'><Button>View Users</Button></NavLink>
      </div>
    );
  }
}

export default App;
