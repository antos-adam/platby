import { React, useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router';
import { useQuery, gql } from "@apollo/client"
import { useAuthContext, SET_JWT, LOG_OUT } from "../Providers/AuthProvider"

import { Buffer } from "buffer"

export default function Login() {
  const [{jwt}, dispatch] = useAuthContext()
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, serErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(true);
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
		if(jwt) {
			console.log(jwt)
			var today = new Date();
			today.setHours(today.getHours() + 1);
			if (today <= JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString()).exp * 1000) {
				setSkip(false)
			}
			else {
				dispatch({ type: LOG_OUT })
			}
		} 
    // eslint-disable-next-line
	}, [])

  const { loadingGql, errorGql } = useQuery(GET_USER, {
    skip: skip,
    onCompleted: (data) => {
        if (!errorGql) {
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
				dispatch({ type: SET_JWT, payload: {jwt: response.data.access_token} })
				setError(false)
        setLoading(false);
        if (response.data.isAdmin) { navigate("admin"); }
        else { navigate("user") }
      })
      .catch(function (error) {
        setError(true);
        serErrorMessage(error.message);
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
              <h1 className="is-size-4">P??ihl????en??</h1>
            </div>
            <div className="block">
              <div className="field">
                <div className="control has-icons-left">
                  <input onChange={e => setUsername(e.target.value)} type="text" className="input" placeholder="Jm??no" required="required" />
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
                <button onClick={GetJWT} className="button is-medium is-fullwidth is-primary">P??ihl??sit se</button>
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