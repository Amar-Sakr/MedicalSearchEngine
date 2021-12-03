import { Link } from "react-router-dom"
import { useState,useEffect } from "react"
import Button from "./Button"

const Result = ({pages=[], query}) => {
    const [newPages,setPages]= useState(pages)
    const [newQuery,setQuery]= useState(query)
    const [showLogin,setShowLogin]= useState(false)
    let token = JSON.parse( localStorage.getItem('token') ) 
    
    useEffect(()=>{
        if(newQuery){
            fetch('http://localhost:7777/search_data/', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({"email":token.email,"query":newQuery, "pages":newPages}),
            })
        }

    },[newPages])

    const onSubmit = (e) => {
        e.preventDefault()
        if(!newQuery){
            alert('Please add a word !')
            return
        }
        fetchpages(newQuery)
        console.log(newPages)
    
    }

    const fetchpages= (query)=>{
        fetch(`http://localhost:7777/search_query/?query=${query}`)
        .then((response)=> response.json())
        .then((json)=> setPages(json));
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

    const getData = (props)=>{
        const url = props.target.parentNode.parentNode.href
        const title = props.target.innerHTML
        console.log({"url":url,"title":title})
        fetch('http://localhost:7777/get_article/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({"email":token.email,"search_Query":newQuery,"url":url,"title":title}),
        })
        
    }
 
    return (
        <div className= "result">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div className="search_box">
                <div>
                    <Link to="/" className="result_icon"><h2>Medical Search</h2></Link>
                </div>
                <form  onSubmit={onSubmit}>
                    <div className="search__input">
                        <input 
                        type="text" 
                        placeholder="Search.." 
                        name="search" 
                        value= {newQuery}
                        onChange= {(e) => setQuery(e.target.value)}
                        />
                        <button className="submit" type="submit"><i class="fa fa-search"></i></button>
                    </div>
                </form>
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
            <hr />
            <div className="docs" >
                { newPages.map((doc, index)=>(<div className="block">
                    <a  key={index} href={doc.url} target="_blank" rel="noreferrer" onClick={getData}>
                        <div key={index} className="task" >
                            <h3>{doc.brief_title}</h3>
                            <p>{doc.brief_summary}</p>
                        </div>
                    </a>
                    <div className="props">
                        <div className="prop">
                            <label>Technicality:</label>
                            <input type="range" id="cellWidth" min="0" max="100" value={doc.Ease_of_reading} disabled=""></input>
                            <output>{doc.Ease_of_reading}</output>
                        </div><div></div>
                        <div className="prop">
                            <label>Readability: </label>
                            <input type="range" id="cellWidth" min="0" max="100" value={doc.Political_bias} disabled=""></input>
                            <output>{doc.Political_bias}</output>
                        </div>
                        <div className="prop">
                            <label>Level of Evidence: </label>
                            <input type="range" id="cellWidth" min="0" max="100" value={doc.Sentiment} disabled=""></input>
                            <output>{doc.Sentiment}</output>
                        </div><div></div>
                        <div className="prop">
                            <label>Stage of Treatment: </label>
                            <input type="range" id="cellWidth" min="0" max="100" value={doc.Objectivity} disabled=""></input>
                            <output>{doc.Objectivity}</output>
                        </div>
                    </div>
                </div>   
                ))}
                {newPages.length===0 && 
                    <h3 className="notFound">
                        Your search - {newQuery} - did not match any document
                    </h3>
                }
            </div>
        </div>
    )
}

export default Result
