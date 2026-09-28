import React from 'react'
import { Link } from 'react-router'
import ThemeToggle from '../components/ThemeToggle'
import './info-pages.scss'

const PrivacyPolicy = () => {
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
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: September 15, 2026</p>

                <section className="info-section">
                    <h2>1. Information We Collect</h2>
                    <p>
                        Interview AI collects information you directly provide when using our platform. This includes:
                    </p>
                    <ul>
                        <li><strong>Account Information:</strong> Username, email address, and encrypted passwords.</li>
                        <li><strong>Interview Input Data:</strong> Target job descriptions, self-descriptions, and uploaded resume documents (PDF, DOCX).</li>
                    </ul>
                </section>

                <section className="info-section">
                    <h2>2. How We Use Your Data</h2>
                    <p>
                        Your information is used solely to provide personalized technical &amp; behavioral interview preparation strategies and skill-gap analysis. We process your resume and job description using secure AI models to generate tailored interview questions and roadmap plans.
                    </p>
                </section>

                <section className="info-section">
                    <h2>3. Data Protection &amp; Confidentiality</h2>
                    <p>
                        We prioritize the security of your professional profile and resumes. We do not sell your personal data or use your resumes for training third-party public AI models. All file uploads are stored securely and accessible only by you.
                    </p>
                </section>

                <section className="info-section">
                    <h2>4. Your Privacy Rights</h2>
                    <p>
                        You have full control over your stored interview reports and profile data. You can delete your generated plans or account data at any time from your dashboard.
                    </p>
                </section>
            </main>
        </div>
    )
}

export default PrivacyPolicy
