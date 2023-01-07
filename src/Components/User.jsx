import React from "react";
import { useQuery, gql } from "@apollo/client";
import Profile from "./Profile";

export default function User() {
    const thisMonth = new Date().getMonth() + 1;
    const thisYear = new Date().getFullYear();

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
const { data, loading, error } = useQuery(GET_USER);

if (loading) return <progress className="progress is-medium is-dark" max="100">45%</progress>
if (error) return <div>Error {error.message}</div>

    return (
        <div className="columns">
        <div className="column is-full-mobile is-one-third-tablet">
        <Profile user={data.user}/>
        {data.user.paid !== true &&
            <div className="block">
                <div className="card">
                    <div className="card-content">
                        <div className="content">
                            <div>Tento měsíc zatím není zaplacen!</div>
                            {data.user.accountNumber &&<img alt="platebni QR kod" src={`http://api.paylibo.com/paylibo/generator/czech/image?accountNumber=${data.user.accountNumber}&bankCode=${data.user.bankCode}&amount=50&currency=CZK&message=Platba spotify ${data.user.name} ${thisMonth}/${thisYear}`}
                            />}
                        </div>
                    </div>
                </div>
            </div>}
            {data.user.paid &&
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
                                        structuredClone(data.user.payments).sort((a, b) => (a.month < b.month ? -1 : 1)).sort((a, b) => (a.year < b.year ? -1 : 1)).map((payment, key) => (
                                        <tr key={key} className={(thisMonth === payment.month && thisYear === payment.year) ? "is-selected" : ""}>
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