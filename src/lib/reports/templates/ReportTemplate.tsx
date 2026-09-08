import React from 'react';
import { AIReport } from '../../ai/schema';

// Helper to determine star rating string from 0-100 score
const getStars = (score: number) => {
  if (score >= 90) return '★★★★★';
  if (score >= 70) return '★★★★';
  if (score >= 50) return '★★★';
  if (score >= 30) return '★★';
  return '★';
};

const getCategory = (sdgId: number) => {
  const economic = [1, 2, 8, 9, 10, 12];
  const social = [3, 4, 5, 11, 16, 17];
  // 6, 7, 13, 14, 15 are environmental
  if (economic.includes(sdgId)) return 'Economic';
  if (social.includes(sdgId)) return 'Social';
  return 'Environmental';
};

export const ReportTemplate = ({ report }: { report: AIReport }) => {
  
  // Basic analytics for charts
  const categories = report.sdg_analysis.reduce((acc, sdg) => {
    const cat = getCategory(sdg.sdg_id);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const totalSdgs = report.sdg_analysis.length || 1;

  return (
    <>
      {/* Cover Page */}
      <div className="cover-page page-break-after">
        <div className="sdg-header-bar">
          {Array.from({length: 17}).map((_, i) => (
            <div key={i} className={`sdg-color c${i+1}`}></div>
          ))}
        </div>
        
        <div className="cover-content">
          {/* A large circular representation or placeholder for SDG Wheel */}
          <div style={{width: '200px', height: '200px', borderRadius: '50%', background: 'conic-gradient(#e5243b 0% 5%, #dda63a 5% 10%, #4c9f38 10% 15%, #c5192d 15% 20%, #ff3a21 20% 25%, #26bde2 25% 30%, #fcc30b 30% 35%, #a21942 35% 40%, #fd6925 40% 45%, #dd1367 45% 50%, #fd9d24 50% 55%, #bf8b2e 55% 60%, #3f7e44 60% 65%, #0a97d9 65% 70%, #56c02b 70% 75%, #00689d 75% 80%, #19486a 80% 85%, #e5243b 85% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24pt'}}>
            <div style={{width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'white'}}></div>
          </div>
          
          <h1 className="cover-h1">Sustainable Development Goals<br/>Analysis Report</h1>
          <div className="cover-subtitle">COMPREHENSIVE PROJECT SUSTAINABILITY ASSESSMENT</div>
          
          <div className="cover-info-card mt-8">
            <div className="cover-info-row">
              <div className="cover-info-label">Project Title:</div>
              <div className="cover-info-value">{report.project.title}</div>
            </div>
            <div className="cover-info-row">
              <div className="cover-info-label">Student Name:</div>
              <div className="cover-info-value">{report.project.student_name}</div>
            </div>
            {report.project.roll_number && (
              <div className="cover-info-row">
                <div className="cover-info-label">Roll Number:</div>
                <div className="cover-info-value">{report.project.roll_number}</div>
              </div>
            )}
            {report.project.department && (
              <div className="cover-info-row">
                <div className="cover-info-label">Department:</div>
                <div className="cover-info-value">{report.project.department}</div>
              </div>
            )}
            <div className="cover-info-row">
              <div className="cover-info-label">College/Institution:</div>
              <div className="cover-info-value">{report.project.institution}</div>
            </div>
            {report.project.academic_year && (
              <div className="cover-info-row">
                <div className="cover-info-label">Academic Year:</div>
                <div className="cover-info-value">{report.project.academic_year}</div>
              </div>
            )}
            <div className="cover-info-row">
              <div className="cover-info-label">Date:</div>
              <div className="cover-info-value">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div style={{padding: '40px'}} className="page-break-after">
        <h2 className="report-h2" style={{marginTop: 0}}>Table of Contents</h2>
        
        <div className="toc-item bold"><span>Executive Summary</span></div>
        <div className="toc-item bold"><span>1. Introduction</span></div>
        <div className="toc-item"><span>1.1 Sustainable Development Goals (SDGs)</span></div>
        <div className="toc-item"><span>1.2 Importance in Engineering and Technology</span></div>
        <div className="toc-item"><span>1.3 Need for Sustainability Assessment</span></div>
        <div className="toc-item bold"><span>2. Academic Information Analysis</span></div>
        <div className="toc-item bold"><span>3. Project Information Analysis</span></div>
        <div className="toc-item bold"><span>4. SDG Mapping Results</span></div>
        <div className="toc-item bold"><span>5. Category-Wise Sustainability Analysis</span></div>
        <div className="toc-item bold"><span>6. Statistical Analysis</span></div>
        <div className="toc-item bold"><span>7. Rating Analysis</span></div>
        <div className="toc-item bold"><span>8. Strengths</span></div>
        <div className="toc-item bold"><span>9. Limitations</span></div>
        <div className="toc-item bold"><span>10. Conclusion</span></div>
        <div className="toc-item bold"><span>11. Final Assessment Table</span></div>
      </div>

      <div style={{padding: '40px'}}>
        {/* Executive Summary */}
        <h2 className="report-h2" style={{marginTop: 0}}>Executive Summary</h2>
        <div className="report-body">
          {report.executive_summary}
        </div>
        <div className="info-box mt-4 keep-together">
          <h4 style={{marginBottom: '8px', color: '#1f2937'}}>Key Findings</h4>
          <ul style={{margin: 0, paddingLeft: '20px', color: '#4b5563', fontSize: '11pt'}}>
            <li>{report.sdg_analysis.length} out of 17 SDGs successfully mapped and evaluated.</li>
            <li>Maximum alignment ratings achieved across core identified dimensions.</li>
            <li>Final Sustainability Assessment Grade: {report.scores.overall >= 80 ? 'Excellent (A+)' : report.scores.overall >= 60 ? 'Good (B)' : 'Average (C)'}.</li>
          </ul>
        </div>

        {/* Introduction */}
        <h2 className="report-h2">1. Introduction</h2>
        <h3 className="report-h3">1.1 Sustainable Development Goals (SDGs)</h3>
        <p className="report-body">
          The Sustainable Development Goals (SDGs) are a universal set of 17 interconnected goals adopted by all United Nations Member States in September 2015 as part of the 2030 Agenda for Sustainable Development. These goals provide a shared blueprint for peace and prosperity for people and the planet, both now and into the future.
        </p>
        
        <h3 className="report-h3">1.2 Importance in Engineering and Technology</h3>
        <p className="report-body">
          Engineering and technology play a pivotal role in achieving the Sustainable Development Goals. From developing renewable energy systems and clean water infrastructure to creating digital platforms that enhance education access and healthcare delivery, engineers are at the forefront of sustainable innovation.
        </p>

        <h3 className="report-h3">1.3 Need for Sustainability Assessment</h3>
        <p className="report-body">
          The need for systematic sustainability assessment arises from three interconnected imperatives. First, environmental responsibility demands that all projects minimize ecological footprint. Second, social impact measurement ensures that technological interventions genuinely improve human well-being. Third, economic sustainability considerations verify that proposed solutions are financially viable.
        </p>

        {/* Academic & Project Info */}
        <div className="page-break-before"></div>
        <h2 className="report-h2" style={{marginTop: 0}}>2. Academic Information Analysis</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th style={{width: '30%'}}>Field</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Student Name</td><td>{report.project.student_name}</td></tr>
            {report.project.roll_number && <tr><td>Roll Number</td><td>{report.project.roll_number}</td></tr>}
            <tr><td>College / University</td><td>{report.project.institution}</td></tr>
            {report.project.department && <tr><td>Department</td><td>{report.project.department}</td></tr>}
            {report.project.academic_year && <tr><td>Academic Year</td><td>{report.project.academic_year}</td></tr>}
            {report.project.guide_name && <tr><td>Guide Name</td><td>{report.project.guide_name}</td></tr>}
          </tbody>
        </table>

        <h2 className="report-h2">3. Project Information Analysis</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th style={{width: '30%'}}>Field</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Project Title</td><td>{report.project.title}</td></tr>
            <tr><td>Project Abstract</td><td>{report.project.description.substring(0, 300)}...</td></tr>
          </tbody>
        </table>

        {/* Mapping Results */}
        <div className="page-break-before"></div>
        <h2 className="report-h2" style={{marginTop: 0}}>4. SDG Mapping Results</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th style={{width: '15%'}}>SDG</th>
              <th style={{width: '45%'}}>Goal Name</th>
              <th style={{width: '20%'}}>Category</th>
              <th style={{width: '20%'}}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {report.sdg_analysis.map((sdg) => (
              <tr key={sdg.sdg_id}>
                <td>SDG {sdg.sdg_id}</td>
                <td>{sdg.name}</td>
                <td style={{color: getCategory(sdg.sdg_id) === 'Economic' ? '#d97706' : getCategory(sdg.sdg_id) === 'Social' ? '#2563eb' : '#16a34a'}}>{getCategory(sdg.sdg_id)}</td>
                <td className="rating-stars">{getStars(sdg.alignment_score)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Category-wise Analysis */}
        <div className="page-break-before"></div>
        <h2 className="report-h2" style={{marginTop: 0}}>5. Category-Wise Sustainability Analysis</h2>
        
        <h3 className="report-h3">5.1 Economic Sustainability</h3>
        <div className="info-box">
          <strong>Economic Goals Addressed:</strong> {report.sdg_analysis.filter(s => getCategory(s.sdg_id) === 'Economic').map(s => `SDG ${s.sdg_id}`).join(', ') || 'None identified directly.'}
        </div>
        <p className="report-body">{report.impact_analysis.economic.analysis}</p>

        <h3 className="report-h3">5.2 Social Sustainability</h3>
        <div className="info-box">
          <strong>Social Goals Addressed:</strong> {report.sdg_analysis.filter(s => getCategory(s.sdg_id) === 'Social').map(s => `SDG ${s.sdg_id}`).join(', ') || 'None identified directly.'}
        </div>
        <p className="report-body">{report.impact_analysis.social.analysis}</p>

        <h3 className="report-h3">5.3 Environmental Sustainability</h3>
        <div className="info-box">
          <strong>Environmental Goals Addressed:</strong> {report.sdg_analysis.filter(s => getCategory(s.sdg_id) === 'Environmental').map(s => `SDG ${s.sdg_id}`).join(', ') || 'None identified directly.'}
        </div>
        <p className="report-body">{report.impact_analysis.environmental.analysis}</p>

        {/* Statistical Analysis */}
        <h2 className="report-h2">6. Statistical Analysis</h2>
        <div style={{display: 'flex', gap: '40px', marginBottom: '24pt'}}>
          <table className="report-table" style={{marginBottom: 0}}>
            <thead>
              <tr><th>Category</th><th>Number of SDGs</th></tr>
            </thead>
            <tbody>
              <tr><td>Economic</td><td>{categories['Economic'] || 0}</td></tr>
              <tr><td>Social</td><td>{categories['Social'] || 0}</td></tr>
              <tr><td>Environmental</td><td>{categories['Environmental'] || 0}</td></tr>
              <tr style={{fontWeight: 'bold', backgroundColor: '#eef5fa'}}><td>Total</td><td>{report.sdg_analysis.length}</td></tr>
            </tbody>
          </table>

          <table className="report-table" style={{marginBottom: 0}}>
            <thead>
              <tr><th>Category</th><th>Percentage</th></tr>
            </thead>
            <tbody>
              <tr><td>Economic</td><td>{(((categories['Economic'] || 0) / totalSdgs) * 100).toFixed(2)}%</td></tr>
              <tr><td>Social</td><td>{(((categories['Social'] || 0) / totalSdgs) * 100).toFixed(2)}%</td></tr>
              <tr><td>Environmental</td><td>{(((categories['Environmental'] || 0) / totalSdgs) * 100).toFixed(2)}%</td></tr>
            </tbody>
          </table>
        </div>

        {/* Rating Analysis */}
        <h2 className="report-h2">7. Rating Analysis</h2>
        <table className="report-table">
          <thead>
            <tr><th style={{width: '70%'}}>Metric</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr><td>Total SDGs Evaluated</td><td>{report.sdg_analysis.length}</td></tr>
            <tr><td>Overall Coverage</td><td>{report.scores.sdg_alignment}%</td></tr>
            <tr><td>Impact Score</td><td>{report.scores.impact}%</td></tr>
          </tbody>
        </table>

        {/* Strengths & Limitations */}
        <div className="page-break-before"></div>
        <h2 className="report-h2" style={{marginTop: 0}}>8. Strengths</h2>
        {report.strengths.map((str, idx) => (
          <div key={idx} className="info-box info-box-green keep-together">
            <div style={{color: '#16a34a', fontWeight: 'bold', marginBottom: '4pt'}}>✓ Identified Strength {idx + 1}</div>
            <div className="report-body" style={{margin: 0, color: '#1f2937'}}>{str}</div>
          </div>
        ))}

        <h2 className="report-h2">9. Limitations & Areas for Improvement</h2>
        {report.weaknesses.map((wk, idx) => (
          <div key={idx} className="info-box info-box-red keep-together">
            <div style={{color: '#dc2626', fontWeight: 'bold', marginBottom: '4pt'}}>■ Area for Improvement {idx + 1}</div>
            <div className="report-body" style={{margin: 0, color: '#1f2937'}}>{wk}</div>
          </div>
        ))}

        {/* Conclusion */}
        <h2 className="report-h2">10. Conclusion</h2>
        <p className="report-body">{report.conclusion}</p>
        <p className="report-body">{report.future_potential}</p>

        {/* Final Assessment */}
        <h2 className="report-h2">11. Final Assessment Table</h2>
        <table className="report-table">
          <thead>
            <tr><th style={{width: '70%'}}>Metric</th><th>Result</th></tr>
          </thead>
          <tbody>
            <tr><td>Total SDGs Evaluated</td><td>{report.sdg_analysis.length}</td></tr>
            <tr><td>Economic Goals</td><td>{categories['Economic'] || 0}</td></tr>
            <tr><td>Social Goals</td><td>{categories['Social'] || 0}</td></tr>
            <tr><td>Environmental Goals</td><td>{categories['Environmental'] || 0}</td></tr>
            <tr><td>Overall SDG Coverage</td><td>{report.scores.overall}%</td></tr>
            <tr><td style={{fontWeight: 'bold'}}>Sustainability Grade</td><td style={{fontWeight: 'bold'}}>{report.scores.overall >= 80 ? 'Excellent (A+)' : report.scores.overall >= 60 ? 'Good (B)' : 'Average (C)'}</td></tr>
          </tbody>
        </table>

        {/* Grade Box */}
        <div className="keep-together" style={{marginTop: '40pt', backgroundColor: 'var(--primary-blue)', color: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center'}}>
          <div style={{fontSize: '16pt', fontWeight: 'bold', marginBottom: '20pt'}}>Final Sustainability Assessment Grade</div>
          <div style={{fontSize: '64pt', fontWeight: '900', lineHeight: 1, marginBottom: '20pt'}}>
            {report.scores.overall >= 90 ? 'A+' : report.scores.overall >= 80 ? 'A' : report.scores.overall >= 70 ? 'B+' : report.scores.overall >= 60 ? 'B' : 'C'}
          </div>
          <div style={{fontSize: '14pt', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20pt'}}>
            {report.scores.overall >= 80 ? 'Excellent — Comprehensive SDG Alignment Achieved' : 'Good — Significant SDG Alignment Achieved'}
          </div>
        </div>
      </div>
    </>
  );
};
