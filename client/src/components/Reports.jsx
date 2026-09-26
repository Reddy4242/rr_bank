import { useState, useEffect } from 'react'



function Reports() {
    const [report, setReport] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/reports')
            .then((response) => response.json())
            .then((data) => {
                setReport(data)
                setIsLoading(false)
            })

            .catch(() => {
                setError('Unable to load report.')
                setIsLoading(false)
            })
    }, [])

    if (isLoading) {
        return <main className="reports-page">Loading report...</main>
    }

    if (error) {
        return <main className="reports-page">{error}</main>
    }


    return (
        <main className="reports-page">
            <section className="reports-heading">
                <p className="report-eyebrow">REPORTS</p>
                <h1>Understand where your money goes</h1>
                <p className="report-description">See your income and spending at a glance</p>
            </section>

            <section className="reports-summary">
                <h2>{report.month} overview</h2>

                <div className="report-grid">
                    <article className="report-card">
                        <h3>Total income</h3>
                        <p>
                            {report.totalIncome.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </p>
                    </article>

                    <article className="report-card">
                        <h3>Total spending</h3>
                        <p>
                            {report.totalSpending.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </p>
                    </article>

                    <article className="report-card">
                        <h3>Net change</h3>
                        <p>
                            {report.netChange.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </p>
                    </article>
                </div>
            </section>

            <section className="reports-breakdown">
                <h2>Spending by category</h2>

                <ul className="report-category-list">
                    {report.categorySpending.map((item) => (
                        <li key={item.category}>
                            <span>{item.category}</span>
                            <span>{item.spent.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    )
}

export default Reports