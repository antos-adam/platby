import { useNavigate } from "react-router-dom";
import { React, useState } from "react"
import { gql, useMutation } from "@apollo/client";

export default function Profile(props) {
    const navigate = useNavigate();
	const TOKEN_STORAGE_KEY = "token-storage-key"
    const [password, setPassword] = useState("");

    const CHANGE_PASS = gql`
    mutation ($password: String!)
    {
        changePassword(password: $password) 
        {
            _id
        }
    }
    `
    const [changePassword] = useMutation(CHANGE_PASS)

    function changePasswordHandler() {
        changePassword({
            variables: {
                password: password
            }
        })
    }


    async function LogOut() {
        console.log(localStorage.getItem(TOKEN_STORAGE_KEY));
		localStorage.removeItem(TOKEN_STORAGE_KEY)
		navigate("/");
	}

    return (
        <>
        <div className="block">
        <div className="card">
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">
                        Uživatelské informace
                    </p>
                </header>
                <div className="card-content">
                    <div className="content">
                        <p>
                            Přihlášen jako {props.user.name} ({props.user.username})
                            <br/>
                            (skupina {props.user.familyId})
                        </p>
                    </div>
                </div>
                <footer className="card-footer">
                        <button onClick={e => LogOut()} className="button is-dark is-fullwidth is-medium">Odhlásit se</button>
                </footer>
            </div>
        </div>
    </div>
    <div className="block">
        <div className="card">
            <header className="card-header">
                <p className="card-header-title">
                    Změna hesla
                </p>
            </header>
                <div className="card-content">
                    <div className="content">
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Heslo:</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control is-expanded">
                                        <input onChange={e => setPassword(e.target.value)} className="input" type="password" required="required"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <button onClick={e => changePasswordHandler()} className="button is-light is-medium is-fullwidth">Změnit heslo</button>
                </div>
        </div>
    </div>
    </>
    )
}