import { useState, useEffect } from "react"
import { useHistory } from "react-router"
import React from "react"
import PropagateLoader from "react-spinners/PropagateLoader";
import Button from "./Button";
import { Link } from "react-router-dom";

const SrchField = ({getQuery, getPages}) => {
    const [pages,setpages]= useState([])
    const [query,setQuery]= useState('') 
    const history=useHistory();
    const [loading, setLoading]= useState(false)
    const [showLogin,setShowLogin]= useState(false)
    let token = JSON.parse( localStorage.getItem('token') )

    useEffect(() =>{
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    },[loading])

    useEffect(()=>{
        console.log(pages)
        getPages(pages)
    },[pages, getPages])

    const onSubmit= (e) => {
        e.preventDefault()

        if(!query){
            alert('Please add a word !')
            return
        }
        fetchpages(query)
        getQuery(query)
        
        if(token){
            if(token.status===200){
                setTimeout(() => {  history.push({pathname:'/result',}); }, 1500);
                setLoading(true)
            }
            else{ history.push({pathname:'/login'}) }
        }
        
    }

    const fetchpages= (query)=>{
        fetch(`http://localhost:7777/search_query/?query=${query}`)
        .then((response)=> response.json())
        .then((json)=> setpages(json));
    }

    // show login
    const onClick= () =>{
        setShowLogin(!showLogin)
    }

    const logout = () =>{
        fetch('http://localhost:7777/logout/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(token),
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
        }) 
        localStorage.removeItem('token')
    }

    return (
        <div>
            {loading ? 
                <div style={{"position":"absolute","top":"50%", "left":"50%", "transform":"translate(-50%,-50%)"}}>
                    <PropagateLoader  color={'#1589FF'} loading={loading} size={15} />
                </div> :
                <div className="grid">
                    <div></div>
                    <div className="container"> 
                        <h1 className="App-header">Medical Search</h1><br />
                        <form className="form-control" onSubmit={onSubmit}> 
                            <input
                                className="input"
                                type="text"
                                placeholder=" What are you looking for?"
                                value= {query}
                                onChange= {(e) => setQuery(e.target.value)}
                            />
                            <input type="submit" value="Search" className="btn btn-block"/>
                        </form>
                    </div> 
                    <div>
                        <Button  onclick={onClick} />
                        {showLogin &&
                            <div className= "loginContainer">
                                <Link style={{"textDecoration": "none"}} to="/login">
                                    <input type="submit" value="Log Out" className="btn btn-block" onClick={logout} />
                                </Link>               
                            </div>
                        }
                    </div>
                </div>           
            }
        </div>
    )
}

export default SrchField
