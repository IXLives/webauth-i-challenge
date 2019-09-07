import React from 'react'
import axios from 'axios'

class UserList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user: {
                username: this.props.username,
                password: this.props.password
            },
            users: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/api/users')
            .then(res => {
                console.log(res.data)
                this.setState({users: res.data})
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <h2>User List</h2>
        )
    }
}

export default UserList