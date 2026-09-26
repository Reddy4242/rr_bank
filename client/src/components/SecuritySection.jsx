function SecuritySection() {
    return (
        <section id="security" className="security-section">
            <div className="security-copy">
                <p className="security-eyebrow">SECURITY-MINDED BY DESIGN</p>
                <h2>Your financial information deserves thoughtful protection.</h2>
                <p className="security-description">
                    RR Bank uses protected account access, validated inputs, and carefully scoped data handling throughout the application.
                </p>
            </div>
            <ul className="security-list">
                <li className="security-item">
                    <strong>Protected account access</strong>
                    <span>Private pages are available only to authenticated users.</span>
                </li>

                <li className="security-item">
                    <strong>Validated information</strong>
                    <span>Inputs are checked before information is accepted or stored.</span>
                </li>

                <li className="security-item">
                    <strong>Private personal records</strong>
                    <span>Each user can access only the financial records connected to their account.</span>
                </li>
            </ul>
        </section>
    )
}

export default SecuritySection