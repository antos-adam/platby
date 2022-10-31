import { React, useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router';
import { useQuery, gql } from "@apollo/client"

export default function Login(params) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, serErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(true);

  const TOKEN_STORAGE_KEY = "token-storage-key"
  const GET_USER = gql`
  {
      user 
      {
        _id
        isAdmin
      }
  }
  `

  useEffect(() => {
    if(localStorage.getItem(TOKEN_STORAGE_KEY) !== null) {
      setSkip(false);
    }
  })

  const { data, loadingGql, errorGql } = useQuery(GET_USER, {
    skip: skip,
    onCompleted: (data) => {
        if (!errorGql) {
          console.log(data)
          if(data.user.isAdmin) {navigate("admin")}
          else {navigate("user")}
        }
    }
});

  async function GetJWT() {
    setLoading(true);
    axios.post('https://api.platby.tk/login', {
      username: username,
      password: password
    }, { headers: { 'Content-Type': 'application/json' } })
      .then(function (response) {
        localStorage.setItem(TOKEN_STORAGE_KEY, response.data.access_token)
        setError(false);
        //setLoading(false);
        if (response.data.isAdmin) { navigate("admin"); }
        else { navigate("user") }
        window.location.reload();
      })
      .catch(function (error) {
        setError(true);
        serErrorMessage(error.message);
        console.log(error);
        setLoading(false);
      });
  }

  if (loading) return <progress className="progress is-medium is-dark" max="100">45%</progress>
  if (loadingGql) return <progress className="progress is-medium is-dark" max="100">45%</progress>

  return (
    <>
      <div className="columns login">
        <div className="column has-text-centered is-full-mobile is-half-tablet is-one-third-desktop">
          <div className="form-login box">
            <div className="block">
              <h1 className="is-size-4">Přihlášení</h1>
            </div>
            <div className="block">
              <div className="field">
                <div className="control has-icons-left">
                  <input onChange={e => setUsername(e.target.value)} type="text" className="input" placeholder="Jméno" required="required" />
                  <span className="icon is-small is-left">
                    <i className="fas fa-user"></i>
                  </span>
                </div>
              </div>
              <div className="field">
                <div className="control has-icons-left">
                  <input onChange={e => setPassword(e.target.value)} type="password" className="input" placeholder="Heslo" required="required" />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="field">
              <div className="control has-text-centered">
                <button onClick={GetJWT} className="button is-medium is-fullwidth is-primary">Přihlásit se</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {error && <article className="login">
        <div className="message-header has-background-danger">
          <p>Chyba!</p>
        </div>
        <div className="message-body">
          {errorMessage}
        </div>
      </article>}
    </>
  )
}