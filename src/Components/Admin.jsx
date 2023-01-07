import Profile from "./Profile"
import { useQuery, gql, useMutation } from "@apollo/client";
import { React, useState, useEffect } from "react";

export default function Admin(params) {
    const [newUser, setNewUser] = useState({})
    const [newPayment, setNewPayment] = useState({});

    const thisMonth = new Date().getMonth() + 1;
    const thisYear = new Date().getFullYear();

    const GET_USER = gql`
    {
        user 
        {
          _id
            name
            isAdmin
          username
          familyId
          payments {month
          year}
        }
        users
        {
          _id
            name
          username
          payments {month
          year}
        }
    }
`   
    const { data, loading, error } = useQuery(GET_USER);
    const ADD_USER = gql`
    mutation ($user: RegisterUserInput!)
    {
        registerUser(registerUserInput: $user) 
        {
            _id
            username
            name
            familyId
            payments {month
            year}
        }
    }
    `
    const [addUser] = useMutation(ADD_USER)

    function addUserHandler() {
        addUser({
            variables: {
                user: newUser
            }
        }).finally(() => {
            setNewUser({username: "", password: "", name: ""})
        })
    }

    const ADD_PAYMENT = gql`
    mutation ($payment: AddPaymentInput!)
    {
        addPayment(addPaymentInput: $payment) 
        {
            _id
            username
            name
            familyId
            payments {month
            year}
        }
    }
    `
    const [addPayment] = useMutation(ADD_PAYMENT)

    function addPaymentHandler() {
        addPayment({
            variables: {
                payment: newPayment
            }
        })
    }

    useEffect(() => {
        var today = new Date();
        setNewPayment({...newPayment, month: today.getMonth() + 1, year: today.getFullYear()})
    // eslint-disable-next-line
    }, [])

    if (loading) return <progress className="progress is-medium is-dark" max="100">45%</progress>
    if (error) return <div>Error {error.message}</div>
    if (data.user.isAdmin !== true) return <div>Přístup odepřen!</div>

    return (
        <div className="columns">
            <div className="column is-full-mobile is-one-third-tablet">
                <div className="block">
                    <div className="card">
                        <header className="card-header">
                            <p className="card-header-title">
                                Vložit platbu
                            </p>
                        </header>
                        <div className="card-content">
                            <div className="content">
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                        <label className="label">Jméno:</label>
                                    </div>
                                    <div className="field-body">
                                        <div className="field">
                                            <div className="control is-expanded">
                                                <div className="select is-fullwidth">
                                                    <select onChange={e => setNewPayment({...newPayment, username: e.target.value}) } value={newPayment.username}>
                                                        {!newPayment.username &&<option>Vyberte uživatele</option>}
                                                        {data.users.map((user, index) =>
                                                            <option key={index} value={user.username}>{user.name}</option>
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                        <label className="label">Měsíc:</label>
                                    </div>
                                    <div className="field-body">
                                        <div className="field">
                                            <div className="control is-expanded">
                                                <input onChange={e => setNewPayment({...newPayment, month: parseFloat(e.target.value) }) } value={newPayment.month} className="input" type="number" min="1" max="12" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                        <label className="label">Rok:</label>
                                    </div>
                                    <div className="field-body">
                                        <div className="field">
                                            <div className="control is-expanded">
                                                <input onChange={e => setNewPayment({...newPayment, year: parseFloat(e.target.value) })} value={newPayment.year} className="input" type="number" min="2022" max="2035" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer className="card-footer">
                            <button onClick={e => addPaymentHandler()} className="button is-fullwidth is-medium is-primary">Přidat platbu</button>
                        </footer>
                    </div>
                </div>
                <div className="block">
                    <div className="card">
                        <header className="card-header">
                            <p className="card-header-title">
                                Správa členů
                            </p>
                        </header>
                        <div className="card-content">
                            <div className="content">
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                        <label className="label">Username:</label>
                                    </div>
                                    <div className="field-body">
                                        <div className="field">
                                            <div className="control is-expanded">
                                                <input onChange={e => setNewUser({...newUser, username: e.target.value})} value={newUser.username} className="input" type="text" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                        <label className="label">Heslo:</label>
                                    </div>
                                    <div className="field-body">
                                        <div className="field">
                                            <div className="control is-expanded">
                                                <input onChange={e => setNewUser({...newUser, password: e.target.value})} value={newUser.password} className="input" type="text" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                        <label className="label">Jméno a příjmení:</label>
                                    </div>
                                    <div className="field-body">
                                        <div className="field">
                                            <div className="control is-expanded">
                                                <input onChange={e => setNewUser({...newUser, name: e.target.value})} value={newUser.name} className="input" type="text" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer className="card-footer">
                                <button onClick={e => addUserHandler()} className="button is-fullwidth is-medium is-primary">Přidat člena</button>
                                {/* <div className="card-footer-item">
                            <input className="button is-right is-danger is-light is-medium is-fullwidth" type="submit" name="admin-deleteuser" value="Odebrat člena"/>
                        </div> */}
                        </footer>
                    </div>
                </div>
            </div >
            <div className="column is-full-mobile is-one-third-tablet">
                <div className="block">
                    <div className="card">
                        <header className="card-header">
                            <p className="card-header-title">
                                Seznam plateb
                            </p>
                        </header>
                        <div className="card-content">
                            <div className="content">
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                        <label className="label">Jméno:</label>
                                    </div>
                                    <div className="field-body">
                                        <div className="field">
                                            <div className="control is-expanded">
                                                <div className="select is-fullwidth">
                                                    <select value={newPayment.username} onChange={e => setNewPayment({...newPayment, username: e.target.value})}>
                                                        {!newPayment.username &&<option>Vyberte uživatele</option>}
                                                        {data.users.map((user) =>
                                                            <option key={user._id} value={user.username}>{user.name}</option>
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <footer className="card-footer">
                                <input className="button is-light is-medium is-fullwidth" type="submit" name="admin-showpayments" value="Zobrazit platby" />
                            </footer> */}
                    </div>
                </div >
                {newPayment.username &&
                    <div className="block">
                        <div className="card">
                            <div className="card-content">
                                <div className="content">
                                    <div className="table-container">
                                        <table className="table is-fullwidth is-hoverable has-text-centered">
                                            <thead>
                                                <tr>
                                                    <th>Měsíc</th>
                                                    <th>Rok</th>
                                                    {/* <th>Smazat</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {structuredClone(data.users.find(x => x.username === newPayment.username).payments).sort((a, b) => (a.month < b.month ? -1 : 1)).sort((a, b) => (a.year < b.year ? -1 : 1)).map((payment, index) => (
                                                    <tr key={index} className={(thisMonth === payment.month && thisYear === payment.year) ? "is-selected" : ""}>
                                                        <td>{payment.month}</td>
                                                        <td>{payment.year}</td>
                                                        {/* <td>ve vývoji</td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >}
            </div >
            <div className="column is-full-mobile is-one-third-tablet">
                <Profile user={data.user} />
            </div >
        </div >
    )
}