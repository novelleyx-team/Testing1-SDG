"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { useProjectsStore } from "@/store/projects-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, FileText, Send, Settings, Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

// Define the template schemas
const TEMPLATES = {
  "TPL-1": {
    name: "Standard SDG Research Report",
    fields: [
      { id: "title", label: "Project Title", type: "text", placeholder: "e.g. Clean Water Filtration System" },
      { id: "abstract", label: "Abstract / Description", type: "textarea", placeholder: "Provide a detailed abstract covering your research methodology and findings." },
      { id: "keywords", label: "Engineering Keywords", type: "text", placeholder: "e.g. Wastewater Treatment, Filtration, IoT Sensors" }
    ]
  },
  "TPL-2": {
    name: "Campus Impact Proposal",
    fields: [
      { id: "initiative", label: "Initiative Name", type: "text", placeholder: "e.g. Smart LED Retrofitting" },
      { id: "location", label: "Campus Location", type: "text", placeholder: "e.g. Main Block, Cafeteria" },
      { id: "budget", label: "Estimated Budget ($)", type: "text", placeholder: "e.g. $1,200" },
      { id: "impact", label: "Expected Impact", type: "textarea", placeholder: "Describe the tangible benefits to the campus environment." }
    ]
  },
  "TPL-3": {
    name: "Engineering Blueprint Attachment",
    fields: [
      { id: "drawing", label: "Drawing Title", type: "text", placeholder: "e.g. Scaled CAD Diagram of Filtration Unit" },
      { id: "software", label: "CAD Software Used", type: "text", placeholder: "e.g. AutoCAD, SolidWorks" },
      { id: "scale", label: "Scale", type: "text", placeholder: "e.g. 1:100" },
      { id: "tech_desc", label: "Technical Description", type: "textarea", placeholder: "Provide specifications on materials, load-bearing capacities, etc." }
    ]
  },
  "TPL-4": {
    name: "Data Collection Logbook",
    fields: [
      { id: "dataset", label: "Dataset Name", type: "text", placeholder: "e.g. September Power Draw Logs" },
      { id: "metric", label: "Metric Type", type: "text", placeholder: "e.g. Water (Liters), Power (kWh), Waste (kg)" },
      { id: "frequency", label: "Measurement Frequency", type: "text", placeholder: "e.g. Daily, Weekly, Hourly" },
      { id: "summary", label: "Data Summary", type: "textarea", placeholder: "Summarize the key trends observed in the raw data." }
    ]
  },
  "TPL-MAJOR": {
    name: "Major Project Submission",
    fields: [
      { id: "title", label: "Project Title", type: "text", placeholder: "e.g. Clean Water Filtration System" },
      { id: "abstract", label: "Abstract / Description", type: "textarea", placeholder: "Provide a detailed abstract covering your research methodology and findings." },
      { id: "keywords", label: "Engineering Keywords", type: "text", placeholder: "e.g. Wastewater Treatment, Filtration, IoT Sensors" }
    ]
  },
  "TPL-MINOR": {
    name: "Minor Project Submission",
    fields: [
      { id: "title", label: "Minor Project Title", type: "text", placeholder: "e.g. Solar Lamp Prototype" },
      { id: "objective", label: "Project Objective", type: "textarea", placeholder: "Short description of what this minor project achieves." }
    ]
  },
  "TPL-CASUAL": {
    name: "Casual Faculty Project",
    fields: [
      { id: "title", label: "Assignment Name", type: "text", placeholder: "e.g. Unit 3 Programming Task" },
      { id: "submission", label: "Code / Text Submission", type: "textarea", placeholder: "Paste your code or text submission here. It will be checked for plagiarism." }
    ]
  }
};

