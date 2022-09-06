import { useNavigate } from "react-router-dom";
import { React, useState} from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import Profile from "./Profile";

export default function User(params) {
    const [user, setUser] = useState({});

    var date = new Date();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    const GET_USER = gql`
    {
        user 
        {
          _id
          name
          username
          familyId
          paid
          payments
          {month
          year}
          accountNumber
          bankCode
        }
    }
`
const { data, loading, error } = useQuery(GET_USER, {
    onCompleted: (data) => {
        setUser(data.user)
        console.log(data.user)
    }
});

if (loading) return <progress className="progress is-medium is-dark" max="100">45%</progress>
if (error) return <div>Error {error.message}</div>

    return (
        <div className="columns">
        <div className="column is-full-mobile is-one-third-tablet">
        <Profile user={user}/>
        {user.paid !== true &&
            <div className="block">
                <div className="card">
                    <div className="card-content">
                        <div className="content">
                            <div>Tento měsíc zatím není zaplacen!</div>
                            {/* <img src={`http://api.paylibo.com/paylibo/generator/czech/image
                            ?accountNumber=${user.accountNumber}
                            &bankCode=${user.bankCode}
                            &amount=50
                            &currency=CZK
                            &message=Platba spotify ${user.name} ${month}/${year}`}
                            style="min-width: 100%;"/> */}
                        </div>
                    </div>
                </div>
            </div>}
            {user.paid &&
                <div className="notification is-primary">
                    <p>Pro tento měsíc již máte zaplaceno.</p>
                </div>
            }
        </div>
        <div className="column is-full-mobile is-two-thirds-tablet">
            <div className="block">
                <div className="card">
                    <div className="card-content">
                        <div className="content">
                            <table className="table is-fullwidth is-striped is-hoverable">
                                <thead>
                                    <tr>
                                        <th>Měsíc</th>
                                        <th>Rok</th>
                                    </tr>
                                </thead>
                                <tbody>                                    
                                    {
                                        user.payments.map((payment, key) => (
                                            <tr key={key}>
                                            {/* *className="is-selected" */}
                                            <td>{payment.month}</td>
                                            <td>{payment.year}</td>
                                        </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}