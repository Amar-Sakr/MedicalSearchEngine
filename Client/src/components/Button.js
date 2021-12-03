const Button = ({onclick}) => {

    let token = JSON.parse( localStorage.getItem('token') )

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <button className="Add" onClick={onclick}>
                {/* <i class="fa fa-sign-in" style={{"color":"#1589FF"}}></i> */}
                {token && token.name[0].toUpperCase()}
            </button>  
        </>
    )
}

export default Button
