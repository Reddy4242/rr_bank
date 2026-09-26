


const steps = [
    {
        number: "01",
        title: "Create your account",
        description: "Set up your profile and prepare your personal financial workspace.",
    },

    {
        number: "02",
        title: "Organize your money",
        description: "Record transactions and create realistic budgets for your spending categories.",
    },

    {
        number: "03",
        title: "Follow your progress",
        description: "Use your dashboard and reports to understand patterns and make better decisions.",
    },
]



function HowItWorksSection() {
    return (
        <section id="how-it-works" className="how-it-works-section">
            <div className="how-it-works-heading">
                <p className="how-it-works-eyebrow">HOW IT WORK</p>
                <h2>A clearer financial picture in three simple steps.</h2>
                <p className="how-it-works-description">Organize your money,build a practical plan, and follow your progress.</p>
            </div>

            <div className="steps-grid">
                {steps.map((step) => (
                    <article className="step-card" key={step.number}>
                        <span className="step-number">{step.number}</span>
                        <h3>{step.title}</h3>
                        <p>{step.description}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default HowItWorksSection