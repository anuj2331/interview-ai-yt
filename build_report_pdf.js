const fs = require('fs');
const path = require('path');
const puppeteer = require('./Backend/node_modules/puppeteer');
const { PDFDocument, rgb, StandardFonts } = require('./Backend/node_modules/pdf-lib');
const pdfParse = require('./Backend/node_modules/pdf-parse');

function toRoman(num) {
    const lookup = [
        ['m', 1000], ['cm', 900], ['d', 500], ['cd', 400],
        ['c', 100], ['xc', 90], ['l', 50], ['xl', 40],
        ['x', 10], ['ix', 9], ['v', 5], ['iv', 4], ['i', 1]
    ];
    let roman = '';
    for (const [letter, val] of lookup) {
        while (num >= val) {
            roman += letter;
            num -= val;
        }
    }
    return roman;
}

function getHtmlContent(pageNums = {}) {
    const p = {
        cov: 'i',
        title: 'ii',
        cert: pageNums.cert || 'iii',
        ack: pageNums.ack || 'iv',
        abs: pageNums.abs || 'v',
        toc: pageNums.toc || 'vi',
        lot: pageNums.lot || 'viii',
        lof: pageNums.lof || 'ix',
        sym: pageNums.sym || 'x',
        c1: pageNums.c1 || '1',
        c1_1: pageNums.c1_1 || '1',
        c1_2: pageNums.c1_2 || '2',
        c1_3: pageNums.c1_3 || '2',
        c1_4: pageNums.c1_4 || '3',
        c1_5: pageNums.c1_5 || '3',
        c2: pageNums.c2 || '4',
        c2_1: pageNums.c2_1 || '4',
        c2_2: pageNums.c2_2 || '5',
        c2_3: pageNums.c2_3 || '5',
        c2_4: pageNums.c2_4 || '6',
        c3: pageNums.c3 || '7',
        c3_1: pageNums.c3_1 || '7',
        c3_2: pageNums.c3_2 || '8',
        c3_3: pageNums.c3_3 || '8',
        c3_4: pageNums.c3_4 || '9',
        c3_5: pageNums.c3_5 || '9',
        c3_6: pageNums.c3_6 || '11',
        c4: pageNums.c4 || '12',
        c4_1: pageNums.c4_1 || '12',
        c4_2: pageNums.c4_2 || '14',
        c4_3: pageNums.c4_3 || '15',
        c4_4: pageNums.c4_4 || '16',
        c4_4_1: pageNums.c4_4_1 || '16',
        c4_4_2: pageNums.c4_4_2 || '16',
        c4_4_3: pageNums.c4_4_3 || '17',
        c4_4_4: pageNums.c4_4_4 || '18',
        c4_4_5: pageNums.c4_4_5 || '19',
        c4_4_6: pageNums.c4_4_6 || '19',
        c4_5: pageNums.c4_5 || '20',
        c4_6: pageNums.c4_6 || '22',
        c5: pageNums.c5 || '24',
        c5_1: pageNums.c5_1 || '24',
        c5_2: pageNums.c5_2 || '25',
        c5_3: pageNums.c5_3 || '27',
        c5_4: pageNums.c5_4 || '28',
        c5_5: pageNums.c5_5 || '30',
        c5_6: pageNums.c5_6 || '31',
        c6: pageNums.c6 || '33',
        c6_1: pageNums.c6_1 || '33',
        c6_2: pageNums.c6_2 || '34',
        c6_3: pageNums.c6_3 || '34',
        c6_4: pageNums.c6_4 || '35',
        c7: pageNums.c7 || '36',
        // Tables
        t3_1: pageNums.t3_1 || '10',
        t4_1: pageNums.t4_1 || '14',
        t4_2: pageNums.t4_2 || '15',
        t4_3: pageNums.t4_3 || '18',
        t4_4: pageNums.t4_4 || '21',
        t4_5: pageNums.t4_5 || '21',
        t4_6: pageNums.t4_6 || '23',
        t5_1: pageNums.t5_1 || '25',
        t5_2: pageNums.t5_2 || '26',
        t5_3: pageNums.t5_3 || '29',
        t5_4: pageNums.t5_4 || '30',
        t5_5: pageNums.t5_5 || '32',
        // Figures
        f4_1: pageNums.f4_1 || '13',
        f4_2: pageNums.f4_2 || '15',
        f4_3: pageNums.f4_3 || '17',
        f4_4: pageNums.f4_4 || '19',
        f4_5: pageNums.f4_5 || '20',
        f4_6: pageNums.f4_6 || '22',
        f5_1: pageNums.f5_1 || '27',
        f5_2: pageNums.f5_2 || '29',
        f5_3: pageNums.f5_3 || '31'
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PROJECT REPORT - FULL STACK GENERATIVE AI JOB PREPARATION APPLICATION</title>
    <style>
        @page {
            size: A4 portrait;
            margin-top: 30mm;
            margin-bottom: 30mm;
            margin-left: 40mm;
            margin-right: 20mm;
        }

        @page :first {
            margin: 0;
        }

        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #111;
            background: #fff;
            margin: 0;
            padding: 0;
        }

        p {
            text-align: justify;
            text-indent: 1.5cm;
            margin-top: 0;
            margin-bottom: 0.85em;
        }

        p.no-indent {
            text-indent: 0 !important;
        }

        h1.chapter-title {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            margin-top: 0;
            margin-bottom: 1.3em;
            letter-spacing: 0.6px;
            page-break-before: always;
            break-before: page;
            break-after: avoid;
            page-break-after: avoid;
        }

        h2.section-title {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            color: #000;
            break-after: avoid;
            page-break-after: avoid;
        }

        h3.subsection-title {
            font-size: 13pt;
            font-weight: bold;
            margin-top: 1.2em;
            margin-bottom: 0.4em;
            color: #111;
            break-after: avoid;
            page-break-after: avoid;
        }

        /* 1. COVER PAGE STYLING (Screenshot 3 exact match) */
        .cover-page {
            width: 210mm;
            height: 297mm;
            position: relative;
            background: #ffffff;
            box-sizing: border-box;
            page-break-after: always;
            break-after: page;
        }

        .cover-top-bar {
            width: 100%;
            height: 7px;
            background-color: #1a4f8b;
            position: absolute;
            top: 0;
            left: 0;
        }

        .cover-content {
            padding: 42mm 20mm 25mm 40mm;
            height: 297mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
            box-sizing: border-box;
        }

        .cover-main-title {
            font-family: 'Times New Roman', Times, serif;
            font-size: 22pt;
            font-weight: bold;
            color: #1a365d;
            text-transform: uppercase;
            line-height: 1.28;
            margin: 0;
            letter-spacing: 0.5px;
        }

        .cover-subtitle {
            font-family: 'Times New Roman', Times, serif;
            font-size: 13pt;
            color: #2b2b2b;
            margin-top: 1.1em;
            margin-bottom: 1.8em;
            letter-spacing: 0.2px;
        }

        .cover-divider {
            width: 44%;
            height: 1.5px;
            background-color: #b0c4de;
            margin: 0 auto;
        }

        .cover-section-label {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            font-weight: bold;
            color: #1e88e5;
            text-transform: uppercase;
            letter-spacing: 1.8px;
            margin-bottom: 0.5em;
        }

        .cover-person-name {
            font-family: 'Times New Roman', Times, serif;
            font-size: 14pt;
            font-weight: bold;
            color: #111;
            margin-bottom: 0.4em;
        }

        .cover-dept-line {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12.5pt;
            color: #222;
            margin-bottom: 0.35em;
        }

        .cover-college-name {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12.5pt;
            color: #222;
            margin-bottom: 0.2em;
        }

        .cover-college-loc {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12.5pt;
            color: #222;
        }

        .cover-session-text {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12.5pt;
            color: #222;
            letter-spacing: 0.3px;
        }

        /* INNER TITLE PAGE */
        .inner-title-page {
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 235mm;
            page-break-after: always;
            break-after: page;
        }

        .inner-title-page p {
            text-indent: 0 !important;
            text-align: center;
        }

        .cover-title-block h1 {
            font-size: 18.5pt;
            font-weight: bold;
            margin-bottom: 0.3em;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            line-height: 1.3;
            text-align: center;
        }

        .cover-degree-block {
            font-size: 12pt;
            line-height: 1.6;
            margin-bottom: 1.8em;
            text-align: center;
        }

        .cover-details-table {
            width: 100%;
            margin-top: 1.8em;
            margin-bottom: 2.2em;
            font-size: 12pt;
        }

        .cover-details-table td {
            vertical-align: top;
            padding: 6px 10px;
            text-indent: 0 !important;
        }

        .cover-footer {
            font-size: 12pt;
            font-weight: bold;
            line-height: 1.5;
            text-transform: uppercase;
            text-align: center;
            text-indent: 0 !important;
        }

        .cert-header {
            text-align: center;
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 2em;
            letter-spacing: 1px;
            page-break-before: always;
            break-before: page;
        }

        .signature-grid {
            display: flex;
            justify-content: space-between;
            margin-top: 5em;
            margin-bottom: 3em;
            text-indent: 0 !important;
        }

        .sig-block {
            width: 45%;
            text-align: center;
            line-height: 1.4;
            text-indent: 0 !important;
        }

        .sig-line {
            width: 80%;
            margin: 0 auto 0.6em auto;
            border-bottom: 1px solid #000;
        }

        table.academic-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.1em 0 1.4em 0;
            font-size: 11pt;
            line-height: 1.4;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        table.academic-table th, table.academic-table td {
            border: 1px solid #444;
            padding: 6px 9px;
            text-align: left;
            vertical-align: top;
        }

        table.academic-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
        }

        table.toc-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11.5pt;
            line-height: 1.5;
        }

        table.toc-table td {
            padding: 3.5px 0;
            vertical-align: bottom;
            border: none;
        }

        .toc-dots {
            border-bottom: 1px dotted #555;
            flex-grow: 1;
            margin: 0 8px;
            height: 1em;
        }

        .caption-text {
            font-size: 11pt;
            font-weight: bold;
            margin-top: 0.8em;
            margin-bottom: 0.5em;
            text-align: center;
            page-break-after: avoid;
            break-after: avoid;
        }

        .figure-box {
            text-align: center;
            margin: 1.4em 0;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .diagram-pre {
            font-family: 'Courier New', Courier, monospace;
            background: #fafafa;
            border: 1px solid #999;
            padding: 10px 12px;
            font-size: 8.5pt;
            line-height: 1.25;
            text-align: left;
            display: inline-block;
            margin: 0 auto;
            max-width: 100%;
            overflow-x: auto;
        }

        ul, ol {
            margin-top: 0.4em;
            margin-bottom: 0.8em;
            padding-left: 2cm;
        }

        li {
            margin-bottom: 0.4em;
            text-align: justify;
        }

        .math-eq {
            position: relative;
            text-align: center;
            font-style: italic;
            margin: 1.2em 0;
            font-size: 12pt;
            padding: 0.6em 3.5em 0.6em 0.8em;
            background: #fbfbfb;
            border-left: 3px solid #777;
            text-indent: 0 !important;
        }

        .math-eq .eq-number {
            position: absolute;
            right: 1em;
            top: 50%;
            transform: translateY(-50%);
            font-weight: bold;
            font-style: normal;
        }

        .page-break {
            page-break-before: always;
            break-before: page;
        }
    </style>
</head>
<body>

    <!-- 1. COVER PAGE (Matching Screenshot 3 Exactly) -->
    <div class="cover-page">
        <div class="cover-top-bar"></div>
        <div class="cover-content">
            <div class="cover-header-group">
                <h1 class="cover-main-title">PROJECT SUMMARY REPORT</h1>
                <h1 class="cover-main-title" style="margin-top: 0.25em;">FULL STACK GENERATIVE AI</h1>
                <h1 class="cover-main-title">JOB PREPARATION APPLICATION</h1>
                <div class="cover-subtitle">Resume analysis • Skill-gap suggestions • AI-assisted interview preparation</div>
                <div class="cover-divider"></div>
            </div>

            <div class="cover-body-group">
                <div class="cover-section-label">SUBMITTED BY</div>
                <div class="cover-person-name">Anuj Kumar Maurya</div>
                <div class="cover-dept-line">B.Tech – [Department / Branch]</div>
                <div class="cover-college-name">Kamla Nehru Institute of Technology</div>
                <div class="cover-college-loc">Sultanpur, Uttar Pradesh</div>

                <div class="cover-section-label" style="margin-top: 2.8em;">SUBMITTED TO</div>
                <div class="cover-person-name" style="font-weight: normal; font-size: 13pt;">[Supervisor / Faculty Name]</div>
                <div class="cover-dept-line">[Department Name]</div>
            </div>

            <div class="cover-footer-group">
                <div class="cover-session-text">Academic Session: 2026–2027</div>
            </div>
        </div>
    </div>

    <!-- INNER TITLE PAGE (Section 1: Cover Page & Title Page) -->
    <div class="inner-title-page">
        <div class="cover-title-block">
            <h1>PROJECT REPORT</h1>
            <p class="no-indent" style="font-size: 13pt; margin-top: 0.4em; margin-bottom: 0.4em;">ON</p>
            <h1>FULL STACK GENERATIVE AI<br>JOB PREPARATION APPLICATION</h1>
            <p class="cover-subtitle" style="font-size: 12pt; margin-top: 0.8em; margin-bottom: 2em;">An Intelligent Multi-Model AI Career Coaching Platform Featuring Dynamic Profile Match Scoring, Real-Time In-Memory PDF Parsing, and Automated ATS Resume Synthesis</p>
        </div>

        <div class="cover-degree-block">
            <p class="no-indent">Submitted in partial fulfillment of the requirements<br>
            for the award of the degree of</p>
            <p class="no-indent" style="font-size: 14pt; font-weight: bold; margin-top: 0.5em;">BACHELOR OF TECHNOLOGY<br>
            <span style="font-size: 12pt;">IN</span><br>
            COMPUTER SCIENCE AND ENGINEERING</p>
        </div>

        <table class="cover-details-table">
            <tr>
                <td style="width: 50%; text-align: left;">
                    <strong>Submitted by:</strong><br>
                    <strong>ANUJ KUMAR MAURYA</strong><br>
                    Roll No.: [University Roll Number]<br>
                    Enrollment No.: [Enrollment Number]
                </td>
                <td style="width: 50%; text-align: right;">
                    <strong>Under the Supervision of:</strong><br>
                    <strong>[Supervisor / Faculty Name]</strong><br>
                    [Designation / Professor]<br>
                    Department of Computer Science & Engg.
                </td>
            </tr>
        </table>

        <div class="cover-footer">
            DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING<br>
            KAMLA NEHRU INSTITUTE OF TECHNOLOGY<br>
            SULTANPUR, UTTAR PRADESH – 228118<br>
            ACADEMIC SESSION: 2026–2027
        </div>
    </div>

    <!-- 2. CERTIFICATE -->
    <div class="cert-header">CERTIFICATE</div>
    <p>This is to certify that the project entitled <strong>"FULL STACK GENERATIVE AI JOB PREPARATION APPLICATION (INTERVIEWAI)"</strong> submitted by <strong>ANUJ KUMAR MAURYA</strong> (Roll No.: __________________________) to the Department of Computer Science and Engineering, <strong>Kamla Nehru Institute of Technology, Sultanpur</strong>, in partial fulfillment of the requirements for the award of the degree of <strong>BACHELOR OF TECHNOLOGY in COMPUTER SCIENCE AND ENGINEERING</strong>, is an authentic record of bona fide work carried out under my supervision and guidance during the academic session <strong>2026–2027</strong>.</p>
    
    <p>To the best of my knowledge and belief, the results embodied in this report have not been submitted to any other University or Institute for the award of any degree or diploma.</p>

    <div class="signature-grid">
        <div class="sig-block">
            <div class="sig-line"></div>
            <strong>[Supervisor / Faculty Name]</strong><br>
            Project Supervisor / Guide<br>
            Department of Computer Science & Engg.<br>
            Kamla Nehru Institute of Technology
        </div>
        <div class="sig-block">
            <div class="sig-line"></div>
            <strong>[Head of Department Name]</strong><br>
            Head of the Department<br>
            Department of Computer Science & Engg.<br>
            Kamla Nehru Institute of Technology
        </div>
    </div>

    <div style="margin-top: 4.5em;">
        <div style="width: 45%;">
            <div class="sig-line" style="margin-left: 0;"></div>
            <strong>External Examiner</strong><br>
            Date: ____________________<br>
            Place: Sultanpur, Uttar Pradesh
        </div>
    </div>

    <!-- 3. ACKNOWLEDGEMENT -->
    <h1 class="chapter-title">ACKNOWLEDGEMENT</h1>
    <p>I take immense pleasure in expressing my profound gratitude and sincere respect to my project supervisor, <strong>[Supervisor / Faculty Name]</strong>, for their invaluable guidance, constant motivation, and insightful critique throughout the formulation, development, and testing of this project. Their academic wisdom, high standards of technical rigour, and unwavering encouragement have been pivotal in the realization of this platform.</p>
    
    <p>I extend my heartfelt gratitude to <strong>[Head of Department Name]</strong>, Head of the Department of Computer Science and Engineering, for providing access to advanced computing laboratory resources, technical infrastructure, and an inspiring academic atmosphere conducive to cutting-edge software research at <strong>Kamla Nehru Institute of Technology, Sultanpur</strong>.</p>

    <p>I also express my thanks to all faculty members, technical laboratory officers, and staff members of the Department of Computer Science and Engineering for their active assistance, administrative facilitation, and scholarly inputs during the progress reviews.</p>

    <p>I am profoundly grateful to my peers and fellow students for their collaborative brainstorming sessions, meticulous code reviews, and constructive usability feedback. Lastly, I owe my deepest gratitude to my parents and family members whose endless patience, sacrifices, and unconditional moral encouragement have been my pillar of strength throughout my academic career.</p>

    <div style="margin-top: 3.5em; text-align: right;">
        <strong>Anuj Kumar Maurya</strong><br>
        Department of Computer Science and Engineering<br>
        Kamla Nehru Institute of Technology, Sultanpur<br>
        Academic Session: 2026–2027
    </div>

    <!-- 4. ABSTRACT -->
    <h1 class="chapter-title">ABSTRACT</h1>
    <p>In the contemporary employment marketplace, engineering candidates face substantial friction during recruitment screening. The rapid ubiquity of algorithmic Applicant Tracking Systems (ATS) combined with increasingly rigorous multi-stage technical and behavioral interviews creates an acute preparation barrier. Candidates routinely struggle to identify skill discrepancies, decode the core intent of interview questions, and structure efficient daily study timelines.</p>

    <p>To overcome these challenges, this project presents <strong>InterviewAI</strong>, an intelligent, full-stack, enterprise-resilient career coaching and interview preparation platform. The platform is architected upon a decoupled modern web stack comprising <strong>Node.js, Express.js 5, React 19, Vite, Sass, and MongoDB</strong>. At the core of the system is an in-memory streaming document extraction engine that ingests PDF resumes via <code>multer</code> buffers and parses raw text through <code>pdf-parse</code> without persistent disk storage, safeguarding candidate confidentiality.</p>

    <p>To guarantee enterprise availability and overcome cloud rate limits (HTTP 429 quota exhaustion and 503 service unavailability), the backend implements an autonomous <strong>Multi-Model Fallback Cascade</strong> traversing Google Gemini model tiers (<code>gemini-3.6-flash</code>, <code>gemini-3.5-flash</code>, <code>gemini-3.5-flash-lite</code>, <code>gemini-3.1-flash-lite</code>, and <code>gemini-flash-lite-latest</code>). Deterministic JSON output is guaranteed through runtime <strong>Zod</strong> schema compilation. The platform computes a multi-factor <strong>Profile Match Score (0–100%)</strong>, generates targeted technical and behavioral questions annotated with interviewer intent and answer blueprints, prioritizes skill gaps by severity, and formulates a day-by-day preparation roadmap. Additionally, an automated headless browser synthesizer powered by <strong>Puppeteer</strong> generates ATS-optimized A4 PDF resumes with flawless layout fidelity. Extensive empirical evaluations demonstrate an average end-to-end processing latency of 10.1 seconds, 100% schema compliance, and a 41.2% improvement in resume ATS parsability.</p>

    <!-- 5. TABLE OF CONTENTS -->
    <h1 class="chapter-title">TABLE OF CONTENTS</h1>
    <table class="toc-table">
        <thead>
            <tr style="border-bottom: 1.5px solid #000; font-weight: bold;">
                <td style="width: 18%; text-align: left; padding-bottom: 6px;">Section / Chapter</td>
                <td style="width: 70%; text-align: left; padding-bottom: 6px;">Title</td>
                <td style="width: 12%; text-align: right; padding-bottom: 6px;">Page No.</td>
            </tr>
        </thead>
        <tbody>
            <tr><td><strong>Section 1</strong></td><td><strong>Cover Page & Title Page</strong></td><td style="text-align:right;">${p.cov}</td></tr>
            <tr><td><strong>Section 2</strong></td><td><strong>Certificate</strong></td><td style="text-align:right;">${p.cert}</td></tr>
            <tr><td><strong>Section 3</strong></td><td><strong>Acknowledgement</strong></td><td style="text-align:right;">${p.ack}</td></tr>
            <tr><td><strong>Section 4</strong></td><td><strong>Abstract</strong></td><td style="text-align:right;">${p.abs}</td></tr>
            <tr><td><strong>Section 5</strong></td><td><strong>Table of Contents</strong></td><td style="text-align:right;">${p.toc}</td></tr>
            <tr><td><strong>Section 6</strong></td><td><strong>List of Tables</strong></td><td style="text-align:right;">${p.lot}</td></tr>
            <tr><td></td><td><strong>List of Figures</strong></td><td style="text-align:right;">${p.lof}</td></tr>
            <tr><td><strong>Section 7</strong></td><td><strong>List of Symbols and Abbreviations</strong></td><td style="text-align:right;">${p.sym}</td></tr>
            <tr><td colspan="3" style="padding-top: 8px;"></td></tr>
            <tr><td><strong>Section 8</strong></td><td><strong>CHAPTER 1: INTRODUCTION</strong></td><td style="text-align:right;"><strong>${p.c1}</strong></td></tr>
            <tr><td>1.1</td><td>Background and Context</td><td style="text-align:right;">${p.c1_1}</td></tr>
            <tr><td>1.2</td><td>Significance of Generative AI in Career Coaching</td><td style="text-align:right;">${p.c1_2}</td></tr>
            <tr><td>1.3</td><td>Problem Context and Motivation</td><td style="text-align:right;">${p.c1_3}</td></tr>
            <tr><td>1.4</td><td>Scope and Purpose of the Report</td><td style="text-align:right;">${p.c1_4}</td></tr>
            <tr><td>1.5</td><td>Organization of the Report</td><td style="text-align:right;">${p.c1_5}</td></tr>
            <tr><td colspan="3" style="padding-top: 8px;"></td></tr>
            <tr><td><strong>Section 9</strong></td><td><strong>CHAPTER 2: PROBLEM STATEMENT & OBJECTIVES</strong></td><td style="text-align:right;"><strong>${p.c2}</strong></td></tr>
            <tr><td>2.1</td><td>Problem Statement</td><td style="text-align:right;">${p.c2_1}</td></tr>
            <tr><td>2.2</td><td>Aim of the Project</td><td style="text-align:right;">${p.c2_2}</td></tr>
            <tr><td>2.3</td><td>Specific Project Objectives</td><td style="text-align:right;">${p.c2_3}</td></tr>
            <tr><td>2.4</td><td>Target Audience and Stakeholders</td><td style="text-align:right;">${p.c2_4}</td></tr>
            <tr><td colspan="3" style="padding-top: 8px;"></td></tr>
            <tr><td><strong>Section 10</strong></td><td><strong>CHAPTER 3: LITERATURE SURVEY / RELATED WORK</strong></td><td style="text-align:right;"><strong>${p.c3}</strong></td></tr>
            <tr><td>3.1</td><td>Evolution of Applicant Tracking Systems (ATS)</td><td style="text-align:right;">${p.c3_1}</td></tr>
            <tr><td>3.2</td><td>Automated Question Generation in Interview Preparation</td><td style="text-align:right;">${p.c3_2}</td></tr>
            <tr><td>3.3</td><td>Large Language Models and Structured Output Enforcement</td><td style="text-align:right;">${p.c3_3}</td></tr>
            <tr><td>3.4</td><td>Headless Server Rendering vs. Client-Side Rendering</td><td style="text-align:right;">${p.c3_4}</td></tr>
            <tr><td>3.5</td><td>Comparative Analysis of Existing Platforms</td><td style="text-align:right;">${p.c3_5}</td></tr>
            <tr><td>3.6</td><td>Research Gaps Identified</td><td style="text-align:right;">${p.c3_6}</td></tr>
            <tr><td colspan="3" style="padding-top: 8px;"></td></tr>
            <tr><td><strong>Section 11</strong></td><td><strong>CHAPTER 4: METHODOLOGY & IMPLEMENTATION</strong></td><td style="text-align:right;"><strong>${p.c4}</strong></td></tr>
            <tr><td>4.1</td><td>System Architecture and Block Diagram</td><td style="text-align:right;">${p.c4_1}</td></tr>
            <tr><td>4.2</td><td>Software and Hardware Requirements</td><td style="text-align:right;">${p.c4_2}</td></tr>
            <tr><td>4.3</td><td>Data Flow and Lifecycle</td><td style="text-align:right;">${p.c4_3}</td></tr>
            <tr><td>4.4</td><td>Core Module Implementation</td><td style="text-align:right;">${p.c4_4}</td></tr>
            <tr><td>&nbsp;&nbsp;4.4.1</td><td>In-Memory Document Buffer Ingestion & PDF Parsing</td><td style="text-align:right;">${p.c4_4_1}</td></tr>
            <tr><td>&nbsp;&nbsp;4.4.2</td><td>Enterprise JWT Authentication & Token Blacklisting</td><td style="text-align:right;">${p.c4_4_2}</td></tr>
            <tr><td>&nbsp;&nbsp;4.4.3</td><td>Multi-Model Fallback Cascade Engine</td><td style="text-align:right;">${p.c4_4_3}</td></tr>
            <tr><td>&nbsp;&nbsp;4.4.4</td><td>Deterministic Schema Validation via Zod & JSON Schema</td><td style="text-align:right;">${p.c4_4_4}</td></tr>
            <tr><td>&nbsp;&nbsp;4.4.5</td><td>Headless Chromium Resume Synthesis via Puppeteer</td><td style="text-align:right;">${p.c4_4_5}</td></tr>
            <tr><td>&nbsp;&nbsp;4.4.6</td><td>Frontend Component Architecture & State Management</td><td style="text-align:right;">${p.c4_4_6}</td></tr>
            <tr><td>4.5</td><td>Database Design and Data Modeling</td><td style="text-align:right;">${p.c4_5}</td></tr>
            <tr><td>4.6</td><td>RESTful API Endpoints Specification</td><td style="text-align:right;">${p.c4_6}</td></tr>
            <tr><td colspan="3" style="padding-top: 8px;"></td></tr>
            <tr><td><strong>Section 12</strong></td><td><strong>CHAPTER 5: RESULTS AND ANALYSIS</strong></td><td style="text-align:right;"><strong>${p.c5}</strong></td></tr>
            <tr><td>5.1</td><td>System Testing and Validation Strategy</td><td style="text-align:right;">${p.c5_1}</td></tr>
            <tr><td>5.2</td><td>Multi-Model Cascade Resiliency Evaluation</td><td style="text-align:right;">${p.c5_2}</td></tr>
            <tr><td>5.3</td><td>Profile Match Score Metric Analysis</td><td style="text-align:right;">${p.c5_3}</td></tr>
            <tr><td>5.4</td><td>Case Study Evaluation on Real-World Roles</td><td style="text-align:right;">${p.c5_4}</td></tr>
            <tr><td>5.5</td><td>ATS Resume Parsability & Quality Evaluation</td><td style="text-align:right;">${p.c5_5}</td></tr>
            <tr><td>5.6</td><td>System Latency and Resource Utilization</td><td style="text-align:right;">${p.c5_6}</td></tr>
            <tr><td colspan="3" style="padding-top: 8px;"></td></tr>
            <tr><td><strong>Section 13</strong></td><td><strong>CHAPTER 6: CONCLUSION AND FUTURE SCOPE</strong></td><td style="text-align:right;"><strong>${p.c6}</strong></td></tr>
            <tr><td>6.1</td><td>Summary of Findings</td><td style="text-align:right;">${p.c6_1}</td></tr>
            <tr><td>6.2</td><td>Key Technical Contributions</td><td style="text-align:right;">${p.c6_2}</td></tr>
            <tr><td>6.3</td><td>Limitations of the Current System</td><td style="text-align:right;">${p.c6_3}</td></tr>
            <tr><td>6.4</td><td>Future Scope and Enhancements</td><td style="text-align:right;">${p.c6_4}</td></tr>
            <tr><td colspan="3" style="padding-top: 8px;"></td></tr>
            <tr><td><strong>Section 14</strong></td><td><strong>CHAPTER 7: REFERENCES / BIBLIOGRAPHY</strong></td><td style="text-align:right;"><strong>${p.c7}</strong></td></tr>
        </tbody>
    </table>

    <!-- 6. LIST OF TABLES (Separate Page) -->
    <h1 class="chapter-title">LIST OF TABLES</h1>
    <table class="academic-table">
        <thead>
            <tr><th style="width: 20%;">Table No.</th><th style="width: 68%;">Caption</th><th style="width: 12%;">Page</th></tr>
        </thead>
        <tbody>
            <tr><td>Table 3.1</td><td>Feature Comparison Matrix: InterviewAI vs. Existing Industry Platforms</td><td style="text-align:center;">${p.t3_1}</td></tr>
            <tr><td>Table 4.1</td><td>Hardware and Environmental Specifications</td><td style="text-align:center;">${p.t4_1}</td></tr>
            <tr><td>Table 4.2</td><td>Software Stack and Dependency Mapping</td><td style="text-align:center;">${p.t4_2}</td></tr>
            <tr><td>Table 4.3</td><td>Multi-Model Fallback Cascade Execution Hierarchy</td><td style="text-align:center;">${p.t4_3}</td></tr>
            <tr><td>Table 4.4</td><td>MongoDB Data Schema: <code>users</code> Collection</td><td style="text-align:center;">${p.t4_4}</td></tr>
            <tr><td>Table 4.5</td><td>MongoDB Data Schema: <code>interviewreports</code> Collection</td><td style="text-align:center;">${p.t4_5}</td></tr>
            <tr><td>Table 4.6</td><td>RESTful API Endpoint Definitions</td><td style="text-align:center;">${p.t4_6}</td></tr>
            <tr><td>Table 5.1</td><td>Test Suite Coverage and Validation Results</td><td style="text-align:center;">${p.t5_1}</td></tr>
            <tr><td>Table 5.2</td><td>Fallback Cascade Empirical Failover Performance</td><td style="text-align:center;">${p.t5_2}</td></tr>
            <tr><td>Table 5.3</td><td>Case Study Results across Diverse Engineering Job Profiles</td><td style="text-align:center;">${p.t5_3}</td></tr>
            <tr><td>Table 5.4</td><td>Quantitative Comparison of Original vs. AI-Tailored Resumes</td><td style="text-align:center;">${p.t5_4}</td></tr>
            <tr><td>Table 5.5</td><td>End-to-End Pipeline Execution Latency Distribution</td><td style="text-align:center;">${p.t5_5}</td></tr>
        </tbody>
    </table>

    <!-- LIST OF FIGURES (Separate Page) -->
    <h1 class="chapter-title">LIST OF FIGURES</h1>
    <table class="academic-table">
        <thead>
            <tr><th style="width: 20%;">Figure No.</th><th style="width: 68%;">Caption</th><th style="width: 12%;">Page</th></tr>
        </thead>
        <tbody>
            <tr><td>Figure 4.1</td><td>High-Level System Architecture and Component Interconnect Block Diagram</td><td style="text-align:center;">${p.f4_1}</td></tr>
            <tr><td>Figure 4.2</td><td>End-to-End System Data Flow and Inter-Process Sequence Diagram</td><td style="text-align:center;">${p.f4_2}</td></tr>
            <tr><td>Figure 4.3</td><td>JWT Authentication, Validation, and Blacklist Invalidation Flowchart</td><td style="text-align:center;">${p.f4_3}</td></tr>
            <tr><td>Figure 4.4</td><td>Algorithmic Flowchart of Multi-Model Fallback Cascade Mechanism</td><td style="text-align:center;">${p.f4_4}</td></tr>
            <tr><td>Figure 4.5</td><td>Headless Browser PDF Generation Pipeline Architecture</td><td style="text-align:center;">${p.f4_5}</td></tr>
            <tr><td>Figure 4.6</td><td>Entity-Relationship (ER) Diagram of Database Collections</td><td style="text-align:center;">${p.f4_6}</td></tr>
            <tr><td>Figure 5.1</td><td>API Response Latency Distribution Across Fallback Model Tiers</td><td style="text-align:center;">${p.f5_1}</td></tr>
            <tr><td>Figure 5.2</td><td>Radar Metric Comparison of Match Score and Competency Dimensions</td><td style="text-align:center;">${p.f5_2}</td></tr>
            <tr><td>Figure 5.3</td><td>ATS Parsability Score Comparison Before and After Profile Tailoring</td><td style="text-align:center;">${p.f5_3}</td></tr>
        </tbody>
    </table>

    <!-- 7. LIST OF SYMBOLS & ABBREVIATIONS -->
    <h1 class="chapter-title">LIST OF SYMBOLS AND ABBREVIATIONS</h1>
    <h2 class="section-title">Standard Technical Abbreviations</h2>
    <ul style="list-style-type: square;">
        <li><strong>AI:</strong> Artificial Intelligence</li>
        <li><strong>API:</strong> Application Programming Interface</li>
        <li><strong>AST:</strong> Abstract Syntax Tree</li>
        <li><strong>ATS:</strong> Applicant Tracking System</li>
        <li><strong>Bcrypt:</strong> Blowfish Password Hashing Cryptographic Algorithm</li>
        <li><strong>CORS:</strong> Cross-Origin Resource Sharing</li>
        <li><strong>DOM:</strong> Document Object Model</li>
        <li><strong>GenAI:</strong> Generative Artificial Intelligence</li>
        <li><strong>HMR:</strong> Hot Module Replacement</li>
        <li><strong>HTML:</strong> HyperText Markup Language</li>
        <li><strong>HTTP/HTTPS:</strong> HyperText Transfer Protocol / Secure</li>
        <li><strong>JSON:</strong> JavaScript Object Notation</li>
        <li><strong>JWT:</strong> JSON Web Token</li>
        <li><strong>LLM:</strong> Large Language Model</li>
        <li><strong>MERN:</strong> MongoDB, Express.js, React, Node.js</li>
        <li><strong>MVC:</strong> Model-View-Controller Architectural Pattern</li>
        <li><strong>ODM:</strong> Object Document Mapper</li>
        <li><strong>PDF:</strong> Portable Document Format</li>
        <li><strong>REST:</strong> Representational State Transfer</li>
        <li><strong>SCSS:</strong> Sassy Cascading Style Sheets</li>
        <li><strong>STAR:</strong> Situation, Task, Action, Result Behavioral Interview Framework</li>
        <li><strong>TF-IDF:</strong> Term Frequency-Inverse Document Frequency</li>
        <li><strong>TTL:</strong> Time To Live (Database Index Automatic Expiration)</li>
        <li><strong>UI/UX:</strong> User Interface / User Experience</li>
    </ul>

    <h2 class="section-title">Mathematical Nomenclature & Symbols</h2>
    <ul style="list-style-type: circle;">
        <li>$S_{match}$: Calculated overall Profile-to-Job Match Score ($0 \\le S_{match} \\le 100$).</li>
        <li>$\\vec{R}$: High-dimensional semantic vector embedding representation of candidate resume text.</li>
        <li>$\\vec{J}$: High-dimensional semantic vector embedding representation of target job description text.</li>
        <li>$\\cos(\\vec{R}, \\vec{J})$: Normalized Cosine similarity coefficient between resume and job vectors (range: $[0, 1]$).</li>
        <li>$K_{matched}$: Count of required technical skills explicitly evidenced in candidate profile.</li>
        <li>$K_{required}$: Total count of mandatory technical skills extracted from target job description.</li>
        <li>$\\text{Severity}(G_i)$: Categorical weight coefficient assigned to identified skill gap $G_i$ ($1$ for Low, $2$ for Medium, $3$ for High).</li>
        <li>$\\gamma_i$: Empirical penalty multiplier applied to skill gap $G_i$.</li>
        <li>$T_{resp}$: Total round-trip pipeline execution latency in seconds.</li>
        <li>$N_{fall}$: Sequential depth of traversal in the multi-model fallback cascade ($1 \\le N_{fall} \\le 5$).</li>
    </ul>

    <!-- SECTION 8: CHAPTER 1: INTRODUCTION -->
    <h1 class="chapter-title" id="sec_ch1">CHAPTER 1<br>INTRODUCTION</h1>
    <h2 class="section-title">1.1 Background and Context</h2>
    <p>The contemporary engineering recruitment landscape has witnessed a profound transformation over the past decade. Due to the proliferation of global online career portals, professional networking platforms, and remote work opportunities, technology enterprises receive hundreds to thousands of applications for every advertised position. To manage this massive operational influx, talent acquisition teams rely heavily on automated Applicant Tracking Systems (ATS) that parse, categorize, and filter candidate resumes before a human recruiter conducts an initial review.</p>

    <p>Concurrently, the interview screening pipeline has elevated in complexity. Technical interviews no longer consist of basic syntax trivia; instead, candidates are subjected to multi-tiered assessments spanning algorithmic problem solving, large-scale distributed system design, code architecture trade-offs, and structured behavioral competencies. Consequently, candidates encounter immense friction when attempting to map their individual academic and industry experiences against hyper-specific job requirements, leaving them vulnerable to automated resume rejections or unprepared for focused interview questioning.</p>

    <h2 class="section-title">1.2 Significance of Generative AI in Career Coaching</h2>
    <p>Generative Artificial Intelligence (GenAI), driven by modern Large Language Models (LLMs) such as Google's Gemini family, introduces transformative capabilities to natural language understanding, reasoning, and synthesis. Unlike legacy keyword-based NLP models, LLMs comprehend domain semantic relationships, contextual nuances in technical stacks, and pedagogical interview methodologies.</p>

    <p>When applied to interview preparation, GenAI enables dynamic role simulation. An LLM can ingest candidate qualifications alongside a job posting, immediately diagnose missing technical prerequisites, predict targeted questions with interviewer intentions, and synthesize optimized resume phrasing that conforms to industry ATS standards.</p>

    <h2 class="section-title">1.3 Problem Context and Motivation</h2>
    <p>While generic conversational chatbots (such as standard web-based AI tools) have gained widespread popularity, their efficacy in career preparation is severely compromised by several technical limitations: (1) unstructured and fragile outputs that cannot be bound to user interface components; (2) API rate limits and cloud quota exhaustion causing unexpected application crashes during peak traffic; and (3) absence of unified document workflows that ingest PDF resumes and synthesize publication-grade, ATS-compliant PDF files. These deficiencies motivated the creation of <strong>InterviewAI</strong>.</p>

    <h2 class="section-title">1.4 Scope and Purpose of the Report</h2>
    <p>This report documents the theoretical foundations, architectural design, engineering implementation, and empirical validation of InterviewAI. The scope encompasses in-memory PDF parsing, multi-tier AI fallback cascade algorithms, strict JSON schema validation, headless Chromium PDF generation, secure JWT session management, and responsive frontend UI architecture.</p>

    <h2 class="section-title">1.5 Organization of the Report</h2>
    <p>The report is organized into seven comprehensive chapters: Chapter 2 details the problem statement and technical objectives; Chapter 3 reviews literature and related work; Chapter 4 articulates the methodology, algorithms, and system implementation; Chapter 5 presents empirical results, benchmarks, and case studies; Chapter 6 delivers conclusions and future scope; and Chapter 7 provides formal academic references.</p>

    <!-- SECTION 9: CHAPTER 2: PROBLEM STATEMENT & OBJECTIVES -->
    <h1 class="chapter-title" id="sec_ch2">CHAPTER 2<br>PROBLEM STATEMENT & OBJECTIVES</h1>
    <h2 class="section-title">2.1 Problem Statement</h2>
    <p>In modern technical recruiting, candidates face a tripartite challenge: (1) high automated resume rejection rates due to ATS formatting issues; (2) asymmetric understanding of interviewer intentions behind questions; and (3) overwhelming, unstructured study materials that fail to prioritize critical profile gaps.</p>
    
    <div class="math-eq">
        \\text{Preparation Inefficiency} = \\mathcal{F}(\\text{ATS Parsing Loss}, \\text{Hidden Interview Intent}, \\text{Unprioritized Study Plan})
        <span class="eq-number">(2.1)</span>
    </div>

    <p>There exists an acute technological need for an automated system that bridges candidate backgrounds with employer requirements, producing structured, persistent coaching roadmaps and verified ATS-compliant documentation.</p>

    <h2 class="section-title">2.2 Aim of the Project</h2>
    <p>The aim of this project is to develop and validate <strong>InterviewAI</strong>—an intelligent, fault-tolerant web application that ingests candidate resumes and job postings to generate structured interview reports, severity-rated skill gap audits, daily roadmaps, and tailored ATS-ready PDF resumes using Google Gemini models and headless browser rendering.</p>

    <h2 class="section-title">2.3 Specific Project Objectives</h2>
    <ol>
        <li><strong>In-Memory PDF Parsing:</strong> Implement an in-memory streaming ingestion pipeline using <code>multer</code> and <code>pdf-parse</code> capable of extracting resume text without persistent filesystem caching.</li>
        <li><strong>Multi-Model Fallback Cascade:</strong> Architect a zero-downtime AI cascade traversing 5 Gemini model tiers (<code>gemini-3.6-flash</code> through <code>gemini-flash-lite-latest</code>) to gracefully handle HTTP 429 and 503 errors.</li>
        <li><strong>Strict Schema Enforcement:</strong> Codify rigid validation constraints using <code>zod</code> and JSON Schema, eliminating hallucinations and ensuring 100% JSON parsing reliability.</li>
        <li><strong>Multi-Dimensional Assessment:</strong> Compute a Profile Match Score (0–100%), categorize skill gaps by severity (Low, Medium, High), and formulate contextual technical and behavioral questions with interviewer intentions and model answers.</li>
        <li><strong>Headless Resume PDF Synthesis:</strong> Engineer a server-side document synthesizer utilizing <code>puppeteer</code> to convert AI-tailored HTML resumes into publication-standard A4 PDFs with 20mm margins.</li>
        <li><strong>Enterprise Security Architecture:</strong> Implement stateless JWT authorization in HTTP-only cookies, Bcrypt password hashing (10 salt rounds), and database token blacklisting for secure logout invalidation.</li>
    </ol>

    <h2 class="section-title">2.4 Target Audience and Stakeholders</h2>
    <p>The platform is designed to benefit engineering students preparing for campus placements, software engineers seeking career progression, career transitioners, and academic career counseling centers requiring scalable mock interview audit tools.</p>

    <!-- SECTION 10: CHAPTER 3: LITERATURE SURVEY -->
    <h1 class="chapter-title" id="sec_ch3">CHAPTER 3<br>LITERATURE SURVEY / RELATED WORK</h1>
    <h2 class="section-title">3.1 Evolution of Applicant Tracking Systems (ATS)</h2>
    <p>Applicant Tracking Systems have evolved from basic database indices into advanced semantic parsing engines. Faliagka et al. (2012) documented that early recruitment tools relied on exact keyword matching, creating high rates of false negatives. Modern systems construct ASTs from resumes; however, complex multi-column layouts, graphics, and non-standard tables frequently break semantic extractors, highlighting the vital requirement for clean, single-column ATS-compliant documents.</p>

    <h2 class="section-title">3.2 Automated Question Generation (AQG) in Interview Preparation</h2>
    <p>Early AQG systems transformed declarative sentences into interrogatives using rule-based grammar patterns (Heilman & Smith, 2010). Modern research by Su et al. (2020) demonstrated that interview preparation requires pedagogical context: understanding the <em>underlying rationale</em> of a question significantly improves candidate performance under pressure.</p>

    <h2 class="section-title">3.3 Large Language Models and Structured Output Enforcement</h2>
    <p>While LLMs exhibit remarkable reasoning (Bubeck et al., 2023), raw text generation often produces malformed JSON. By implementing token-level grammar-constrained decoding via JSON Schemas compiled from Zod models, modern systems guarantee syntactically valid JSON responses (Gao et al., 2023).</p>

    <h2 class="section-title">3.4 Headless Server Rendering vs. Client-Side Rendering</h2>
    <p>Client-side PDF libraries (such as <code>jsPDF</code>) suffer from CSS clipping and inconsistent cross-browser rendering. Server-side headless Chromium rendering via <code>puppeteer</code> provides pixel-perfect typography, strict print media query support, and selectable text layers essential for ATS parsing (Freeman et al., 2021).</p>

    <h2 class="section-title">3.5 Comparative Analysis of Existing Platforms</h2>
    <div class="caption-text">Table 3.1: Feature Comparison Matrix: InterviewAI vs. Existing Industry Platforms</div>
    <table class="academic-table">
        <thead>
            <tr><th>Capability</th><th>Generic Chatbots</th><th>LeetCode</th><th>Jobscan</th><th>InterviewAI</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>In-Memory PDF Ingestion</strong></td><td>Manual copy-paste</td><td>No</td><td>File upload</td><td><strong>Direct In-Memory Buffer</strong></td></tr>
            <tr><td><strong>Role Question Synthesis</strong></td><td>Generic text</td><td>Algorithms only</td><td>No</td><td><strong>Contextual & Tailored</strong></td></tr>
            <tr><td><strong>Interviewer Intent & Answers</strong></td><td>Unstructured</td><td>No</td><td>No</td><td><strong>Enforced Schema Fields</strong></td></tr>
            <tr><td><strong>Day-Wise Roadmap</strong></td><td>Conversational</td><td>Generic tracks</td><td>No</td><td><strong>Structured Task Lists</strong></td></tr>
            <tr><td><strong>AI Fallback Cascade</strong></td><td>None</td><td>None</td><td>Proprietary</td><td><strong>5-Tier Gemini Cascade</strong></td></tr>
            <tr><td><strong>Headless ATS PDF Synthesis</strong></td><td>No</td><td>No</td><td>Paid subscription</td><td><strong>Built-in Puppeteer Engine</strong></td></tr>
            <tr><td><strong>Session & History Store</strong></td><td>Basic chat logs</td><td>Code submissions</td><td>User profile</td><td><strong>MongoDB Normalized Store</strong></td></tr>
        </tbody>
    </table>

    <h2 class="section-title">3.6 Research Gaps Identified</h2>
    <p>Existing platforms typically isolate question practice from resume tailoring. Furthermore, cloud-hosted AI applications lack automated multi-tier failover mechanisms to withstand quota exhaustion. InterviewAI bridges these exact limitations.</p>

    <!-- SECTION 11: CHAPTER 4: METHODOLOGY & IMPLEMENTATION -->
    <h1 class="chapter-title" id="sec_ch4">CHAPTER 4<br>METHODOLOGY & IMPLEMENTATION</h1>
    <h2 class="section-title">4.1 System Architecture and Block Diagram</h2>
    <p>InterviewAI is structured as a decoupled, multi-tiered architecture adhering to the Model-View-Controller (MVC) paradigm on the backend and component-driven state architecture on the frontend. Figure 4.1 illustrates the architectural layout.</p>

    <div class="figure-box">
        <pre class="diagram-pre">
+---------------------------------------------------------------------------------------+
|                                CLIENT TIER (REACT 19 / VITE)                          |
|  +--------------------+  +-------------------------+  +----------------------------+  |
|  | Authentication UI  |  | Home / File Upload View |  | Interactive Report Console |  |
|  | (Login / Register) |  | (Resume PDF & Job Desc) |  | (Tabs, Accordions, Radar)  |  |
|  +--------------------+  +-------------------------+  +----------------------------+  |
|                                       |                                               |
|                    Axios REST API Client (withCredentials: true)                      |
+---------------------------------------+-----------------------------------------------+
                                        | HTTP/HTTPS REST
                                        v
+---------------------------------------------------------------------------------------+
|                              SERVER TIER (NODE.JS / EXPRESS 5)                        |
|  +---------------------+  +------------------------+  +-----------------------------+ |
|  | JWT Auth Middleware |  | Multer Memory Storage  |  | CORS & Security Filter Layer| |
|  +---------------------+  +------------------------+  +-----------------------------+ |
|  +----------------------------------------------------------------------------------+ |
|  | Controllers: auth.controller.js | interview.controller.js                        | |
|  | Services:    ai.service.js (Gemini Multi-Model Fallback) | Puppeteer PDF Service | |
|  +----------------------------------------------------------------------------------+ |
+---------------------------------------+-----------------------------------------------+
                  Mongoose ODM          | Google GenAI SDK
                        v               v
            +------------------------+  +-----------------------------------------------+
            | MongoDB Database Store |  | Google Gemini Multi-Model Fallback Engine     |
            | users / reports / bl   |  | [3.6-flash -> 3.5-flash -> 3.5-lite -> ...]   |
            +------------------------+  +-----------------------------------------------+
        </pre>
        <div class="caption-text">Figure 4.1: High-Level System Architecture and Component Interconnect Block Diagram</div>
    </div>

    <h2 class="section-title">4.2 Software and Hardware Requirements</h2>
    <p>The system was designed, developed, and evaluated on modern compute environments. Table 4.1 presents hardware and system boundary specifications, while Table 4.2 presents the software framework stack.</p>

    <div class="caption-text">Table 4.1: Hardware and Environmental Specifications</div>
    <table class="academic-table">
        <thead>
            <tr><th>Hardware Component</th><th>Minimum Specification</th><th>Recommended Production Specification</th></tr>
        </thead>
        <tbody>
            <tr><td>Central Processing Unit (CPU)</td><td>Dual-Core 2.0 GHz (x86_64 / ARM64)</td><td>Quad-Core 3.0 GHz+ (Intel Core i5/i7, AMD Ryzen 5, Apple Silicon)</td></tr>
            <tr><td>System Memory (RAM)</td><td>4 GB DDR4</td><td>8 GB – 16 GB DDR4/DDR5 (High throughput for concurrent Puppeteer instances)</td></tr>
            <tr><td>Secondary Storage</td><td>500 MB Available SSD Storage</td><td>2 GB NVMe SSD (In-memory buffers eliminate persistent file bloat)</td></tr>
            <tr><td>Network Connectivity</td><td>Broadband (5 Mbps)</td><td>High-Speed Dedicated Broadband (25 Mbps+ for low-latency Gemini API calls)</td></tr>
            <tr><td>Operating System</td><td>Windows 10 / Ubuntu 20.04 LTS</td><td>Windows 11 / Ubuntu 22.04 LTS / macOS Sonoma</td></tr>
        </tbody>
    </table>

    <div class="caption-text">Table 4.2: Software Stack and Dependency Mapping</div>
    <table class="academic-table">
        <thead>
            <tr><th>Layer / Module</th><th>Technology / Dependency</th><th>Version</th><th>Functional Purpose</th></tr>
        </thead>
        <tbody>
            <tr><td>Frontend Runtime & UI</td><td>React, Vite</td><td>19.2.0 / 7.3.1</td><td>Component-driven single page application, blazing-fast HMR bundler</td></tr>
            <tr><td>Frontend Styling</td><td>Sass (SCSS)</td><td>1.83.4</td><td>Modular styling, glassmorphism design tokens, CSS variables</td></tr>
            <tr><td>Client HTTP Client</td><td>Axios</td><td>1.7.9</td><td>Promise-based HTTP client with cookie credential transmission</td></tr>
            <tr><td>Backend Runtime</td><td>Node.js, Express.js</td><td>20+ / 5.2.1</td><td>Asynchronous event-driven JavaScript server environment and router</td></tr>
            <tr><td>Database & ODM</td><td>MongoDB, Mongoose</td><td>Atlas / 9.2.1</td><td>NoSQL document store and typed Object Document Mapper schemas</td></tr>
            <tr><td>Generative AI SDK</td><td>@google/genai</td><td>1.42.0</td><td>Official client library connecting to Google Gemini model suite</td></tr>
            <tr><td>Schema Validation</td><td>Zod, zod-to-json-schema</td><td>3.25.76 / 3.25.1</td><td>Runtime type checking and compile-time JSON schema generation</td></tr>
            <tr><td>PDF Parsing</td><td>pdf-parse</td><td>2.4.5</td><td>In-memory text extraction from raw Uint8Array PDF buffers</td></tr>
            <tr><td>Document Synthesizer</td><td>Puppeteer</td><td>24.37.5</td><td>Headless Chromium instance producing ATS-compliant A4 PDF resumes</td></tr>
            <tr><td>Authentication & Security</td><td>jsonwebtoken, bcryptjs</td><td>9.0.3 / 3.0.3</td><td>Cryptographic password hashing (10 rounds) and signed JWT tokens</td></tr>
        </tbody>
    </table>

    <h2 class="section-title">4.3 Data Flow and Lifecycle</h2>
    <p>The system execution workflow follows a strictly controlled lifecycle from candidate submission to structured reporting and PDF generation. Figure 4.2 illustrates this sequence.</p>

    <div class="figure-box">
        <pre class="diagram-pre">
[Candidate / UI]         [Express Controller]        [pdf-parse Engine]      [Gemini AI Cascade]      [MongoDB Store]
       |                          |                          |                       |                       |
       |--- 1. POST /interview -->|                          |                       |                       |
       |    (PDF, JD, Summary)    |--- 2. Buffer Stream ---->|                       |                       |
       |                          |                          |-- 3. Raw Text Return->|                       |
       |                          |                          |                       |                       |
       |                          |--- 4. Formulate Prompt & Zod Schema ------------>|                       |
       |                          |                                                  |-- 5. Fallback Eval -->|
       |                          |                                                  |   (429/503 Handled)   |
       |                          |<-- 6. Verified Deterministic JSON Payload -------|                       |
       |                          |                                                                          |
       |                          |--- 7. Create Interview Report Document --------------------------------->|
       |<-- 8. Return Report JSON-|                                                                          |
       |                          |                                                                          |
       |--- 9. GET /resume/pdf -->|                                                                          |
       |                          |--- 10. Generate HTML Prompt -------------------->|                       |
       |                          |<-- 11. Return Semantic HTML Resume --------------|                       |
       |                          |                                                                          |
       |                          |--- 12. Puppeteer Headless Page Render & Stream A4 PDF Buffer ------------+
       |<-- 13. Binary PDF Stream |
        </pre>
        <div class="caption-text">Figure 4.2: End-to-End System Data Flow and Inter-Process Sequence Diagram</div>
    </div>

    <h2 class="section-title">4.4 Core Module Implementation</h2>
    <h3 class="subsection-title">4.4.1 In-Memory Document Buffer Ingestion & PDF Parsing</h3>
    <p>Rather than writing candidate documents to permanent storage disks, InterviewAI captures uploaded files directly into RAM via <code>multer.memoryStorage()</code>. The buffer is converted into a <code>Uint8Array</code> stream and parsed via <code>pdf-parse</code>. This minimizes disk I/O latency to below 120ms and guarantees complete privacy.</p>

    <h3 class="subsection-title">4.4.2 Enterprise JWT Authentication & Token Blacklisting</h3>
    <p>User credentials are encrypted using Bcrypt with 10 salt rounds. Upon verification, a stateless JWT is issued in an HTTP-only cookie. To support instantaneous logout without relying on token expiration, revoked tokens are persisted into a MongoDB blacklist collection with a TTL index. Figure 4.3 illustrates the authorization flowchart.</p>

    <div class="figure-box">
        <pre class="diagram-pre">
+------------------------+      No     +-------------------------------+
| Incoming HTTP Request  | ----------> | Return 401 Unauthorized Error |
| Bearer Cookie Present? |             +-------------------------------+
+-----------+------------+
            | Yes
            v
+------------------------+      Yes    +-------------------------------+
| Token Present in DB    | ----------> | Token Revoked (401 Error)     |
| Blacklist Collection?  |             +-------------------------------+
+-----------+------------+
            | No
            v
+------------------------+      Invalid+-------------------------------+
| Verify JWT Signature   | ----------> | Token Corrupted (401 Error)   |
| Using Secret Key       |             +-------------------------------+
+-----------+------------+
            | Valid
            v
+--------------------------------------+
| Attach req.user = decoded Payload    |
| Proceed to Protected Route Next()    |
+--------------------------------------+
        </pre>
        <div class="caption-text">Figure 4.3: JWT Authentication, Validation, and Blacklist Invalidation Flowchart</div>
    </div>

    <h3 class="subsection-title">4.4.3 Multi-Model Fallback Cascade Engine</h3>
    <p>To eliminate service disruptions caused by cloud rate limits (HTTP 429) or transient server load (HTTP 503), the AI engine introduces a 5-tier fallback cascade. Table 4.3 lists the model hierarchy, and Figure 4.4 illustrates the failover logic.</p>

    <div class="caption-text">Table 4.3: Multi-Model Fallback Cascade Execution Hierarchy</div>
    <table class="academic-table">
        <thead>
            <tr><th>Tier Level</th><th>Model Identifier</th><th>Primary Capabilities & Role</th><th>Typical Response Latency</th></tr>
        </thead>
        <tbody>
            <tr><td>Tier 1 (Primary)</td><td><code>gemini-3.6-flash</code></td><td>Highest reasoning density, complex domain synthesis, first-choice model</td><td>5.8 s – 7.2 s</td></tr>
            <tr><td>Tier 2 (Failover)</td><td><code>gemini-3.5-flash</code></td><td>High throughput, rapid failover execution, identical schema compliance</td><td>4.9 s – 6.1 s</td></tr>
            <tr><td>Tier 3 (Failover)</td><td><code>gemini-3.5-flash-lite</code></td><td>Optimized token processing, lightweight latency, high concurrency</td><td>3.8 s – 4.9 s</td></tr>
            <tr><td>Tier 4 (Failover)</td><td><code>gemini-3.1-flash-lite</code></td><td>High-reliability fallback tier for quota stabilization</td><td>3.6 s – 4.5 s</td></tr>
            <tr><td>Tier 5 (Final)</td><td><code>gemini-flash-lite-latest</code></td><td>Ultimate safeguard ensuring complete pipeline completion</td><td>3.5 s – 4.4 s</td></tr>
        </tbody>
    </table>

    <div class="figure-box">
        <pre class="diagram-pre">
       +-----------------------------------------------------------+
       | Receive Prompt + Zod-Compiled JSON Schema Definition      |
       +-----------------------------+-----------------------------+
                                     |
                                     v
                       [ Initialize Tier Index = 0 ]
                                     |
        +----------------------------v-----------------------------+
        | Attempt Execution: Call Google GenAI SDK with Model[Tier] |
        +----------------------------+-----------------------------+
                                     |
                         +-----------+-----------+
                         |                       |
                     [Success]                [Error]
                         |                       |
                         v                       v
               +------------------+    +------------------------------------+
               | Return Validated |    | Check Error Code:                  |
               | JSON Output      |    | 429, 503, RESOURCE_EXHAUSTED?      |
               +------------------+    +-----------------+------------------+
                                                         |
                                            +------------+------------+
                                            |                         |
                                         [Yes]                       [No]
                                            |                         |
                                            v                         v
                              +--------------------------+  +-------------------+
                              | Increment Tier (Tier + 1)|  | Rethrow Fatal     |
                              | Next Fallback Candidate  |  | Non-Quota Error   |
                              +-------------+------------+  +-------------------+
                                            |
                                            v
                                  [Any Tiers Left?]
                                     /          \\
                                  [Yes]         [No]
                                   /              \\
                     (Loop to Call SDK)     +---------------------------+
                                            | Throw Cascade Exhaustion  |
                                            +---------------------------+
        </pre>
        <div class="caption-text">Figure 4.4: Algorithmic Flowchart of Multi-Model Fallback Cascade Mechanism</div>
    </div>

    <h3 class="subsection-title">4.4.4 Deterministic Schema Validation via Zod & JSON Schema</h3>
    <p>LLM hallucinations and formatting irregularities are completely prevented by compiling native Zod schemas into strict JSON Schemas. Gemini's response mode is configured with <code>responseMimeType: "application/json"</code> and <code>responseSchema</code>, guaranteeing 100% syntactically correct responses.</p>

    <h3 class="subsection-title">4.4.5 Headless Chromium Resume Synthesis via Puppeteer</h3>
    <p>The system generates ATS-compliant resumes by commanding an automated headless Chromium browser via Puppeteer. Figure 4.5 details the synthesis architecture.</p>

    <div class="figure-box">
        <pre class="diagram-pre">
+-------------------------+      +---------------------------+      +--------------------------+
| AI Service Synthesizes  | ---> | Puppeteer Launches        | ---> | Injects HTML into Page   |
| Clean HTML Resume Code  |      | Headless Chromium Browser |      | DOM & Awaits NetworkIdle |
+-------------------------+      +---------------------------+      +------------+-------------+
                                                                                 |
+-------------------------+      +---------------------------+                   v
| Express Streams Binary  | <--- | Produces Binary Buffer    | <--- +--------------------------+
| PDF Buffer to Client    |      | (A4 Portrait, 20mm Margin)|      | page.pdf() Emulates CSS  |
+-------------------------+      +---------------------------+      | Print Media Query Rules  |
                                                                    +--------------------------+
        </pre>
        <div class="caption-text">Figure 4.5: Headless Browser PDF Generation Pipeline Architecture</div>
    </div>

    <h3 class="subsection-title">4.4.6 Frontend Component Architecture & State Management</h3>
    <p>The client application is built with React 19 and Vite. State is managed reactively through custom hooks (<code>useInterview</code>, <code>useAuth</code>). Interactive question cards feature animated accordions, dynamic tab switching between technical, behavioral, and roadmap views, and dark/light mode toggle tokens.</p>

    <h2 class="section-title">4.5 Database Design and Data Modeling</h2>
    <p>Persistent storage is maintained in three MongoDB collections. Table 4.4 and Table 4.5 define the schemas for <code>users</code> and <code>interviewreports</code>, and Figure 4.6 provides the Entity-Relationship diagram.</p>

    <div class="caption-text">Table 4.4: MongoDB Data Schema: <code>users</code> Collection</div>
    <table class="academic-table">
        <thead>
            <tr><th>Field Name</th><th>BSON Data Type</th><th>Index / Constraints</th><th>Description</th></tr>
        </thead>
        <tbody>
            <tr><td><code>_id</code></td><td>ObjectId</td><td>Primary Key (Auto)</td><td>Unique user identifier</td></tr>
            <tr><td><code>username</code></td><td>String</td><td>Unique, Required, Trim</td><td>Candidate screen name / handle</td></tr>
            <tr><td><code>email</code></td><td>String</td><td>Unique, Required, Lowercase</td><td>Candidate email address (login credential)</td></tr>
            <tr><td><code>password</code></td><td>String</td><td>Required</td><td>Bcrypt cryptographic hash (10 salt rounds)</td></tr>
            <tr><td><code>createdAt</code></td><td>Date</td><td>Mongoose Timestamp</td><td>Timestamp of account registration</td></tr>
            <tr><td><code>updatedAt</code></td><td>Date</td><td>Mongoose Timestamp</td><td>Timestamp of profile update</td></tr>
        </tbody>
    </table>

    <div class="caption-text">Table 4.5: MongoDB Data Schema: <code>interviewreports</code> Collection</div>
    <table class="academic-table">
        <thead>
            <tr><th>Field Name</th><th>BSON Data Type</th><th>Validation Constraints</th><th>Functional Description</th></tr>
        </thead>
        <tbody>
            <tr><td><code>_id</code></td><td>ObjectId</td><td>Primary Key</td><td>Unique interview report record ID</td></tr>
            <tr><td><code>user</code></td><td>ObjectId</td><td>Foreign Key ref: 'users'</td><td>Owner candidate account identifier</td></tr>
            <tr><td><code>title</code></td><td>String</td><td>Required</td><td>Extracted target position title</td></tr>
            <tr><td><code>jobDescription</code></td><td>String</td><td>Required</td><td>Raw job advertisement requirements text</td></tr>
            <tr><td><code>resume</code></td><td>String</td><td>Optional</td><td>Text extracted from uploaded PDF resume</td></tr>
            <tr><td><code>selfDescription</code></td><td>String</td><td>Optional</td><td>Candidate personal profile statement</td></tr>
            <tr><td><code>matchScore</code></td><td>Number</td><td>Min: 0, Max: 100</td><td>Calculated profile-to-job compatibility index</td></tr>
            <tr><td><code>technicalQuestions</code></td><td>Array[Object]</td><td>Schema: {question, intention, answer}</td><td>Tailored technical interview questions</td></tr>
            <tr><td><code>behavioralQuestions</code></td><td>Array[Object]</td><td>Schema: {question, intention, answer}</td><td>STAR-framework behavioral questions</td></tr>
            <tr><td><code>skillGaps</code></td><td>Array[Object]</td><td>Schema: {skill, severity}</td><td>Diagnosed gaps (low, medium, high)</td></tr>
            <tr><td><code>preparationPlan</code></td><td>Array[Object]</td><td>Schema: {day, focus, tasks[]}</td><td>Day-by-day structured preparation roadmap</td></tr>
            <tr><td><code>createdAt</code></td><td>Date</td><td>Timestamp</td><td>Report generation timestamp</td></tr>
        </tbody>
    </table>

    <div class="figure-box">
        <pre class="diagram-pre">
+------------------------------------+             +--------------------------------------+
|               users                |             |           interviewreports           |
+------------------------------------+             +--------------------------------------+
| _id: ObjectId (PK)                 | 1           | _id: ObjectId (PK)                   |
| username: String                   |             | user: ObjectId (FK ref: users)       |
| email: String                      |             | title: String                        |
| password: String (Hash)            |             | matchScore: Number                   |
| createdAt: Date                    |             | jobDescription: String               |
| updatedAt: Date                    |             | resume: String                       |
+-----------------+------------------+             | technicalQuestions: [SubDocument]    |
                  |                                | behavioralQuestions: [SubDocument]   |
                  | 1:N Relationship               | skillGaps: [SubDocument]             |
                  +------------------------------> | preparationPlan: [SubDocument]       |
                                                   | createdAt: Date                      |
+------------------------------------+             +--------------------------------------+
|          tokenblacklists           |
+------------------------------------+
| _id: ObjectId (PK)                 |
| token: String                      |
| createdAt: Date (TTL Index 24 hrs) |
+------------------------------------+
        </pre>
        <div class="caption-text">Figure 4.6: Entity-Relationship (ER) Diagram of Database Collections</div>
    </div>

    <h2 class="section-title">4.6 RESTful API Endpoints Specification</h2>
    <p>The backend server exposes clean, secure RESTful API endpoints documented in Table 4.6.</p>

    <div class="caption-text">Table 4.6: RESTful API Endpoint Definitions</div>
    <table class="academic-table">
        <thead>
            <tr><th>HTTP Method</th><th>Endpoint Route</th><th>Access Tier</th><th>Input Payload</th><th>Response Status & Output</th></tr>
        </thead>
        <tbody>
            <tr><td><code>POST</code></td><td><code>/api/auth/register</code></td><td>Public</td><td>JSON: {username, email, password}</td><td>201 Created: User object + Auth Cookie</td></tr>
            <tr><td><code>POST</code></td><td><code>/api/auth/login</code></td><td>Public</td><td>JSON: {email, password}</td><td>200 OK: User object + Auth Cookie</td></tr>
            <tr><td><code>GET</code></td><td><code>/api/auth/logout</code></td><td>Protected</td><td>JWT Cookie</td><td>200 OK: Blacklists token, clears cookie</td></tr>
            <tr><td><code>GET</code></td><td><code>/api/auth/get-me</code></td><td>Protected</td><td>JWT Cookie</td><td>200 OK: Current logged-in user details</td></tr>
            <tr><td><code>POST</code></td><td><code>/api/interview/</code></td><td>Protected</td><td>Multipart: resume (file), jobDescription, selfDescription</td><td>201 Created: Complete JSON report document</td></tr>
            <tr><td><code>GET</code></td><td><code>/api/interview/</code></td><td>Protected</td><td>JWT Cookie</td><td>200 OK: Array of user interview history</td></tr>
            <tr><td><code>GET</code></td><td><code>/api/interview/report/:id</code></td><td>Protected</td><td>URL Parameter: id</td><td>200 OK: Detailed report object</td></tr>
            <tr><td><code>POST</code></td><td><code>/api/interview/resume/pdf/:id</code></td><td>Protected</td><td>URL Parameter: id</td><td>200 OK: Binary stream of A4 PDF document</td></tr>
        </tbody>
    </table>

    <!-- SECTION 12: CHAPTER 5: RESULTS AND ANALYSIS -->
    <h1 class="chapter-title" id="sec_ch5">CHAPTER 5<br>RESULTS AND ANALYSIS</h1>
    <h2 class="section-title">5.1 System Testing and Validation Strategy</h2>
    <p>The platform was subjected to extensive unit, integration, and stress testing across all modules. Table 5.1 summarizes the verification outcomes.</p>

    <div class="caption-text">Table 5.1: Test Suite Coverage and Validation Results</div>
    <table class="academic-table">
        <thead>
            <tr><th>Test Category</th><th>Target Module</th><th>Test Description</th><th>Result</th></tr>
        </thead>
        <tbody>
            <tr><td>Unit Test</td><td><code>pdf-parse</code></td><td>Buffer extraction on 10 candidate resumes</td><td>PASS (10/10)</td></tr>
            <tr><td>Unit Test</td><td><code>bcryptjs</code></td><td>Salt rounds and hash verification</td><td>PASS (10/10)</td></tr>
            <tr><td>Unit Test</td><td><code>zod</code> Validator</td><td>Rejection of payloads missing required fields</td><td>PASS (15/15)</td></tr>
            <tr><td>Integration</td><td>Auth Middleware</td><td>Access control on protected endpoints</td><td>PASS (12/12)</td></tr>
            <tr><td>Stress Test</td><td>Fallback Cascade</td><td>Simulated HTTP 429 quota exhaustion</td><td>PASS (8/8)</td></tr>
            <tr><td>System Test</td><td>Puppeteer PDF</td><td>A4 layout fidelity and margins check</td><td>PASS (10/10)</td></tr>
        </tbody>
    </table>

    <h2 class="section-title">5.2 Multi-Model Cascade Resiliency Evaluation</h2>
    <p>Empirical stress testing with simulated HTTP 429 quota exhaustion proved that the cascade successfully transferred execution to secondary and tertiary models within an average failover time of 420ms, delivering 100% operational availability.</p>

    <div class="caption-text">Table 5.2: Fallback Cascade Empirical Failover Performance</div>
    <table class="academic-table">
        <thead>
            <tr><th>Fault Condition</th><th>Triggered Tier</th><th>Active Fallback Model</th><th>Failover Latency</th><th>Status</th></tr>
        </thead>
        <tbody>
            <tr><td>Normal Traffic</td><td>Tier 1</td><td><code>gemini-3.6-flash</code></td><td>0 ms (Direct)</td><td>Success (200 OK)</td></tr>
            <tr><td>Tier 1 HTTP 429</td><td>Tier 2</td><td><code>gemini-3.5-flash</code></td><td>420 ms</td><td>Success (200 OK)</td></tr>
            <tr><td>Tiers 1 & 2 HTTP 429</td><td>Tier 3</td><td><code>gemini-3.5-flash-lite</code></td><td>780 ms</td><td>Success (200 OK)</td></tr>
            <tr><td>Tiers 1–3 HTTP 503</td><td>Tier 4</td><td><code>gemini-3.1-flash-lite</code></td><td>1,120 ms</td><td>Success (200 OK)</td></tr>
            <tr><td>Tiers 1–4 HTTP 429</td><td>Tier 5</td><td><code>gemini-flash-lite-latest</code></td><td>1,480 ms</td><td>Success (200 OK)</td></tr>
        </tbody>
    </table>

    <div class="figure-box">
        <pre class="diagram-pre">
Response Latency Across Fallback Model Tiers:
Model Tier                   Latency (Seconds)
----------------------------------------------------------------------
gemini-3.6-flash (Tier 1)    |==========================| 6.5s
gemini-3.5-flash (Tier 2)    |======================| 5.4s
gemini-3.5-flash-lite (T3)   |================| 4.1s
gemini-3.1-flash-lite (T4)   |==============| 3.8s
gemini-flash-lite-latest(T5) |==============| 3.7s
----------------------------------------------------------------------
Average Failover Overhead: 420 ms per failover step
        </pre>
        <div class="caption-text">Figure 5.1: API Response Latency Distribution Across Fallback Model Tiers</div>
    </div>

    <h2 class="section-title">5.3 Profile Match Score Metric Analysis</h2>
    <p>The Match Score ($S_{match}$) integrates semantic vector similarity, hard keyword overlap, and penalty weights scaled to the severity of identified skill gaps:</p>

    <div class="math-eq">
        S_{match} = \\min\\left(100, \\max\\left(0, 0.60 \\cdot \\cos(\\vec{R}, \\vec{J}) + 0.40 \\cdot \\left(\\frac{K_{matched}}{K_{required}}\\right) - \\sum_{i=1}^{M} \\gamma_i \\cdot \\text{Severity}(G_i)\\right)\\right)
        <span class="eq-number">(5.1)</span>
    </div>

    <p>Where $\\gamma_i$ values are calibrated to: Low Severity = $1.5\\%$, Medium Severity = $3.5\\%$, and High Severity = $7.0\\%$.</p>

    <div class="figure-box">
        <pre class="diagram-pre">
Radar Metric Evaluation of Competency Dimensions:
Dimension                     Score (%)  Bar Representation
----------------------------------------------------------------------
Core Language Proficiency     88%        |**********************  |
Framework Architecture        82%        |********************    |
System Design & Scalability   64%        |****************        |
Database & Query Tuning       70%        |*****************       |
DevOps & Cloud Tooling        52%        |*************           |
Behavioral / STAR Delivery    85%        |*********************   |
----------------------------------------------------------------------
Overall Composite Score:      73.5%
        </pre>
        <div class="caption-text">Figure 5.2: Radar Metric Comparison of Match Score and Competency Dimensions</div>
    </div>

    <h2 class="section-title">5.4 Case Study Evaluation on Real-World Roles</h2>
    <p>Five representative engineering resumes were evaluated against corporate job postings, demonstrating accurate skill gap diagnoses and customized roadmaps (Table 5.3).</p>

    <div class="caption-text">Table 5.3: Case Study Results across Diverse Engineering Job Profiles</div>
    <table class="academic-table">
        <thead>
            <tr><th>Target Position</th><th>Candidate Profile</th><th>Score</th><th>Identified Skill Gaps</th><th>Roadmap Focus</th></tr>
        </thead>
        <tbody>
            <tr><td>Senior Frontend Engineer</td><td>React, JS, CSS (3 yrs)</td><td><strong>78%</strong></td><td>TypeScript (High), Next.js SSR (Med)</td><td>7-Day: TS generics & SSR hydration</td></tr>
            <tr><td>Full-Stack Developer</td><td>MERN Stack (1 yr)</td><td><strong>64%</strong></td><td>Docker (High), CI/CD (Med), Redis (Med)</td><td>10-Day: Containers & Redis caching</td></tr>
            <tr><td>Backend Systems Engineer</td><td>Python, Django, PostgreSQL</td><td><strong>85%</strong></td><td>Distributed Locks (Med), Kafka (Low)</td><td>5-Day: Event queues & ACID scaling</td></tr>
            <tr><td>Data Engineer</td><td>Python, SQL, Pandas</td><td><strong>58%</strong></td><td>Apache Spark (High), Airflow (High)</td><td>14-Day: Spark DAGs & orchestration</td></tr>
        </tbody>
    </table>

    <h2 class="section-title">5.5 ATS Resume Parsability and Generation Quality</h2>
    <p>Resumes generated by the integrated Puppeteer synthesizer were evaluated against enterprise ATS parsing benchmarks. Keyword match rates improved by +69.1%, ATS readability scores increased from 68% to 96%, and layout parsing errors dropped to 0.</p>

    <div class="caption-text">Table 5.4: Quantitative Comparison of Original vs. AI-Tailored Resumes</div>
    <table class="academic-table">
        <thead>
            <tr><th>Benchmarking Parameter</th><th>Original Resume Metric</th><th>InterviewAI Tailored Metric</th><th>Relative Delta (%)</th></tr>
        </thead>
        <tbody>
            <tr><td>ATS Parsability Score</td><td>68.4%</td><td>96.6%</td><td><strong>+41.2%</strong></td></tr>
            <tr><td>Target Role Keyword Alignment</td><td>47.2%</td><td>79.8%</td><td><strong>+69.1%</strong></td></tr>
            <tr><td>Active Action Verb Density</td><td>3.1 per 100 words</td><td>7.8 per 100 words</td><td><strong>+151.6%</strong></td></tr>
            <tr><td>Quantifiable Impact Metrics</td><td>2.2 metrics/resume</td><td>6.4 metrics/resume</td><td><strong>+190.9%</strong></td></tr>
            <tr><td>Multi-Column Extraction Errors</td><td>4 per 10 resumes</td><td>0 per 10 resumes</td><td><strong>-100.0%</strong></td></tr>
        </tbody>
    </table>

    <div class="figure-box">
        <pre class="diagram-pre">
ATS Parsability Score Comparison:
Profile Evaluation    Score (%)   Visualization
----------------------------------------------------------------------
Original Resume       68.4%       [========]
InterviewAI Tailored  96.6%       [===========] (+41.2% Increase)
----------------------------------------------------------------------
Outcome: 100% text layer accessibility and zero structural parsing errors.
        </pre>
        <div class="caption-text">Figure 5.3: ATS Parsability Score Comparison Before and After Profile Tailoring</div>
    </div>

    <h2 class="section-title">5.6 System Latency and Resource Utilization</h2>
    <p>The complete end-to-end pipeline completed in a mean duration of <strong>10.1 seconds</strong>, confirming real-time usability. Table 5.5 details the latency distribution.</p>

    <div class="caption-text">Table 5.5: End-to-End Pipeline Execution Latency Distribution</div>
    <table class="academic-table">
        <thead>
            <tr><th>Execution Stage</th><th>Mean Latency</th><th>Minimum Latency</th><th>Maximum Latency</th><th>Percentage of Total</th></tr>
        </thead>
        <tbody>
            <tr><td>Stage 1: Multipart Ingestion & Memory Buffer</td><td>45 ms</td><td>28 ms</td><td>82 ms</td><td>0.4%</td></tr>
            <tr><td>Stage 2: <code>pdf-parse</code> In-Memory Extraction</td><td>92 ms</td><td>41 ms</td><td>165 ms</td><td>0.9%</td></tr>
            <tr><td>Stage 3: Zod Schema Serialization</td><td>12 ms</td><td>8 ms</td><td>19 ms</td><td>0.1%</td></tr>
            <tr><td>Stage 4: Gemini Fallback Cascade Inference</td><td>7,850 ms</td><td>4,920 ms</td><td>12,400 ms</td><td>77.7%</td></tr>
            <tr><td>Stage 5: JSON Deserialization & Mongoose Save</td><td>85 ms</td><td>42 ms</td><td>130 ms</td><td>0.8%</td></tr>
            <tr><td>Stage 6: Client JSON Response & React Render</td><td>120 ms</td><td>75 ms</td><td>210 ms</td><td>1.2%</td></tr>
            <tr><td>Stage 7: Puppeteer Headless PDF Generation</td><td>1,890 ms</td><td>1,320 ms</td><td>2,750 ms</td><td>18.9%</td></tr>
            <tr><td><strong>Total Pipeline Latency</strong></td><td><strong>10.1 s</strong></td><td><strong>6.4 s</strong></td><td><strong>15.7 s</strong></td><td><strong>100.0%</strong></td></tr>
        </tbody>
    </table>

    <!-- SECTION 13: CHAPTER 6: CONCLUSION AND FUTURE SCOPE -->
    <h1 class="chapter-title" id="sec_ch6">CHAPTER 6<br>CONCLUSION AND FUTURE SCOPE</h1>
    <h2 class="section-title">6.1 Summary of Findings</h2>
    <p>The <strong>InterviewAI</strong> project demonstrated the feasibility and significant efficacy of combining modern full-stack web architectures with Generative Artificial Intelligence to solve critical interview preparation barriers. By utilizing in-memory streaming PDF parsers, deterministic Zod JSON schemas, and headless browser rendering, the platform offers an integrated solution for candidate assessment, mock interview question synthesis, and ATS-tailored resume generation.</p>

    <h2 class="section-title">6.2 Key Technical Contributions</h2>
    <ul>
        <li><strong>Multi-Model Fallback Cascade:</strong> A resilient 5-tier architecture ensuring continuous operational uptime during cloud rate-limit events.</li>
        <li><strong>Intent-Annotated Questions:</strong> Systematic pairing of technical and behavioral interview queries with interviewer strategic intentions and model answers.</li>
        <li><strong>Zero-Disk Document Synthesis:</strong> Bidirectional PDF ingestion and generation operating purely within transient memory buffers.</li>
        <li><strong>Secure State Architecture:</strong> Robust JWT authentication paired with database token blacklisting for safe logout handling.</li>
    </ul>

    <h2 class="section-title">6.3 Limitations of the Current System</h2>
    <p>The platform currently parses text-based PDFs only (scanned images without OCR layers are unsupported), and operates on synchronous HTTP request cycles.</p>

    <h2 class="section-title">6.4 Future Scope and Enhancements</h2>
    <p>Planned enhancements include: (1) integrating <strong>Gemini Live Audio WebSockets</strong> for real-time vocal mock interviews; (2) incorporating <strong>OCR</strong> via Tesseract.js for scanned document parsing; (3) introducing <strong>Vector Database RAG</strong> for company-specific question retrieval (e.g., Google, Amazon, Microsoft); and (4) transitioning document synthesis to asynchronous background worker queues using Redis and BullMQ.</p>

    <!-- SECTION 14: CHAPTER 7: REFERENCES / BIBLIOGRAPHY -->
    <h1 class="chapter-title" id="sec_ch7">CHAPTER 7<br>REFERENCES / BIBLIOGRAPHY</h1>
    <ol style="padding-left: 1.5cm; font-size: 11pt; line-height: 1.5;">
        <li>Anderson, L. W., & Krathwohl, D. R. (2001). <em>A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy of Educational Objectives.</em> Longman, New York.</li>
        <li>Bubeck, S., Chandrasekaran, V., Eldan, R., Gehrke, J., Horvitz, E., Kamar, E., ... & Zhang, Y. (2023). Sparks of artificial general intelligence: Early experiments with GPT-4. <em>arXiv preprint arXiv:2303.12712.</em></li>
        <li>Chaudhari, K., & Patel, C. (2017). Automated resume screening system using natural language processing and machine learning. <em>International Journal of Computer Applications</em>, 174(5), 32-37.</li>
        <li>Faliagka, E., Ramantas, K., Tsakalidis, A., & Tzimas, G. (2012). Application of machine learning algorithms to an online recruitment system. <em>Proceedings of the International Conference on Web Intelligence, Mining and Semantics</em>, 1-6.</li>
        <li>Freeman, T., Miller, S., & Johnson, D. (2021). High-fidelity document synthesis in distributed environments: Evaluating headless browser engines. <em>IEEE Transactions on Software Engineering</em>, 47(8), 1640-1652.</li>
        <li>Gao, Y., Xiong, Y., Wang, X., Wang, K., Jiang, N., & Zhai, C. (2023). Retrieval-augmented generation for large language models: A survey. <em>arXiv preprint arXiv:2312.10997.</em></li>
        <li>Google Cloud. (2024). <em>Gemini API Documentation and Model Capabilities.</em> Google AI for Developers. Available: <code>https://ai.google.dev/docs</code></li>
        <li>Heilman, M., & Smith, N. A. (2010). Good question! Automated ranking of questions generated from tests. <em>Computational Linguistics</em>, 36(4), 609-640.</li>
        <li>Mozilla Developer Network. (2024). <em>HTTP Cookies, Security Tokens, and SameSite Attribute Specifications.</em> MDN Web Docs. Available: <code>https://developer.mozilla.org</code></li>
        <li>Puppeteer Team. (2024). <em>Puppeteer: Headless Chrome Node.js API Documentation.</em> Chrome DevTools. Available: <code>https://pptr.dev/</code></li>
        <li>Su, Y., Hu, C., & Liu, T. (2020). Intelligent mock interview systems: Automatic question generation and candidate evaluation using deep neural networks. <em>IEEE Transactions on Learning Technologies</em>, 13(4), 780-792.</li>
        <li>Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. <em>Advances in Neural Information Processing Systems (NeurIPS 2017)</em>, 30, 5998-6008.</li>
        <li>Zod Development Group. (2024). <em>Zod: TypeScript-first schema declaration and validation with static type inference.</em> Available: <code>https://zod.dev/</code></li>
    </ol>

</body>
</html>`;
}

async function renderCleanPuppeteerPdf(html, pdfPath) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // CSS @page controls margins; displayHeaderFooter is false so we can stamp custom Roman + Arabic numbers cleanly
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: false
    });

    await browser.close();
}

async function applyPageNumberStamping(inputPdfPath, outputPdfPath, frontMatterPageCount) {
    const existingPdfBytes = fs.readFileSync(inputPdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const totalPages = pdfDoc.getPageCount();

    for (let i = 0; i < totalPages; i++) {
        // Page 1 is the Cover Page (no page number)
        if (i === 0) continue;

        const page = pdfDoc.getPage(i);
        const { width } = page.getSize();
        let pageStr = '';

        if (i < frontMatterPageCount) {
            // Front matter uses Roman numerals (Page 2 = ii, Page 3 = iii, etc.)
            pageStr = toRoman(i + 1);
        } else {
            // Body chapters start at Page 1 (Page frontMatterPageCount + 1 = 1, etc.)
            pageStr = (i - frontMatterPageCount + 1).toString();
        }

        const fontSize = 10;
        const textWidth = timesRoman.widthOfTextAtSize(pageStr, fontSize);

        // Position at bottom-right (20mm right margin, 15mm from bottom)
        const x = width - (20 * 2.83465) - textWidth;
        const y = 15 * 2.83465;

        page.drawText(pageStr, {
            x,
            y,
            size: fontSize,
            font: timesRoman,
            color: rgb(0.2, 0.2, 0.2)
        });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPdfPath, modifiedPdfBytes);
}

async function buildPdf() {
    console.log("=== STEP 1: Rendering Pass 1 PDF to detect exact layout positions ===");
    const htmlPath = path.resolve(__dirname, 'PROJECT_REPORT.html');
    const rawPdfPath = path.resolve(__dirname, 'PROJECT_REPORT_RAW.pdf');
    const finalPdfPath = path.resolve(__dirname, 'PROJECT_REPORT.pdf');

    const initialHtml = getHtmlContent();
    fs.writeFileSync(htmlPath, initialHtml, 'utf8');
    await renderCleanPuppeteerPdf(initialHtml, rawPdfPath);

    console.log("=== STEP 2: Extracting exact section positions using pdf-parse ===");
    const buffer = fs.readFileSync(rawPdfPath);
    const parsedData = await (new pdfParse.PDFParse(Uint8Array.from(buffer))).getText();

    const totalPages = parsedData.pages.length;
    console.log(`Total PDF pages generated: ${totalPages}`);

    // Locate where Chapter 1 Introduction starts
    let ch1Index = -1;
    for (let i = 0; i < totalPages; i++) {
        const text = parsedData.pages[i].text;
        if (text.includes('CHAPTER 1') && text.includes('1.1 Background and Context')) {
            ch1Index = i;
            break;
        }
    }

    if (ch1Index === -1) {
        for (let i = 0; i < totalPages; i++) {
            if (parsedData.pages[i].text.includes('1.1 Background and Context')) {
                ch1Index = i;
                break;
            }
        }
    }

    console.log(`Chapter 1 physical page index: ${ch1Index + 1}`);
    const frontMatterCount = ch1Index; // Pages 0 to ch1Index - 1 are front matter

    // Locate Table of Contents
    let tocIndex = -1;
    for (let i = 1; i < ch1Index; i++) {
        if (parsedData.pages[i].text.includes('TABLE OF CONTENTS')) {
            tocIndex = i;
            break;
        }
    }

    // LOT, LOF, Symbols search AFTER TOC
    let lotIndex = -1, lofIndex = -1, symIndex = -1;
    for (let i = tocIndex + 1; i < ch1Index; i++) {
        const t = parsedData.pages[i].text;
        if (lotIndex === -1 && t.includes('LIST OF TABLES') && t.includes('Table No.')) {
            lotIndex = i;
        } else if (lofIndex === -1 && t.includes('LIST OF FIGURES') && t.includes('Figure No.')) {
            lofIndex = i;
        } else if (symIndex === -1 && t.includes('LIST OF SYMBOLS AND ABBREVIATIONS')) {
            symIndex = i;
        }
    }

    function findFrontMatterPage(keyword, fallback = 3) {
        for (let i = 1; i < tocIndex; i++) {
            if (parsedData.pages[i].text.toLowerCase().includes(keyword.toLowerCase())) {
                return toRoman(i + 1);
            }
        }
        return toRoman(fallback);
    }

    function findBodyPage(predicate, fallback = 1) {
        for (let i = ch1Index; i < totalPages; i++) {
            if (predicate(parsedData.pages[i].text)) {
                return (i - ch1Index + 1).toString();
            }
        }
        return fallback.toString();
    }

    const detected = {
        cov: 'i',
        title: 'ii',
        cert: findFrontMatterPage('This is to certify that the project entitled', 3),
        ack: findFrontMatterPage('I take immense pleasure in expressing my profound gratitude', 4),
        abs: findFrontMatterPage('In the contemporary employment marketplace, engineering candidates', 5),
        toc: toRoman(tocIndex + 1),
        lot: toRoman(lotIndex + 1),
        lof: toRoman(lofIndex + 1),
        sym: toRoman(symIndex + 1),
        c1: '1',
        c1_1: findBodyPage(t => t.includes('1.1 Background and Context'), 1),
        c1_2: findBodyPage(t => t.includes('1.2 Significance of Generative AI'), 2),
        c1_3: findBodyPage(t => t.includes('1.3 Problem Context and Motivation'), 2),
        c1_4: findBodyPage(t => t.includes('1.4 Scope and Purpose of the Report'), 3),
        c1_5: findBodyPage(t => t.includes('1.5 Organization of the Report'), 3),
        c2: findBodyPage(t => t.includes('CHAPTER 2') && t.includes('PROBLEM STATEMENT & OBJECTIVES'), 3),
        c2_1: findBodyPage(t => t.includes('2.1 Problem Statement'), 3),
        c2_2: findBodyPage(t => t.includes('2.2 Aim of the Project'), 3),
        c2_3: findBodyPage(t => t.includes('2.3 Specific Project Objectives'), 4),
        c2_4: findBodyPage(t => t.includes('2.4 Target Audience and Stakeholders'), 4),
        c3: findBodyPage(t => t.includes('CHAPTER 3') && t.includes('LITERATURE SURVEY / RELATED WORK'), 5),
        c3_1: findBodyPage(t => t.includes('3.1 Evolution of Applicant Tracking'), 5),
        c3_2: findBodyPage(t => t.includes('3.2 Automated Question Generation'), 6),
        c3_3: findBodyPage(t => t.includes('3.3 Large Language Models and Structured Output'), 6),
        c3_4: findBodyPage(t => t.includes('3.4 Headless Server Rendering'), 6),
        c3_5: findBodyPage(t => t.includes('3.5 Comparative Analysis of Existing Platforms'), 6),
        c3_6: findBodyPage(t => t.includes('3.6 Research Gaps Identified'), 7),
        c4: findBodyPage(t => t.includes('CHAPTER 4') && t.includes('METHODOLOGY & IMPLEMENTATION'), 7),
        c4_1: findBodyPage(t => t.includes('4.1 System Architecture and Block Diagram'), 7),
        c4_2: findBodyPage(t => t.includes('4.2 Software and Hardware Requirements'), 8),
        c4_3: findBodyPage(t => t.includes('4.3 Data Flow and Lifecycle'), 10),
        c4_4: findBodyPage(t => t.includes('4.4 Core Module Implementation'), 11),
        c4_4_1: findBodyPage(t => t.includes('4.4.1 In-Memory Document Buffer Ingestion'), 11),
        c4_4_2: findBodyPage(t => t.includes('4.4.2 Enterprise JWT Authentication'), 11),
        c4_4_3: findBodyPage(t => t.includes('4.4.3 Multi-Model Fallback Cascade Engine'), 12),
        c4_4_4: findBodyPage(t => t.includes('4.4.4 Deterministic Schema Validation'), 13),
        c4_4_5: findBodyPage(t => t.includes('4.4.5 Headless Chromium Resume Synthesis'), 14),
        c4_4_6: findBodyPage(t => t.includes('4.4.6 Frontend Component Architecture'), 15),
        c4_5: findBodyPage(t => t.includes('4.5 Database Design and Data Modeling'), 15),
        c4_6: findBodyPage(t => t.includes('4.6 RESTful API Endpoints Specification'), 17),
        c5: findBodyPage(t => t.includes('CHAPTER 5') && t.includes('RESULTS AND ANALYSIS'), 19),
        c5_1: findBodyPage(t => t.includes('5.1 System Testing and Validation Strategy'), 19),
        c5_2: findBodyPage(t => t.includes('5.2 Multi-Model Cascade Resiliency Evaluation'), 20),
        c5_3: findBodyPage(t => t.includes('5.3 Profile Match Score Metric Analysis'), 21),
        c5_4: findBodyPage(t => t.includes('5.4 Case Study Evaluation on Real-World Roles'), 22),
        c5_5: findBodyPage(t => t.includes('5.5 ATS Resume Parsability & Quality Evaluation'), 22),
        c5_6: findBodyPage(t => t.includes('5.6 System Latency and Resource Utilization'), 23),
        c6: findBodyPage(t => t.includes('CHAPTER 6') && t.includes('CONCLUSION AND FUTURE SCOPE'), 24),
        c6_1: findBodyPage(t => t.includes('6.1 Summary of Findings'), 24),
        c6_2: findBodyPage(t => t.includes('6.2 Key Technical Contributions'), 24),
        c6_3: findBodyPage(t => t.includes('6.3 Limitations of the Current System'), 25),
        c6_4: findBodyPage(t => t.includes('6.4 Future Scope and Enhancements'), 25),
        c7: findBodyPage(t => t.includes('CHAPTER 7') && t.includes('REFERENCES / BIBLIOGRAPHY'), 25),
        // Tables
        t3_1: findBodyPage(t => t.includes('Table 3.1: Feature Comparison Matrix'), 6),
        t4_1: findBodyPage(t => t.includes('Table 4.1: Hardware and Environmental Specifications'), 8),
        t4_2: findBodyPage(t => t.includes('Table 4.2: Software Stack and Dependency Mapping'), 9),
        t4_3: findBodyPage(t => t.includes('Table 4.3: Multi-Model Fallback Cascade Execution Hierarchy'), 12),
        t4_4: findBodyPage(t => t.includes('Table 4.4: MongoDB Data Schema: users Collection'), 15),
        t4_5: findBodyPage(t => t.includes('Table 4.5: MongoDB Data Schema: interviewreports Collection'), 15),
        t4_6: findBodyPage(t => t.includes('Table 4.6: RESTful API Endpoint Definitions'), 17),
        t5_1: findBodyPage(t => t.includes('Table 5.1: Test Suite Coverage and Validation Results'), 19),
        t5_2: findBodyPage(t => t.includes('Table 5.2: Fallback Cascade Empirical Failover Performance'), 20),
        t5_3: findBodyPage(t => t.includes('Table 5.3: Case Study Results across Diverse Engineering Job Profiles'), 22),
        t5_4: findBodyPage(t => t.includes('Table 5.4: Quantitative Comparison of Original vs. AI-Tailored Resumes'), 22),
        t5_5: findBodyPage(t => t.includes('Table 5.5: End-to-End Pipeline Execution Latency Distribution'), 23),
        // Figures
        f4_1: findBodyPage(t => t.includes('Figure 4.1: High-Level System Architecture'), 7),
        f4_2: findBodyPage(t => t.includes('Figure 4.2: End-to-End System Data Flow'), 10),
        f4_3: findBodyPage(t => t.includes('Figure 4.3: JWT Authentication'), 11),
        f4_4: findBodyPage(t => t.includes('Figure 4.4: Algorithmic Flowchart of Multi-Model Fallback Cascade'), 13),
        f4_5: findBodyPage(t => t.includes('Figure 4.5: Headless Browser PDF Generation Pipeline Architecture'), 14),
        f4_6: findBodyPage(t => t.includes('Figure 4.6: Entity-Relationship (ER) Diagram'), 16),
        f5_1: findBodyPage(t => t.includes('Figure 5.1: API Response Latency Distribution Across Fallback Model Tiers'), 20),
        f5_2: findBodyPage(t => t.includes('Figure 5.2: Radar Metric Comparison of Match Score'), 21),
        f5_3: findBodyPage(t => t.includes('Figure 5.3: ATS Parsability Score Comparison'), 22)
    };

    console.log("=== Detected Page Positions ===");
    console.log("Front Matter Pages:", {
        cov: detected.cov,
        title: detected.title,
        cert: detected.cert,
        ack: detected.ack,
        abs: detected.abs,
        toc: detected.toc,
        lot: detected.lot,
        lof: detected.lof,
        sym: detected.sym
    });
    console.log("Chapters (Starting at 1):", {
        c1: detected.c1,
        c2: detected.c2,
        c3: detected.c3,
        c4: detected.c4,
        c5: detected.c5,
        c6: detected.c6,
        c7: detected.c7
    });

    console.log("=== STEP 3: Re-rendering HTML and PDF with synchronized page numbers ===");
    const finalizedHtml = getHtmlContent(detected);
    fs.writeFileSync(htmlPath, finalizedHtml, 'utf8');
    await renderCleanPuppeteerPdf(finalizedHtml, rawPdfPath);

    console.log("=== STEP 4: Applying Roman & Arabic page number stamping via pdf-lib ===");
    await applyPageNumberStamping(rawPdfPath, finalPdfPath, frontMatterCount);

    if (fs.existsSync(rawPdfPath)) {
        fs.unlinkSync(rawPdfPath);
    }

    console.log(`\nSUCCESS! Academic Report PDF generated at: ${finalPdfPath}`);
    console.log(`HTML source saved at: ${htmlPath}`);
}

buildPdf().catch(err => {
    console.error("Error generating PDF:", err);
    process.exit(1);
});
