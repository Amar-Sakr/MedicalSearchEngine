import './App.css';
import { Redirect } from 'react-router';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useState } from 'react';
import LoginForm from './components/LoginForm';
import SrchField from './components/SrchField';
import Result from './components/Result';
import SignUpForm from './components/SignUpForm';

function App() {
  const [pages,setPages]= useState([])
  const [query,setQuery]= useState('')
  let token = JSON.parse( localStorage.getItem('token') )

  const getQuery= (key) =>{
    setQuery(key)
  }

  const getPages= (pages) =>{
    setPages(pages)
  }

  
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          {token && token.status===200 ? 
            <SrchField getQuery={getQuery} getPages={getPages}/>
            : <Redirect to='/login' />
          }
        </Route>

        <Route path='/login' exact>
            <LoginForm />
            { token && token.status===200 &&  <Redirect to='/' /> }
        </Route>

        <Route path='/signup' exact>
          <div>
            <SignUpForm />
            { token && token.status===200 &&  <Redirect to='/' /> }
          </div>
        </Route>

        <Route path='/result' exact>
            {token && token.status===200? 
              <Result pages={pages} query={query} />
              : <Redirect to='/login' />
            }
        </Route>

      </Switch>
    </Router>
  );
}

export default App;