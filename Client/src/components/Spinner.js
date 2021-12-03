import React from 'react'
import './login.css'
import ClipLoader from "react-spinners/ClipLoader";

const Spinner = () => {
    return (
        <div className="spinnerDiv">
            <ClipLoader /* color={'#1589FF'} */ loading={true} size={35}/> 
        </div>
    )
}

export default Spinner
