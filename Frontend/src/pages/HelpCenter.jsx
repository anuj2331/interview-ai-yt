import React from 'react'
import { Link } from 'react-router'
import ThemeToggle from '../components/ThemeToggle'
import './info-pages.scss'

const HelpCenter = () => {
    return (
        <div className="info-page-container">
            <header className="info-header-bar">
                <Link to="/" className="back-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Dashboard
                </Link>
                <ThemeToggle />
            </header>

            <main className="info-content-card">
                <h1>Help Center &amp; FAQ</h1>
                <p className="last-updated">Everything you need to know about using Interview AI</p>

                <section className="info-section">
                    <h2>How do I generate an Interview Strategy?</h2>
                    <p>
                        Simply paste the target job description into the main card on your dashboard, upload your resume (PDF or DOCX format) or type a quick self-description, and click <strong>Generate My Interview Strategy</strong>.
                    </p>
                </section>

                <section className="info-section">
                    <h2>How is the Match Score calculated?</h2>
                    <p>
                        Our AI analyzes the required skills and experience level in the job description against your resume or profile. The match score reflects how closely your current background matches the target position.
                    </p>
                </section>

                <section className="info-section">
                    <h2>Can I download my tailored resume or report?</h2>
                    <p>
                        Yes! Inside any generated interview strategy view, click the <strong>Download Resume</strong> button on the left sidebar to export a PDF report.
                    </p>
                </section>

                <section className="info-section">
                    <h2>Need further assistance?</h2>
                    <p>
                        If you encounter any issues or have feedback, feel free to reach out to our team at <strong>support@interview-ai.com</strong>.
                    </p>
                </section>
            </main>
        </div>
    )
}

export default HelpCenter
