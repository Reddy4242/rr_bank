
import { useState, useEffect } from 'react'





function Budgets() {
    const [budgets, setBudgets] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    useEffect(() => {
        fetch('/api/budgets')
            .then((response) => response.json())
            .then((data) => {
                setBudgets(data)
                setIsLoading(false)
            })

            .catch(() => {
                setError('Unable to load budgets.')
                setIsLoading(false)
            })
    }, [])
    return (
        <main className="budgets-page">
            <section className="budgets-heading">
                <p className="budget-eyebrow">MONTHLY BUDGETS</p>
                <h1>Give your money a plan.</h1>
                <p className="budget-description">Track your spending by category and see what remains this month.</p>
            </section>

            <section className="budgets-list">
                <h2>Category budgets</h2>
                {isLoading && <p>Loading budgets...</p>}
                {error && <p>{error}</p>}
                <div className="budget-grid">
                    {budgets.map((budget) => (
                        <article className="budget-card" key={budget.category}>
                            <h3>{budget.category}</h3>
                            <p>Spent: ${budget.spent}</p>
                            <p>Limit: ${budget.limit}</p>
                            <meter
                                className="budget-meter"
                                value={Math.min(budget.spent, budget.limit)}
                                max={budget.limit}
                                low={budget.limit * 0.8}
                                high={budget.limit * 0.95}
                                optimum={0}
                                aria-label={budget.category + " budget used"}
                            />
                            {budget.spent > budget.limit ? (
                                <p>Over budget: ${budget.spent - budget.limit}</p>
                            ) : (
                                <p>Remaining: ${budget.limit - budget.spent}</p>
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </main>
    )
}

export default Budgets