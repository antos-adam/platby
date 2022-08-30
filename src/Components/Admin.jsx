import Profile from "./Profile"
import { useQuery, gql, useMutation } from "@apollo/client";
import { React, useState } from "react";

export default function Admin(params) {
    const [user, setUser] = useState({});
    const [users, setUsers] = useState([]);
    const [selectedPayments, setSelectedPayments] = useState([]);
    var newUser = {}
    var newPayment = {}
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
    const [addUser, addResp] = useMutation(ADD_USER)

    function addUserHandler() {
        console.log(newUser)
        addUser({
            variables: {
                user: newUser
            }
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
    const [addPayment, addPaymentResp] = useMutation(ADD_PAYMENT)

    function addPaymentHandler() {
        console.log(newPayment)
        addPayment({
            variables: {
                payment: newPayment
            }
        })
        console.log(addPaymentResp)
    }

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
    }
`
    const { data, loading, error } = useQuery(GET_USER, {
        onCompleted: (data) => {
            setUser(data.user)
        }
    });

    const GET_USERS = gql`
    {
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
    const { dataUsers, loadingUsers, errorUsers } = useQuery(GET_USERS, {
        onCompleted: (data) => {
            setUsers(data.users)
        }
    });

    console.log(selectedPayments)

    //console.log(users.find(e => e.usename === selectedPayments))

    if (loading) return <progress className="progress is-medium is-dark" max="100">45%</progress>
    if (error) return <div>Error</div>
    if(user.isAdmin !== true) return <div>Přístup odepřen!</div>

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
                                            <label for="" className="label">Jméno:</label>
                                        </div>
                                        <div className="field-body">
                                            <div className="field">
                                                <div className="control is-expanded">
                                                    <div className="select is-fullwidth">
                                                        <select onChange={e => newPayment.username = e.target.value} autofocus>
                                                        {users.map(user =>
                                                            <option value={user.username}>{user.name}</option>
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
                                                    <input onChange={e => newPayment.month = parseFloat(e.target.value)} className="input" type="number" min="1" max="12" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field is-horizontal">
                                        <div className="field-label is-normal">
                                            <label for="" className="label">Rok:</label>
                                        </div>
                                        <div className="field-body">
                                            <div className="field">
                                                <div className="control is-expanded">
                                                    <input onChange={e => newPayment.year = parseFloat(e.target.value)} className="input" type="number" min="2022" max="2035" />
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
                                                <input onChange={e => newUser.username = e.target.value} className="input" type="text" />
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
                                                <input onChange={e => newUser.password = e.target.value} className="input" type="text" />
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
                                                <input onChange={e => newUser.name = e.target.value} className="input" type="text" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <footer className="card-footer">
                                <div className="card-footer-item">
                                    <button onClick={e => addUserHandler()} className="button is-left is-primary is-light is-medium is-fullwidth">Přidat člena</button>
                                </div>
                                {/* <div className="card-footer-item">
                            <input className="button is-right is-danger is-light is-medium is-fullwidth" type="submit" name="admin-deleteuser" value="Odebrat člena"/>
                        </div> */}
                            </footer>
                        </div>
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
                        <form action="" method="post">
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
                                                    <select onChange={e => setSelectedPayments(JSON.parse(e.target.value))} autofocus>
                                                        {users.map(user =>
                                                            <option value={JSON.stringify(user.payments)}>{user.name}</option>
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
                        </form>
                    </div>
                </div >
                {selectedPayments !== [] &&
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
                                                <th>Smazat</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPayments.map(payment =>(
                                                <tr>
                                                    <td>{payment.month}</td>
                                                    <td>{payment.year}</td>
                                                    <td>vy vývoji</td>
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
                <Profile user={user} />
            </div >
        </div >
    )
}