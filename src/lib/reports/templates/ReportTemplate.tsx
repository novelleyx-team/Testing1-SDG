import React from 'react';
import { AIReport } from '../../ai/schema';

import Head from 'next/head';

export const ReportTemplate = ({ report }: { report: AIReport }) => {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <title>{report.project.title} - SDG Impact Report</title>
        {/* We will inject Tailwind and custom print CSS here during the render step */}
      </Head>
      <body className="bg-white text-gray-900 font-sans antialiased">
        
        {/* Cover Page */}
        <div className="page-break flex flex-col justify-center items-center h-[1056px] text-center px-12 bg-slate-50 border-8 border-blue-600 relative">
          <div className="absolute top-12 left-12">
            <h2 className="text-xl font-bold text-blue-600 tracking-wider uppercase">Novelleyx SDG Platform</h2>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
            {report.project.title}
          </h1>
          <div className="w-24 h-1.5 bg-blue-600 mb-8 mx-auto rounded-full"></div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">SDG Impact Assessment Report</h3>
          <p className="text-lg text-gray-500 mb-16">Version {report.report_version}</p>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl text-left">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Student Name</p>
                <p className="text-xl font-bold text-gray-900">{report.project.student_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Institution</p>
                <p className="text-xl font-bold text-gray-900">{report.project.institution}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Overall SDG Score</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="text-5xl font-black text-blue-600">{report.scores.overall.toFixed(1)}</div>
                  <div className="text-sm text-gray-500 max-w-[200px]">Out of 100 based on alignment, impact, and evidence.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary & Scores */}
        <div className="page-break p-12 h-[1056px] relative">
          <div className="report-header">
            <span>SDG Impact Report</span>
            <span>{report.project.title}</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4 mt-8">Executive Summary</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100">
            {report.executive_summary}
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Project Overview</h2>
          <p className="text-gray-700 leading-relaxed text-base mb-10">
            {report.project.description}
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Evaluation Scores</h2>
          <div className="grid grid-cols-2 gap-4">
            <ScoreCard title="SDG Alignment" score={report.scores.sdg_alignment} />
            <ScoreCard title="Evidence Quality" score={report.scores.evidence} />
            <ScoreCard title="Impact Potential" score={report.scores.impact} />
            <ScoreCard title="Measurability" score={report.scores.measurability} />
            <ScoreCard title="Scalability" score={report.scores.scalability} />
            <ScoreCard title="Sustainability" score={report.scores.sustainability} />
          </div>
        </div>

        {/* SDG Analysis Details */}
        <div className="page-break p-12">
          <div className="report-header">
            <span>SDG Analysis</span>
            <span>{report.project.title}</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8 mt-8 border-b pb-4">SDG Mapping & Evaluation</h2>
          
          <div className="space-y-8">
            {report.sdg_analysis.map((sdg, idx) => (
              <div key={idx} className="sdg-card bg-white border border-gray-200 rounded-xl p-6 shadow-sm keep-together">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
                      {sdg.sdg_id}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{sdg.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase tracking-wider mt-1">
                        {sdg.classification}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-blue-600">{sdg.alignment_score}</div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Alignment</div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">{sdg.reason}</p>
                  
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Relevant Targets</h4>
                      <div className="flex flex-wrap gap-2">
                        {sdg.targets.map((t, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Confidence Score</h4>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${sdg.confidence * 100}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{(sdg.confidence * 100).toFixed(0)}% AI Confidence</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Evidence Provided</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      {sdg.evidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>

                  {sdg.missing_evidence.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-bold text-orange-700 uppercase tracking-wider mb-2">Missing Evidence for Verification</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        {sdg.missing_evidence.map((ev, i) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Analysis */}
        <div className="page-break p-12">
          <div className="report-header">
            <span>Impact Analysis</span>
            <span>{report.project.title}</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8 mt-8 border-b pb-4">Detailed Impact Assessment</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <ImpactSection title="Environmental Impact" data={report.impact_analysis.environmental} colorClass="text-green-700" bgClass="bg-green-50" borderClass="border-green-200" />
            <ImpactSection title="Social Impact" data={report.impact_analysis.social} colorClass="text-purple-700" bgClass="bg-purple-50" borderClass="border-purple-200" />
            <ImpactSection title="Economic Impact" data={report.impact_analysis.economic} colorClass="text-blue-700" bgClass="bg-blue-50" borderClass="border-blue-200" />
          </div>
        </div>

        {/* KPIs and Recommendations */}
        <div className="page-break p-12">
          <div className="report-header">
            <span>Recommendations</span>
            <span>{report.project.title}</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-8 border-b pb-4">Strengths & Weaknesses</h2>
          <div className="grid grid-cols-2 gap-8 mb-10 keep-together">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-emerald-800 mb-4">Project Strengths</h3>
              <ul className="list-disc pl-5 text-emerald-900 space-y-2 text-sm">
                {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-red-800 mb-4">Areas for Improvement</h3>
              <ul className="list-disc pl-5 text-red-900 space-y-2 text-sm">
                {report.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Recommended KPIs</h2>
          <table className="w-full text-left border-collapse mb-10 keep-together">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="p-4 font-bold text-slate-700">KPI Name</th>
                <th className="p-4 font-bold text-slate-700">Description</th>
                <th className="p-4 font-bold text-slate-700">Unit of Measurement</th>
              </tr>
            </thead>
            <tbody>
              {report.kpis.map((kpi, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="p-4 font-semibold text-gray-900">{kpi.name}</td>
                  <td className="p-4 text-gray-600 text-sm">{kpi.description}</td>
                  <td className="p-4 text-gray-600 text-sm font-mono bg-slate-50">{kpi.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Strategic Recommendations</h2>
          <div className="space-y-4 mb-10">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-700 text-sm">{rec}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 border-b pb-4">Future Potential & Conclusion</h2>
          <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-4 keep-together">
            <p className="text-gray-700 text-sm leading-relaxed"><strong className="text-gray-900">Future Potential:</strong> {report.future_potential}</p>
            <p className="text-gray-700 text-sm leading-relaxed"><strong className="text-gray-900">Conclusion:</strong> {report.conclusion}</p>
          </div>
          
          <div className="mt-16 text-center text-xs text-gray-400">
            <p>Generated by Novelleyx SDG AI Platform • Report Engine v1.0</p>
          </div>
        </div>

      </body>
    </html>
  );
};

const ScoreCard = ({ title, score }: { title: string, score: number }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between keep-together">
    <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{title}</div>
    <div className="flex items-end justify-between">
      <div className="text-4xl font-black text-gray-900">{score.toFixed(0)}</div>
      <div className="text-xs text-gray-400 font-semibold mb-1">/ 100</div>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
      <div className={`h-1.5 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
    </div>
  </div>
);

const ImpactSection = ({ title, data, colorClass, bgClass, borderClass }: { title: string, data: { score: number, type: string, analysis: string, key_factors: string[] }, colorClass: string, bgClass: string, borderClass: string }) => (
  <div className={`border ${borderClass} rounded-xl p-6 keep-together bg-white relative overflow-hidden`}>
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full ${bgClass} opacity-50`}></div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <h3 className={`text-xl font-bold ${colorClass}`}>{title}</h3>
      <div className="text-right">
        <div className={`text-3xl font-black ${colorClass}`}>{data.score}</div>
        <div className="text-xs text-gray-500 uppercase font-semibold">Impact Score</div>
      </div>
    </div>
    
    <div className="mb-4 relative z-10">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase tracking-wider">
        Type: {data.type}
      </span>
    </div>
    
    <p className="text-gray-700 text-sm leading-relaxed mb-4 relative z-10">{data.analysis}</p>
    
    <div className="mt-4 pt-4 border-t border-gray-100 relative z-10">
      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Key Factors</h4>
      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
        {data.key_factors.map((kf: string, i: number) => (
          <li key={i}>{kf}</li>
        ))}
      </ul>
    </div>
  </div>
);
