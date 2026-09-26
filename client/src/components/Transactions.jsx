
import { useState, useEffect } from 'react'

function Transactions() {
    const [searchTerm, setSearchTerm] = useState('')
    const [transactions, setTransactions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [transactionName, setTransactionName] = useState('')
    const [transactionCategory, setTransactionCategory] = useState('')
    const [transactionDate, setTransactionDate] = useState('')
    const [transactionAmount, setTransactionAmount] = useState('')
    const [transactionType, setTransactionType] = useState('expense')

    useEffect(() => {
        fetch('/api/transactions')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Unable to load transactions.')
                }

                return response.json()
            })
            .then((data) => {
                setTransactions(data)
                setIsLoading(false)
            })

            .catch(() => {
                setError('Unable to load transactions.')
                setIsLoading(false)
            })

    }, [])

    function handleAddTransaction(event) {
        event.preventDefault()

        const formattedDate =
            new Date(`${transactionDate}T00:00:00`).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            })

        const currencyAmount = Number(transactionAmount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        })

        let formattedAmount

        if (transactionType === 'expense') {
            formattedAmount = `-${currencyAmount}`
        }
        else {
            formattedAmount = `+${currencyAmount}`
        }

        const newTransaction = {
            name: transactionName,
            category: transactionCategory,
            date: formattedDate,
            amount: formattedAmount,
            type: transactionType,
        }


        fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTransaction),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Unable to add transaction.')
                }

                return response.json()
            })
            .then((savedTransaction) => {
                setTransactions((currentTransactions) => [
                    ...currentTransactions,
                    savedTransaction,
                ])

                setTransactionName('')
                setTransactionCategory('')
                setTransactionDate('')
                setTransactionAmount('')
                setTransactionType('expense')
            })

            .catch(() => {
                setError('Unable to add transaction.')
            })
    }

    const visibleTransactions = transactions.filter((transaction) =>
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    )


    return (
        <main className="transactions-page">
            <section className="transactions-heading">
                <p className="transaction-eyebrow">TRANSACTION HISTORY</p>
                <h1>Every move, accounted for.</h1>
                <p className="transaction-description">Make sense of every deposit, payment, and purchase.</p>
            </section>

            <section className="transaction-form-section">
                <h2>Add a transaction</h2>

                <form className="transaction-form" onSubmit={handleAddTransaction}>
                    <div className="transaction-form-field">
                        <label htmlFor="new-transaction-name">Name</label>
                        <input
                            id="new-transaction-name" type="text" required
                            placeholder="Example: Coffee shop"
                            value={transactionName}
                            onChange={(event) => setTransactionName(event.target.value)}
                        />
                    </div>

                    <div className="transaction-form-field">
                        <label htmlFor="new-transaction-category">Category</label>
                        <input
                            id="new-transaction-category"
                            type="text" required
                            placeholder="Example: Food"
                            value={transactionCategory}
                            onChange={(event) => setTransactionCategory(event.target.value)}
                        />
                    </div>

                    <div className="transaction-form-field">
                        <label htmlFor="new-transaction-date">Date</label>
                        <input
                            id="new-transaction-date"
                            type="date" required
                            value={transactionDate}
                            onChange={(event) => setTransactionDate(event.target.value)}
                        />
                    </div>

                    <div className="transaction-form-field">
                        <label htmlFor="new-transaction-amount">Amount</label>
                        <input
                            id="new-transaction-amount"
                            type="number" required
                            min="0"
                            step="0.01"
                            placeholder="Example: 5.00"
                            value={transactionAmount}
                            onChange={(event) => setTransactionAmount(event.target.value)}
                        />
                    </div>

                    <div className="transaction-form-field">
                        <label htmlFor="new-transaction-type">Type</label>
                        <select
                            id="new-transaction-type"
                            value={transactionType}
                            onChange={(event) => setTransactionType(event.target.value)}
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                    <button type="submit">Add transaction</button>
                </form>
            </section>

            <section className="transactions-history">
                <h2>All transactions</h2>
                <div className="transactions-search">
                    <label htmlFor="transaction-search">Search transactions</label>
                    <input id="transaction-search" type="search" placeholder="Search by name or category"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>
                <ul className="transaction-list">
                    {isLoading && <p>Loading transactions...</p>}
                    {error && <p>{error}</p>}
                    {!isLoading && !error && visibleTransactions.length === 0 && (<p>No transactions found.</p>)}
                    {visibleTransactions.map((transaction) => (
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

export default Transactions
