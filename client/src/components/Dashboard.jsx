
import { useState, useEffect } from 'react'


const summaryCards = [
    {
        label: "Total balance",
        value: "$12,480.50",
        detail: "Across checking and savings"
    },

    {
        label: "Monthly income",
        value: "$5,250.00",
        detail: "Up 4.8% from last month"
    },

    {
        label: "Monthly spending",
        value: "$3,180.40",
        detail: "61% of this month's income"
    }

]




function Dashboard() {
    const [transactions, setTransactions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/transactions')
            .then((response) => response.json())
            .then((data) => {
                setTransactions(data)
                setIsLoading(false)
            })

            .catch(() => {
                setError('Unable to load recent transactions.')
                setIsLoading(false)
            })
    }, [])


    return (
        <main className="dashboard-page">
            <section className="dashboard-heading">
                <p className="section-eyebrow">FINANCIAL OVERVIEW</p>
                <h1>Your money at a glance.</h1>
                <p>Review your balances, spending, and recent activity.</p>
            </section>

            <section className="dashboard-summary">
                {summaryCards.map((card) => (
                    <article className="summary-card" key={card.label}>
                        <p>{card.label}</p>
                        <h2>{card.value}</h2>
                        <p>{card.detail}</p>
                    </article>
                ))}
            </section>

            <section className="dashboard-transactions">
                <h2>Recent transactions</h2>
                {isLoading && <p>Loading recent transactions...</p>}
                {isLoading && <p>Loading recent transactions...</p>}
                {error && <p>{error}</p>}

                <ul className="transaction-list">
                    {transactions.slice(0, 3).map((transaction) => (
                        <li className="transaction-row" key={transaction.id}>
                            <p>{transaction.name}</p>
                            <p>{transaction.category}</p>
                            <p>{transaction.date}</p>
                            <p>{transaction.amount}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    )
}

export default Dashboard