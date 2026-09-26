import rrBankLogo from "../assets/rr-bank-logo.png"
function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="site-footer">
            <div className="footer-main">
                <a href="#home" className="footer-brand" aria-label="RR Bank home">
                    <img src={rrBankLogo} alt="" />
                    <span>
                        <strong>RR Bank</strong>
                        <small>Money, made clear.</small>
                    </span>
                </a>
                <nav aria-label="Footer navigation">
                    <ul className="footer-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#dashboard">Dashboard</a></li>
                        <li><a href="#transactions">Transactions</a></li>
                        <li><a href="#budgets">Budgets</a></li>
                        <li><a href="#reports">Reports</a></li>
                    </ul>
                </nav>
            </div>
            <div className="footer-bottom">
                <p>&copy; {currentYear} RR Bank. Portfolio demonstration project.</p>
                <p>Use demonstration data only.</p>
            </div>
        </footer>
    )
}

export default Footer