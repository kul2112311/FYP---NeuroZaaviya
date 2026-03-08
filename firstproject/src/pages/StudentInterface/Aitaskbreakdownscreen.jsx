import { useState } from "react";
import { ArrowLeft, Brain, Sparkles, Upload, FileText, AlertCircle, Loader2, Lightbulb, Target, Star, CheckCircle2, X } from "lucide-react";

export function AITaskBreakdownScreen({ onBack, onAnalyze, savedTaskData }) {
  const [taskPrompt, setTaskPrompt] = useState(savedTaskData?.taskPrompt || "");
  const [rubricFile, setRubricFile] = useState(savedTaskData?.rubricFile || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Image file (PNG/JPG).");
      return false;
    }
    setError(null);
    return true;
  };

  const handleRubricUpload = (e) => {
    if (e.target.files && e.target.files[0]) setRubricFile(e.target.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (validateFile(e.dataTransfer.files[0])) setRubricFile(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith('image/')) { setRubricFile(item.getAsFile()); setError(null); break; }
    }
  };

  const handleGenerate = () => {
    if (!taskPrompt.trim()) { setError("Please describe your task first."); return; }
    setIsProcessing(true);
    setError(null);
    setTimeout(() => {
      setIsProcessing(false);
      if (onAnalyze) {
        onAnalyze({
          originalPrompt: taskPrompt,
          rubricUsed: !!rubricFile,
          aiResult: {
            subtasks: [
              { id: "st1", title: "Research and gather information", duration: "45min", estimated_minutes: 45, notes: "Collect all relevant sources and materials" },
              { id: "st2", title: "Create an outline", duration: "30min", estimated_minutes: 30, notes: "Structure your main ideas and sections" },
              { id: "st3", title: "Draft initial version", duration: "120min", estimated_minutes: 120, notes: "Write your first draft without worrying about perfection" },
              { id: "st4", title: "Review and refine", duration: "60min", estimated_minutes: 60, notes: "Check for clarity, flow, and completeness" },
              { id: "st5", title: "Final polish and submission", duration: "30min", estimated_minutes: 30, notes: "Proofread, format, and submit" },
            ]
          }
        });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen p-8" style={{ background: '#f5eef8' }}>
      <div className="max-w-5xl mx-auto space-y-8 relative">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80" style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.2)' }}>
            <ArrowLeft className="h-4 w-4" style={{ color: '#9575a3' }} />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#b39ddb' }}>
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold" style={{ color: '#5a4a61' }}>AI Smart Task Breakdown</h1>
          </div>
        </div>

        <div className="rounded-3xl p-10 shadow-sm overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.2)' }}>
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse mx-auto" style={{ background: '#b39ddb' }}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: '#b39ddb' }}>Meet Your AI Learning Guide</h2>
              <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: '#9575a3' }}>
                I'm here to help you organize your tasks into clear, manageable steps. I won't solve your homework—but I'll guide you to success! 🌟
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-3xl p-6 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.2)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#f3e5f5' }}>
                  <Target className="h-7 w-7" style={{ color: '#b39ddb' }} />
                </div>
                <h3 className="font-semibold text-lg mb-3" style={{ color: '#5a4a61' }}>What I Do</h3>
                <ul className="space-y-2 text-sm" style={{ color: '#9575a3' }}>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} /><span>Break complex tasks into steps</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} /><span>Suggest helpful resources</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} /><span>Create manageable timelines</span></li>
                </ul>
              </div>
              <div className="rounded-3xl p-6 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(248,187,208,0.2)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#fce4ec' }}>
                  <AlertCircle className="h-7 w-7" style={{ color: '#f8bbd0' }} />
                </div>
                <h3 className="font-semibold text-lg mb-3" style={{ color: '#5a4a61' }}>What I Don't Do</h3>
                <ul className="space-y-2 text-sm" style={{ color: '#9575a3' }}>
                  <li className="flex items-start gap-2"><X className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#f8bbd0' }} /><span>Solve problems for you</span></li>
                  <li className="flex items-start gap-2"><X className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#f8bbd0' }} /><span>Write your assignments</span></li>
                  <li className="flex items-start gap-2"><X className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#f8bbd0' }} /><span>Give direct answers</span></li>
                </ul>
              </div>
              <div className="rounded-3xl p-6 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.2)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#e1bee7' }}>
                  <Lightbulb className="h-7 w-7" style={{ color: '#b39ddb' }} />
                </div>
                <h3 className="font-semibold text-lg mb-3" style={{ color: '#5a4a61' }}>Best Prompt Tips</h3>
                <ul className="space-y-2 text-sm" style={{ color: '#9575a3' }}>
                  <li className="flex items-start gap-2"><Star className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} /><span>Include all requirements</span></li>
                  <li className="flex items-start gap-2"><Star className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} /><span>Mention your deadline</span></li>
                  <li className="flex items-start gap-2"><Star className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} /><span>Be specific & detailed</span></li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl p-6 border-2 border-dashed" style={{ background: '#fdf7fd', borderColor: 'rgba(179,157,219,0.3)' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#b39ddb' }}>
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1" style={{ color: '#5a4a61' }}>Example of a Great Prompt:</h4>
                  <p className="text-sm leading-relaxed italic" style={{ color: '#9575a3' }}>
                    "Write a 10-page research paper on climate change impacts. Must include 5 peer-reviewed sources, proper citations, abstract, introduction, methodology, findings, and conclusion. Due in 2 weeks."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl p-8 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.2)' }}>
          <div className="space-y-6">
            {rubricFile && (
              <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#f3e5f5', border: '1px solid rgba(179,157,219,0.3)' }}>
                <FileText className="h-5 w-5 flex-shrink-0" style={{ color: '#b39ddb' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#5a4a61' }}>{rubricFile.name}</p>
                  <p className="text-xs" style={{ color: '#9575a3' }}>{(rubricFile.size / 1024).toFixed(2)} KB</p>
                </div>
                <button onClick={() => setRubricFile(null)} className="rounded-full h-8 w-8 flex items-center justify-center hover:opacity-80" style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.2)' }}>
                  <X className="h-4 w-4" style={{ color: '#9575a3' }} />
                </button>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#f3e5f5' }}>
                    <FileText className="h-5 w-5" style={{ color: '#b39ddb' }} />
                  </div>
                  <span className="text-lg font-medium" style={{ color: '#5a4a61' }}>Describe your task or assignment</span>
                </div>
                <div>
                  <input type="file" id="file-upload" onChange={handleRubricUpload} accept=".pdf,.doc,.docx,.txt" className="hidden" />
                  <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm hover:opacity-80" style={{ background: '#fdf7fd', border: '1px solid rgba(179,157,219,0.2)', color: '#5a4a61' }}>
                    <Upload className="h-4 w-4" /> Upload Files
                  </label>
                </div>
              </div>

              <div className="relative" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                <textarea
                  value={taskPrompt}
                  onChange={(e) => setTaskPrompt(e.target.value)}
                  onPaste={handlePaste}
                  placeholder={"Describe your task or assignment in detail...\n\nYou can also drag and drop files here! 📄"}
                  className="w-full h-56 p-6 rounded-3xl resize-none focus:outline-none transition-all text-base"
                  style={{
                    background: isDragging ? '#f3e5f5' : '#fdf7fd',
                    border: isDragging ? '2px dashed #b39ddb' : '1px solid rgba(179,157,219,0.2)',
                    color: '#5a4a61',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#b39ddb'; e.target.style.boxShadow = '0 0 0 4px rgba(179,157,219,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(179,157,219,0.2)'; e.target.style.boxShadow = 'none'; }}
                />
                <div className="absolute bottom-5 right-5 text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(179,157,219,0.2)', color: '#9575a3' }}>
                  {taskPrompt.length} characters
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-2xl" style={{ background: '#fce4ec', border: '1px solid rgba(248,187,208,0.5)' }}>
                <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: '#e91e63' }} />
                <p className="text-sm" style={{ color: '#c2185b' }}>{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !taskPrompt.trim()}
              className="w-full h-16 rounded-full text-lg font-medium text-white relative overflow-hidden transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: isProcessing || !taskPrompt.trim() ? '#e1bee7' : '#b39ddb' }}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" /> AI is analyzing your task...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-6 w-6" /> Generate AI Breakdown <Sparkles className="h-6 w-6" />
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="rounded-3xl p-6 shadow-sm" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(179,157,219,0.2)' }}>
          <div className="flex items-center justify-center gap-8 text-sm" style={{ color: '#9575a3' }}>
            <div className="flex items-center gap-2"><span className="text-2xl">🔒</span><span>Secure & Private</span></div>
            <div className="w-px h-8" style={{ background: 'rgba(179,157,219,0.2)' }} />
            <div className="flex items-center gap-2"><span className="text-2xl">✨</span><span>AI-Powered Guidance</span></div>
            <div className="w-px h-8" style={{ background: 'rgba(179,157,219,0.2)' }} />
            <div className="flex items-center gap-2"><span className="text-2xl">🌿</span><span>Calm & Focused</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}