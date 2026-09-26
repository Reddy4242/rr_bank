
import { useState } from "react"

const slides = [
    {
        eyebrow: "SMARTER MONEY HABITS",
        title: "See your money clearly. Plan what comes next.",
        description: "Track spending, build budgets, and understand your progress from one simple dashboard.",
        primaryButton: "Start tracking",
        secondaryButton: "See how it works",
    },
    {
        eyebrow: "BUDGET WITH CONFIDENCE",
        title: "Give every category a confident limit.",
        description: "Create monthly budgets and receive clear warnings before your spending goes off track.",
        primaryButton: "Build a budget",
        secondaryButton: "Explore budgets",
    },
    {
        eyebrow: "UNDERSTAND YOUR PROGRESS",
        title: "Turn everyday spending into smarter decisions.",
        description: "Explore simple reports that reveal where your money goes and how your habits change.",
        primaryButton: "View reports",
        secondaryButton: "See insights",
    },
]
function HeroSlider() {
    const [activeSlide, setActiveSlide] = useState(0)
    const currentSlide = slides[activeSlide]

    function showNextSlide() {
        if (activeSlide === slides.length - 1) {
            setActiveSlide(0)
        }
        else {
            setActiveSlide(activeSlide + 1)
        }
    }
    function showPreviousSlide() {
        if (activeSlide === 0) {
            setActiveSlide(slides.length - 1)
        }
        else {
            setActiveSlide(activeSlide - 1)
        }
    }

    return (
        <section id="home" className="hero-slider" aria-label="RR Bank highlights">
            <article className="hero-slide">
                <div className="hero-copy">
                    <p className="hero-eyebrow">{currentSlide.eyebrow}</p>
                    <h1>{currentSlide.title}</h1>
                    <p className="hero-description">{currentSlide.description}</p>
                    <div className="hero-actions">
                        <button type="button" className="button button-primary">{currentSlide.primaryButton}</button>
                        <button type="button" className="button button-secondary">{currentSlide.secondaryButton}</button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="card-back" aria-hidden="true"></div>
                    <div className="bank-card">
                        <p className="card-label">RR BANK · PERSONAL</p>
                        <p className="card-number">•••• 4242</p>
                        <p className="card-name">RAJA REDDY</p>
                    </div>
                </div>
            </article>
            <div className="slider-controls">
                <button type="button" className="slider-previous" onClick={showPreviousSlide} aria-label="show previous slide">&larr;</button>
                <div className="slider-dots">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.title}
                            type="button"
                            className={
                                index === activeSlide
                                    ? "slider-dot slider-dot-active"
                                    : "slider-dot"
                            }
                            onClick={() => setActiveSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === activeSlide ? "true" : undefined}
                        ></button>
                    ))}
                </div>
                <button type="button" className="slider-next" onClick={showNextSlide} aria-label="Show next slide">→</button>
            </div>
        </section>
    )
}

export default HeroSlider