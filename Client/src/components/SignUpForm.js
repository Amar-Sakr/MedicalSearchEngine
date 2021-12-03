import './login.css';
import React from "react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { Link } from 'react-router-dom';
import Spinner from './Spinner';

const SignUpForm = () => {
    const [loading, setLoading]= useState(false)
    const history = useHistory();
    const [response, setResponse] = useState({})
    const [data,setData] = useState({
        name: "",
        email:"",
        password:""
    })
    const email_pattern = "^[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[A-Za-z]+$"

    useEffect(() =>{  
        if (response['status'] === 200){
            history.push("/login")
        };
        setLoading(false)
    },[response, history])

    const onSubmit = (e) =>{
        e.preventDefault()

        if(!(data.name&&data.email&&data.password)){
            alert('Please fill up all information !')
            return
        }

        if(! RegExp(email_pattern).test(data.email)){
            alert('Please add a correct email !')
            return
        }

        fetch('http://localhost:7777/signup/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => res.json()) 
        .then(res => {setResponse(res);console.log(res)})
        
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
                <form className="form" action="#">
                        <h1 className="h1">Create Account</h1>
                        <div className="social-container">
                        </div>
                        <input className="Input" 
                            type="text" 
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => handle(e)}
                            id="name"
                            required
                        />
                        <input className="Input" 
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
                        <button className="Button" onClick={onSubmit}>Sign Up</button>
                        <br/><br/>
                        {response['status']===400 && <p>{response['error']}</p>}
                        
                    </form>
                    {loading && <Spinner />}
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-right">
                            <h1 className="h1">Welcome Back!</h1>
                            <p className="p">To keep connected with us please login with your personal info</p>
                            <Link to="/login"><button className="Button ghost" id="signIn">Sign In</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpForm