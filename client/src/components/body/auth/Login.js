import React, { useState }
    from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification';
const initialState = {

    email: '',
    password: '',
    err: '',
    success: ''
}
function Login() {
    const [user, setUser] = useState(initialState)
    const { email, password, err, success } = user
    const handleChangeInput = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value, err: '', success: '' })
    }

    const handleSubmit = async e => {
        e.preventDefauft()
        try {
            const res = await axios.post('/user/login', { email, password })
            console.log(res)
        } catch (error) {
            err.response.data.msg && setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }
    return (
        <div className="login_page">
            <h2>Login</h2>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            <form onSubmit={handleSubmit}>
                <div>
                    <label
                        htmlFor="email Address">Email Address </label>
                    <input type="text" placeholder="Enter email address" id="email" value={email} name="email" onChange={handleChangeInput} />


                </div>
                <div>
                    <label
                        htmlFor="password">password </label>
                    <input type="current-password" placeholder="Enter password " id="password" value={password} name="password" onChange={handleChangeInput} />


                </div>
                <div className="row">
                    <button type="submit">Login</button>
                    <Link to="/forgot_password">Forgot your password?</Link>
                </div>

            </form>

        </div>
    )
}
export default Login