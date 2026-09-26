
const features = [
    {
        title: "Dashboard overview",
        description: "View balances, recent activity, and budget progress from one clear screen.",
    },

    {
        title: "Clear transactions",
        description: "See your income and spending together in one organized timeline.",
    },

    {
        title: "Flexible budgets",
        description: "Set category limits and receive clear warnings before your spending goes off track.",
    },

    {
        title: "Helpful reports",
        description: "Discover spending patterns and understand how your financial habits change over time.",
    },
]


function FeaturesSection() {
    return (
        <section id="features" className="features-section">
            <div className="features-heading">
                <p className="features-eyebrow">EVERYTHING IN ONE PLACE</p>
                <h2>Simple tools for smarter money decisions.</h2>
                <p className="features-description">Track your activity, control your budget, and understand your financial progress.</p>
            </div>
            <div className="features-grid">
                {features.map((feature) => (
                    <article className="feature-card" key={feature.title}>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default FeaturesSection