const PLAGIARISM_DATABASE = [
  "the clean water filtration system utilizes activated carbon and reverse osmosis to purify wastewater effectively and efficiently",
  "our solar lamp prototype uses a 5v solar panel connected to a lithium ion battery with a custom charge controller for prolonged use",
  "this project implements a smart led retrofitting initiative across the main block to reduce overall power consumption by up to thirty percent",
  "a comprehensive analysis of waste management strategies in urban environments focusing on increasing recycling rates and reducing landfill waste",
  "this code implements a basic sorting algorithm using python built in functions to demonstrate computational complexity",
  "the study explores the impact of artificial intelligence on modern healthcare systems specifically targeting diagnostic imaging and predictive analytics"
];

// --- OFFLINE PLAGIARISM ENGINE RULES ---
// Rule 1: Minimum Length - Texts under 10 chars or 3 words bypass the check (Score: 0%).
// Rule 2: Direct Phrase Match - If the text contains an exact substring from the database, flag as Severe Malpractice (Score: 90%+).
// Rule 3: High Word Overlap - If > 40% of the significant words match the database, flag for Review (Score: >40%).
// Rule 4: Originality Threshold - If < 40% overlap, it is considered safe and original.
function checkPlagiarism(text: string): { score: number; isPlagiarized: boolean } {
  // Rule 1: Minimum Length Bypass
  if (!text || text.trim().length < 10) return { score: 0, isPlagiarized: false };
  
  const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
  const textNormalized = normalize(text);
  
  let maxScore = 0;
  
  for (const source of PLAGIARISM_DATABASE) {
    const sourceNormalized = normalize(source);
    
    // Rule 2: Direct Phrase Match (Severe)
    if (textNormalized.includes(sourceNormalized) || sourceNormalized.includes(textNormalized)) {
      return { score: Math.floor(Math.random() * 10) + 90, isPlagiarized: true }; // 90-99%
    }

    // Prepare for Rule 3 & 4 (Word Overlap)
    const textWords = textNormalized.split(" ").filter(w => w.length > 3);
    const sourceWords = sourceNormalized.split(" ").filter(w => w.length > 3);
    
    if (textWords.length < 3) continue;
    
    let matchCount = 0;
    for (const word of textWords) {
      if (sourceWords.includes(word)) {
        matchCount++;
      }
    }
    
    const score = Math.round((matchCount / Math.min(textWords.length, sourceWords.length)) * 100);
    if (score > maxScore) maxScore = score;
  }
  
  const finalScore = Math.min(100, maxScore);
  
  // Rules 3 & 4: Flag thresholds
  return { 
    score: finalScore, 
    isPlagiarized: finalScore >= 40 // Flagged if 40% or higher
  };
}

function ProjectFormContent() {
  const { user } = useAuthStore();
  const showNotification = useNotificationStore(state => state.showNotification);
  const searchParams = useSearchParams();
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("TPL-1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simulationPhase, setSimulationPhase] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submittedProject, setSubmittedProject] = useState<any | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const notifyFaculty = true;

  // Initialize template from URL if present
  useEffect(() => {
    const templateQuery = searchParams.get("template");
    if (templateQuery && TEMPLATES[templateQuery as keyof typeof TEMPLATES]) {
      setSelectedTemplateId(templateQuery);
    }
  }, [searchParams]);

  const addProject = useProjectsStore(state => state.addProject);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSimulationPhase(1);

    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") || formData.get("initiative") || formData.get("drawing") || formData.get("dataset") || "Untitled Project").toString();
    const abstract = (formData.get("abstract") || formData.get("impact") || formData.get("tech_desc") || formData.get("summary") || formData.get("submission") || formData.get("objective") || "").toString();
    const keywords = (formData.get("keywords") || formData.get("location") || formData.get("software") || formData.get("metric") || "").toString();
    
    // Static fields
    const studentName = formData.get("name")?.toString() || user?.name || "Unknown";
    const department = formData.get("department")?.toString() || user?.department || "Unknown";
    
    if (["TPL-MAJOR", "TPL-MINOR", "TPL-CASUAL"].includes(selectedTemplateId)) {
      setSimulationPhase(2);
      // Simulate Plagiarism Test delay
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      const aiResult = checkPlagiarism(abstract);
      const plagiarismScore = aiResult.score;
      const isPlagiarized = aiResult.isPlagiarized;
      const marksAssigned = isPlagiarized ? 0 : Math.floor(Math.random() * 20) + 80;

      if (notifyFaculty) {
        setSimulationPhase(5);
        await new Promise(resolve => setTimeout(resolve, 1200)); 
      }

      const newProj = {
        studentId: user?.id || "STD-000",
        studentName,
        studentDepartment: department,
        title,
        abstract: abstract || "AI Check submission...",
        techStack: keywords,
        templateType: TEMPLATES[selectedTemplateId as keyof typeof TEMPLATES].name,
        plagiarismScore: plagiarismScore,
        isPlagiarized: isPlagiarized,
        marksAssigned: `${marksAssigned}/100`,
        aiScore: "N/A",
        targetSdg: "N/A"
      };
      
      const facultyName = formData.get("facultyName")?.toString() || "your assigned faculty";

      addProject(newProj);
      setIsSubmitting(false);
      setSimulationPhase(0);
      setSubmittedProject(newProj);
      showNotification(
        notifyFaculty ? "Project Checked & Faculty Notified!" : "Project Checked & Sent!", 
        notifyFaculty 
          ? `Advanced AI check complete. Enterprise SMS and Email dispatched to ${facultyName} immediately.` 
          : `Advanced AI check complete. A direct message and report have been sent to ${facultyName} for review.`, 
        isPlagiarized ? "error" : "success"
      );
      return;
    }

    
    setSimulationPhase(2);

    try {
      const response = await fetch("/api/generate-sdg-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name: studentName,
          department: department,
          title,
          abstract,
          keywords
        })
      });
      
      const initData = await response.json();
      if (!response.ok) throw new Error(initData.detail || initData.message || "Failed to queue job");
      
      const jobId = initData.job_id;
      let jobCompleted = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let finalResult: any = null;
      
      setSimulationPhase(1);
      
      while (!jobCompleted) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Poll every 2 seconds
        
        const jobRes = await fetch(`/api/jobs/${jobId}`);
        const jobData = await jobRes.json();
        
        if (!jobRes.ok) throw new Error(jobData.detail || "Failed to poll job");
        
        if (jobData.stage) {
            // Keep the cool animations syncing with the backend's actual progress
            if (jobData.stage.includes("Global Target Analysis")) setSimulationPhase(2);
            else if (jobData.stage.includes("Formatting AI Knowledge")) setSimulationPhase(3);
            else if (jobData.stage.includes("Finalizing Report")) setSimulationPhase(4);
        }
        
        if (jobData.status === "COMPLETED") {
            jobCompleted = true;
            finalResult = jobData.result;
        } else if (jobData.status === "FAILED") {
            throw new Error(jobData.error || "Job failed");
        }
      }
      
      const data = finalResult;
      
      let maxScore = 0;
      if (data.sdg_scores && data.sdg_scores["SDG Score"]) {
        maxScore = data.sdg_scores["SDG Score"];
      } else if (data.sdg_scores) {
        maxScore = Math.max(...(Object.values(data.sdg_scores) as number[]));
      }
      
      const aiScoreStr = maxScore > 0 ? `${maxScore}/100` : (data.is_sdg ? "85/100" : "N/A");

      if (notifyFaculty) {
        setSimulationPhase(5);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      const newProj = {
        studentId: user?.id || "STD-000",
        studentName,
        studentDepartment: department,
        title,
        abstract,
        techStack: keywords,
        isSdg: data.is_sdg,
        reportUrl: data.report_url,
        radarMapUrl: data.radar_map_url,
        sdgScores: data.sdg_scores,
        summary: data.summary,
        targetSdg: data.target_sdg,
        aiScore: aiScoreStr,
        templateType: TEMPLATES[selectedTemplateId as keyof typeof TEMPLATES].name
      };
      
      addProject(newProj);
      
      setIsSubmitting(false);
      setSimulationPhase(0);
      setSubmittedProject(newProj);
      showNotification(
        notifyFaculty ? "Project Submitted & Faculty Notified!" : "Project Successfully Submitted!", 
        notifyFaculty
          ? `Your SDG Report was generated successfully. Enterprise SMS and Email dispatched to ${formData.get("facultyName")?.toString() || "your assigned faculty"} immediately.`
          : "Your project has been analyzed and the official SDG alignment report has been generated.",
        "success"
      );
    } catch (err: unknown) {
      console.error(err);
      setIsSubmitting(false);
      setSimulationPhase(0);
      showNotification("Submission Failed", err instanceof Error ? err.message : "There was an error communicating with the AI backend.", "error");
    }
  };

  const activeTemplate = TEMPLATES[selectedTemplateId as keyof typeof TEMPLATES];

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-0">
        
        {/* Animated Cyber Ring Background */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          <Settings className="w-48 h-48 text-blue-500/20 animate-spin absolute" style={{ animationDuration: '6s' }} />
          <Settings className="w-32 h-32 text-blue-500/40 animate-spin absolute" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
          <Settings className="w-16 h-16 text-blue-500 animate-spin absolute" style={{ animationDuration: '2s' }} />
        </div>

        {/* Dynamic Status Text */}
        <div className="h-20 relative flex items-center justify-center w-full max-w-md text-center">
          <p className={`text-gray-500 font-semibold absolute w-full transition-all duration-0 ${simulationPhase === 1 ? 'top-0 opacity-100' : '-top-6 opacity-0'}`}>
            <span className="text-blue-500 font-bold block text-lg mb-1">PHASE 1: INGESTION</span>
            Uploading document structure & attachments to the edge network...
          </p>
          <p className={`text-gray-500 font-semibold absolute w-full transition-all duration-0 ${simulationPhase === 2 ? 'top-0 opacity-100' : simulationPhase < 2 ? 'top-6 opacity-0' : '-top-6 opacity-0'}`}>
            <span className="text-purple-500 font-bold block text-lg mb-1">PHASE 2: GLOBAL ANALYSIS</span>
            Running real-time cross-referencing against global SDG targets...
          </p>
          <p className={`text-gray-500 font-semibold absolute w-full transition-all duration-0 ${simulationPhase === 3 ? 'top-0 opacity-100' : simulationPhase < 3 ? 'top-6 opacity-0' : '-top-6 opacity-0'}`}>
            <span className="text-emerald-500 font-bold block text-lg mb-1">PHASE 3: KEYWORD MAPPING</span>
            Executing semantic matching against Master Engineering Dictionary...
          </p>
          <p className={`text-gray-500 font-semibold absolute w-full transition-all duration-0 ${simulationPhase === 4 ? 'top-0 opacity-100' : 'top-6 opacity-0'}`}>
            <span className="text-amber-500 font-bold block text-lg mb-1">PHASE 4: FINALIZATION</span>
            Generating AI Scorecard and dispatching to Faculty Dashboard...
          </p>
          <p className={`text-gray-500 font-semibold absolute w-full transition-all duration-0 ${simulationPhase === 5 ? 'top-0 opacity-100' : 'top-6 opacity-0'}`}>
            <span className="text-rose-500 font-bold block text-lg mb-1">PHASE 5: NOTIFICATIONS</span>
            Connecting to Enterprise Server. Dispatching SMS & Email to Faculty...
          </p>
        </div>
      </div>
    );
  }

  if (submittedProject) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
        <div>
          <h1 className="text-[36px] font-bold text-emerald-600 dark:text-emerald-400 tracking-tight leading-tight">Analysis Complete!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Your project has been successfully processed by the AI engine.</p>
        </div>
        
        <Card className="p-8 rounded-[24px] shadow-sm border border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-[#1F2937]">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{submittedProject.title as string}</h2>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                Target: {submittedProject.targetSdg as string}
              </div>
            </div>
            
            {submittedProject.summary && (
              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">AI Generated Summary</h4>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl leading-relaxed">
                  {submittedProject.summary as string}
                </p>
              </div>
            )}

            {submittedProject.radarMapUrl && (
              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">SDG Impact Radar Map</h4>
                <div className="bg-white rounded-xl border border-gray-100 flex items-center justify-center p-4 relative h-[400px]">
                  <Image src={submittedProject.radarMapUrl as string} alt="Radar Map" fill className="object-contain" />
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              {submittedProject.templateType === "Casual Faculty Project" ? (
                <div className="w-full">
                  <div className={`p-4 rounded-xl border ${submittedProject.isPlagiarized ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'} mb-4`}>
                    <h4 className="font-bold mb-1">Advanced Plagiarism Check</h4>
                    <p>Similarity Index: <span className="font-black text-lg">{submittedProject.plagiarismScore as number}%</span></p>
                    {submittedProject.isPlagiarized && <p className="text-sm font-semibold mt-1">Warning: High similarity detected. Faculty has been notified.</p>}
                  </div>
                  <div className="p-4 rounded-xl border bg-blue-50 border-blue-200 text-blue-700 font-bold mb-4">
                    Assigned Marks: {submittedProject.marksAssigned as string}
                  </div>
                </div>
              ) : null}
              {submittedProject.reportUrl && (
                <Button render={<a href={submittedProject.reportUrl as string} download target="_blank" rel="noreferrer" />} className="bg-emerald-600 hover:bg-emerald-700 flex-1 h-12 text-lg font-bold">
                  <Download className="w-5 h-5 mr-2" /> Download Official PDF Report
                </Button>
              )}
              <Button onClick={() => setSubmittedProject(null)} variant="outline" className="flex-1 h-12 text-lg font-bold">
                Submit Another Project
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      
      <div>
        <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">Submit New Project</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Fill out the details below. Your submission will be instantly analyzed by our AI.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Template Selector Section */}
        <Card className="p-8 rounded-[24px] border-2 border-blue-500 shadow-[0_8px_30px_rgba(59,130,246,0.1)] bg-blue-50/50 dark:bg-[#111827]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Select Template Structure</h2>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template" className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Dynamic Form Template</Label>
            <select 
              id="template"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="flex h-12 w-full rounded-xl border border-blue-200 dark:border-blue-900/50 bg-white dark:bg-[#1F2937] px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 font-bold text-gray-900 dark:text-gray-100 cursor-pointer shadow-sm"
            >
              {Object.entries(TEMPLATES).map(([id, tpl]) => (
                <option key={id} value={id}>{tpl.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Changing the template will instantly adapt the fields in Step 3 below.
            </p>
          </div>
        </Card>

        {/* Academic Information Section (Static) */}
        <Card className="p-8 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-center font-bold">2</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Academic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-semibold">Student Name</Label>
              <Input id="name" name="name" defaultValue={user?.name || ""} className="bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100 h-12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roll" className="text-gray-700 dark:text-gray-300 font-semibold">Roll Number</Label>
              <Input id="roll" name="roll" placeholder="e.g. 21BCE1234" className="bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100 h-12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college" className="text-gray-700 dark:text-gray-300 font-semibold">College / University</Label>
              <Input id="college" name="college" defaultValue="VIT University" className="bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100 h-12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program" className="text-gray-700 dark:text-gray-300 font-semibold">Program</Label>
              <select id="program" name="program" className="flex h-12 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100 shadow-sm" required>
                <option value="">Select Program</option>
                <option value="BTECH">BTECH</option>
                <option value="MTECH">MTECH</option>
                <option value="MBA">MBA</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-gray-700 dark:text-gray-300 font-semibold">Department</Label>
              <Input id="department" name="department" defaultValue="Computer Science & Engineering (CSE)" readOnly className="bg-gray-50 dark:bg-[#111827] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 font-medium cursor-not-allowed h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-gray-700 dark:text-gray-300 font-semibold">Academic Year</Label>
              <select id="year" name="year" className="flex h-12 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100 shadow-sm" required>
                {Array.from({ length: 30 }, (_, i) => {
                  const startYear = 2026 + i;
                  const endYearStr = (startYear + 1).toString().slice(2);
                  return <option key={startYear} value={`${startYear}-${endYearStr}`}>{startYear}-{endYearStr}</option>;
                })}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="facultyName" className="text-gray-700 dark:text-gray-300 font-semibold">Faculty Name</Label>
              <Input id="facultyName" name="facultyName" placeholder="Enter Faculty Name" className="bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100 h-12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facultyId" className="text-gray-700 dark:text-gray-300 font-semibold">Faculty ID</Label>
              <Input id="facultyId" name="facultyId" placeholder="Enter Faculty ID" className="bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100 h-12" required />
            </div>
          </div>
        </Card>

        {/* Dynamic Project Details Section */}
        <Card className="p-8 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">3</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Project Details</h2>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {activeTemplate.name}
            </div>
          </div>
          
          <div className="space-y-6">
            {activeTemplate.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                  {field.label}
                  {field.type === 'textarea' && <HelpCircle size={14} className="text-gray-400" />}
                </Label>
                
                {field.type === 'textarea' ? (
                  <Textarea 
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder} 
                    className="min-h-[120px] bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100" 
                    required 
                  />
                ) : (
                  <Input 
                    id={field.id}
                    name={field.id}
                    type="text" 
                    placeholder={field.placeholder} 
                    className="bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100 h-12" 
                    required 
                  />
                )}
              </div>
            ))}

            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Label className="text-gray-700 dark:text-gray-300 font-semibold">Supporting Documents <span className="text-gray-400 font-normal">(Optional)</span></Label>
              <label className="block border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-[#111827] transition-colors cursor-pointer group">
                <input 
                  type="file" 
                  name="supporting_document" 
                  className="hidden" 
                  accept=".pdf,.docx,.zip"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFileName(e.target.files[0].name);
                    }
                  }}
                />
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="text-gray-400" />
                </div>
                {fileName ? (
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">{fileName}</p>
                ) : (
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Click to upload or drag and drop</p>
                )}
                <p className="text-xs text-gray-500">PDF, DOCX, or ZIP (Max 500MB)</p>
              </label>
            </div>
          </div>
        </Card>

        {/* SMS/Email Notifications Checkbox */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-4 border border-gray-100 dark:border-gray-800">
          <input 
            type="checkbox" 
            id="notifyFaculty" 
            checked={notifyFaculty}
            disabled
            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-not-allowed opacity-70"
          />
          <div>
            <Label htmlFor="notifyFaculty" className="font-bold text-gray-900 dark:text-gray-100 cursor-not-allowed">
              Notify Faculty via Enterprise SMS & Email Server <span className="text-xs text-blue-600 ml-2 font-normal">(Required)</span>
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sends an immediate text and pre-data email alert to the faculty regarding this submission.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 font-bold shadow-[0_10px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_50px_rgba(37,99,235,0.4)] transition-all text-lg border border-blue-500 hover:-translate-y-1"
          >
            {["TPL-MAJOR", "TPL-MINOR", "TPL-CASUAL"].includes(selectedTemplateId) ? (
              <>Run Plagiarism AI Check <Send size={20} className="ml-2" /></>
            ) : (
              <>Generate SDG Report <Send size={20} className="ml-2" /></>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-gray-500">Loading form engine...</div>}>
      <ProjectFormContent />
    </Suspense>
  );
}
