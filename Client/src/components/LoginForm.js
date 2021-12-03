import './login.css';
import React from "react"
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import Spinner from './Spinner';

const LoginForm = () => {
    const [loading, setLoading]= useState(false)
    const [response, setResponse] = useState({})
    const [data,setData] = useState({
        email:"",
        password:""
    })
    const email_pattern = "^[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[A-Za-z]+$"
    
   useEffect(() =>{  
        if (response['status'] === 200){
            window.location.reload(false)
            
        };
        setLoading(false)
    },[response])

    const onSubmit = (e) =>{
        e.preventDefault()
        if(!(data.email&&data.password)){
            alert('Please add a User !')
            return
        }

        if(! RegExp(email_pattern).test(data.email)){
            alert('Please add a correct email !')
            return
        }

        fetch('http://localhost:7777/login/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => res.json())
        .then(res => {
            setResponse(res);
            console.log(res);
            localStorage.setItem('token',JSON.stringify(res))
        }) 
        
        setLoading(true)
    }

    const handle =(e)=> {
        const newData={...data}
        newData[e.target.id]= e.target.value
        setData(newData)
    }

    return (
        <div className="bg">
            <div className="containers" id="container">
                <div className="form-container sign-in-container">
                    {loading && <Spinner />}
                    <form className="form" action="#">
                        <h1 className="h1">Sign in</h1>
                        <div className="social-container">
                        </div>
                        <input  className="Input" 
                            type="email" 
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) => handle(e)}
                            id="email"
                            required
                        />
                        <input className="Input" 
                            type="password" 
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => handle(e)}
                            id="password"
                            required
                        />
                        <a className="a" href="/signup">Forgot your password?</a>
                        <button className="Button" onClick={onSubmit}>Sign In</button>
                        <br/><br/>
                        {response['status']===400 && <p>{response['error']}</p>}
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-right">
                            <h1 className="h1">Hello, Friend!</h1>
                            <p className="p">Enter your personal details and start journey with us</p>
                            <Link to="/signup"><button className="Button ghost" id="signUp">Sign Up</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginForm