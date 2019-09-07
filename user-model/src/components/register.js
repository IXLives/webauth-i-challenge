import React from 'react'
import {withRouter} from 'react-router-dom'
import {Button, Form, FormGroup, Label, Input, FormText} from 'reactstrap'

class Register extends React.Component {
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
    }

    render() {
        const {username, password} = this.state

        return (
            <div className = 'registration'>
                <h2>Register</h2>
                <Form>
                    <FormGroup>
                        <Label for = 'username'>Username</Label>
                        <Input type = 'text' name = 'username' placeholder = 'Username' value = {username} onChange = {this.handleChanges} />
                    </FormGroup>
                    <FormGroup>
                        <Label for = 'password'>Password</Label>
                        <Input type = 'text' name = 'password' placeholder = 'Password' value = {password} onChange = {this.handleChanges} />
                    </FormGroup>
                    <Button onClick = {this.submit}>Register</Button>
                </Form>
            </div>
        )
    }
}

export default Register