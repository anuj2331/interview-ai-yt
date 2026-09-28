import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from '../../../components/ThemeToggle.jsx'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const user = await handleLogin({ email, password })
            if (user) {
                navigate('/')
            }
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Login failed. Please check your credentials.")
        }
    }

    if (loading) {
        return (<main className='loading-screen'><h1>Loading.......</h1></main>)
    }

    return (
        <main className='auth-main'>
            <div className="form-container">
                <div className="auth-top-bar">
                    <ThemeToggle />
                </div>
                <h1>Login</h1>
                {error && <div className="error-message" style={{ color: '#e53e3e', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' required />
                    </div>
                    <button className='button primary-button'>Login</button>
                </form>
                <p>Don't have an account? <Link to={"/register"}>Register</Link> </p>
            </div>
        </main>
    )
}

export default Login