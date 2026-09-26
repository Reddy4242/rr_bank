import { Link } from 'react-router'

function CallToActionSection() {
    return (
        <section className="cta-section" aria-labelledby="cta-title">
            <div className="cta-content">
                <p className="cta-eyebrow">READY TO TAKE CONTROL?</p>

                <h2 id="cta-title">Build a clearer plan for your money.</h2>

                <p className="cta-description">
                    Create your RR Bank workspace and turn everyday financial activity into decisions you can understand.
                </p>

                <div className="cta-actions">
                    <Link to="/create-account" className="button button-primary">
                        Create your account
                    </Link>

                    <a href="#how-it-works" className="button button-secondary">
                        See how it works
                    </a>
                </div>
            </div>
        </section>
    )
}

export default CallToActionSection
