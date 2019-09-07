import React from 'react'
import {Button, Form, FormGroup, Label, Input, FormText} from 'reactstrap'
import axios from 'axios'

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: ""
        }
    }

    handleChanges = e => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        })
    }

    submit = e => {
        e.preventDefault()
        const {username, password} = this.state
        const user = this.state
        axios.post('http://localhost:4000/api/login', user)
            .then((res) => {
                console.log(res.data)
                this.props.history.push('/')
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        const {username, password} = this.state

        return (
            <div className = 'login'>
                <h2>Login</h2>
                <Form>
                    <FormGroup>
                        <Label for = 'username'>Username</Label>
                        <Input type = 'text' name = 'username' placeholder = 'Username' value = {username} onChange = {this.handleChanges} />
                    </FormGroup>
                    <FormGroup>
                        <Label for = 'password'>Password</Label>
                        <Input type = 'text' name = 'password' placeholder = 'Password' value = {password} onChange = {this.handleChanges} />
                    </FormGroup>
                    <Button onClick = {this.submit}>Login</Button>
                </Form>
            </div>
        )
    }
}

export default Login