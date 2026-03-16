// import { useState } from "react";
// import { ArrowLeft, Brain, Sparkles, Upload, FileText, AlertCircle, Loader2, Lightbulb, Target, Star, CheckCircle2, X } from "lucide-react";

// export function AITaskBreakdownScreen({ onBack, onAnalyze, savedTaskData }) {
//   const [taskPrompt, setTaskPrompt] = useState(savedTaskData?.taskPrompt || "");
//   const [rubricFile, setRubricFile] = useState(savedTaskData?.rubricFile || null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [error, setError] = useState(null);

//   const validateFile = (file) => {
//     const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
//     if (!validTypes.includes(file.type)) {
//       setError("Please upload a PDF or Image file (PNG/JPG).");
//       return false;
//     }
//     setError(null);
//     return true;
//   };

//   const handleRubricUpload = (e) => {
//     if (e.target.files && e.target.files[0]) setRubricFile(e.target.files[0]);
//   };

//   const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
//   const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       if (validateFile(e.dataTransfer.files[0])) setRubricFile(e.dataTransfer.files[0]);
//     }
//   };

//   const handlePaste = (e) => {
//     const items = e.clipboardData.items;
//     for (let item of items) {
//       if (item.type.startsWith('image/')) { setRubricFile(item.getAsFile()); setError(null); break; }
//     }
//   };


// const handleGenerate = async () => {
//     console.log("🖱️ Button Clicked!"); 
//     console.log("Current Prompt:", taskPrompt);
    
//     // 1. Validation
//     if (!taskPrompt.trim()) {
//       console.error("❌ Prompt is empty");
//       setError("Please describe your task first.");
//       return;
//     }

//     setIsProcessing(true);
//     setError(null);

//     try {
//       // 2. Create FormData for file upload
//       const formData = new FormData();
//       formData.append("userPrompt", taskPrompt);
      
//       // ✅ HARDCODED USHNA BATOOL'S ID FROM THE SEED FILE
//       formData.append("userId", "a1111111-1111-1111-1111-111111111111"); 

//       if (rubricFile) {
//         formData.append("rubricFile", rubricFile);
//       }

//       console.log("🚀 Sending request to AI Agent...");

//       // 3. API Call (Changed to 127.0.0.1 for stability)
//       const response = await fetch("http://127.0.0.1:5000/api/ai/generate", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "The AI Agent encountered an error while processing.");
//       }

//       console.log("✅ AI Response Received:", data);
      
//       // 4. Send the REAL AI data to the next screen!
//       if (onAnalyze) {
//         onAnalyze({
//           originalPrompt: taskPrompt,
//           rubricUsed: !!rubricFile,
//           aiResult: data.data // ✨ Passes the actual Gemini backend data!
//         });
//       }

//     } catch (err) {
//       // 5. This CATCH block was missing!
//       console.error("❌ Generation Error:", err);
//       setError(err.message);
//     } finally {
//       setIsProcessing(false); // Turns off the loading spinner
//     }
//   };

//   const removeFile = () => {
//     setRubricFile(null);
//   };

// return (
//     <div className="min-h-screen p-8" style={{ background: '#f5eef8' }}>
//       <div className="max-w-5xl mx-auto space-y-8 relative">
        
//         {/* Header */}
//         <div className="flex items-center gap-4">
//           <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80" style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.2)' }}>
//             <ArrowLeft className="h-4 w-4" style={{ color: '#9575a3' }} />
//           </button>
//           <div className="flex-1 flex items-center gap-3">
//             <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#b39ddb' }}>
//               <Brain className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-3xl font-semibold" style={{ color: '#5a4a61' }}>AI Smart Task Breakdown</h1>
//           </div>
//         </div>

//         {/* AI Agent Info Section */}
//         <div className="relative">
//           <div className="rounded-3xl p-10 shadow-sm overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
//             <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(179, 157, 219, 0.1) 0%, rgba(248, 187, 208, 0.1) 100%)' }} />
            
//             <div className="relative space-y-8">
//               <div className="text-center space-y-3">
//                 <div className="flex items-center justify-center gap-3">
//                   <div className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse" style={{ background: '#b39ddb' }}>
//                     <Sparkles className="h-8 w-8 text-white" />
//                   </div>
//                 </div>
//                 <h2 className="text-2xl font-semibold" style={{ color: '#b39ddb' }}>
//                   Meet Your AI Learning Guide
//                 </h2>
//                 <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: '#9575a3' }}>
//                   I'm here to help you organize your tasks into clear, manageable steps. 
//                   I won't solve your homework—but I'll guide you to success! 🌟
//                 </p>
//               </div>

//               <div className="grid md:grid-cols-3 gap-6">
//                 {/* Card 1 */}
//                 <div className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
//                   <div className="space-y-4">
//                     <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: '#f3e5f5' }}>
//                       <Target className="h-7 w-7" style={{ color: '#b39ddb' }} />
//                     </div>
//                     <h3 className="font-semibold text-lg" style={{ color: '#5a4a61' }}>What I Do</h3>
//                     <ul className="space-y-2 text-sm" style={{ color: '#9575a3' }}>
//                       <li className="flex items-start gap-2">
//                         <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
//                         <span>Break complex tasks into steps</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
//                         <span>Suggest helpful resources</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
//                         <span>Create manageable timelines</span>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>

//                 {/* Card 2 */}
//                 <div className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group" style={{ background: '#ffffff', border: '1px solid rgba(248, 187, 208, 0.2)' }}>
//                   <div className="space-y-4">
//                     <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: '#fce4ec' }}>
//                       <AlertCircle className="h-7 w-7" style={{ color: '#f8bbd0' }} />
//                     </div>
//                     <h3 className="font-semibold text-lg" style={{ color: '#5a4a61' }}>What I Don't Do</h3>
//                     <ul className="space-y-2 text-sm" style={{ color: '#9575a3' }}>
//                       <li className="flex items-start gap-2">
//                         <X className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#f8bbd0' }} />
//                         <span>Solve problems for you</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <X className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#f8bbd0' }} />
//                         <span>Write your assignments</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <X className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#f8bbd0' }} />
//                         <span>Give direct answers</span>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>

//                 {/* Card 3 */}
//                 <div className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
//                   <div className="space-y-4">
//                     <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: '#e1bee7' }}>
//                       <Lightbulb className="h-7 w-7" style={{ color: '#b39ddb' }} />
//                     </div>
//                     <h3 className="font-semibold text-lg" style={{ color: '#5a4a61' }}>Best Prompt Tips</h3>
//                     <ul className="space-y-2 text-sm" style={{ color: '#9575a3' }}>
//                       <li className="flex items-start gap-2">
//                         <Star className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
//                         <span>Include all requirements</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <Star className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
//                         <span>Mention your deadline</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <Star className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
//                         <span>Be specific & detailed</span>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               <div className="rounded-3xl p-6 border-2 border-dashed" style={{ background: '#fdf7fd', borderColor: 'rgba(179, 157, 219, 0.3)' }}>
//                 <div className="flex items-start gap-4">
//                   <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#b39ddb' }}>
//                     <Sparkles className="h-5 w-5 text-white" />
//                   </div>
//                   <div className="space-y-2 flex-1">
//                     <h4 className="font-semibold text-sm" style={{ color: '#5a4a61' }}>Example of a Great Prompt:</h4>
//                     <p className="text-sm leading-relaxed italic" style={{ color: '#9575a3' }}>
//                       "Write a 10-page research paper on climate change impacts. Must include 5 peer-reviewed sources, 
//                       proper citations, abstract, introduction, methodology, findings, and conclusion. Due in 2 weeks. 
//                       I need help organizing my research and writing process."
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Input Section */}
//         <div className="relative">
//           <div className="rounded-3xl p-8 shadow-sm overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
//             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(248, 187, 208, 0.1) 0%, rgba(179, 157, 219, 0.1) 100%)' }} />
            
//             <div className="relative space-y-6">
//               {error && (
//                 <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
//                   <AlertCircle size={18} />
//                   {error}
//                 </div>
//               )}
//               {rubricFile && (
//                 <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#f3e5f5', border: '1px solid rgba(179, 157, 219, 0.3)' }}>
//                   <FileText className="h-5 w-5 flex-shrink-0" style={{ color: '#b39ddb' }} />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate" style={{ color: '#5a4a61' }}>{rubricFile.name}</p>
//                     <p className="text-xs" style={{ color: '#9575a3' }}>
//                       {(rubricFile.size / 1024).toFixed(2)} KB
//                     </p>
//                   </div>
//                   <button
//                     onClick={removeFile}
//                     className="rounded-full h-8 w-8 p-0 flex items-center justify-center hover:opacity-80 transition-opacity"
//                     style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}
//                   >
//                     <X className="h-4 w-4" style={{ color: '#9575a3' }} />
//                   </button>
//                 </div>
//               )}

//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#f3e5f5' }}>
//                       <FileText className="h-5 w-5" style={{ color: '#b39ddb' }} />
//                     </div>
//                     <label className="text-lg font-medium" style={{ color: '#5a4a61' }}>
//                       Describe your task or assignment
//                     </label>
//                   </div>
                  
//                   <div>
//                     <input
//                       type="file"
//                       id="file-upload"
//                       onChange={handleRubricUpload}
//                       accept=".pdf,.doc,.docx,.txt"
//                       className="hidden"
//                     />
//                     <label htmlFor="file-upload">
//                       <span className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-opacity hover:opacity-80" style={{ background: '#fdf7fd', border: '1px solid rgba(179, 157, 219, 0.2)', color: '#5a4a61' }}>
//                         <Upload className="h-4 w-4" />
//                         Upload Files
//                       </span>
//                     </label>
//                   </div>
//                 </div>
                
//                 <div 
//                   className="relative"
//                   onDragOver={handleDragOver}
//                   onDragLeave={handleDragLeave}
//                   onDrop={handleDrop}
//                 >
//                   <textarea
//                     value={taskPrompt}
//                     onChange={(e) => setTaskPrompt(e.target.value)}
//                     onPaste={handlePaste}
//                     placeholder={"Example: Write a 10-page research paper on climate change impacts...\n\nYou can also drag and drop files here! 📄"}
//                     className={`w-full h-56 p-6 rounded-3xl resize-none focus:outline-none transition-all text-base ${
//                       isDragging ? 'border-dashed' : ''
//                     }`}
//                     style={{
//                       background: isDragging ? '#f3e5f5' : '#fdf7fd',
//                       border: isDragging ? '2px dashed #b39ddb' : '1px solid rgba(179, 157, 219, 0.2)',
//                       color: '#5a4a61',
//                       boxShadow: isDragging ? '0 0 0 4px rgba(179, 157, 219, 0.1)' : 'none'
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = '#b39ddb';
//                       e.target.style.boxShadow = '0 0 0 4px rgba(179, 157, 219, 0.1)';
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = 'rgba(179, 157, 219, 0.2)';
//                       e.target.style.boxShadow = 'none';
//                     }}
//                   />
                  
//                   {isDragging && (
//                     <div className="absolute inset-0 flex items-center justify-center rounded-3xl border-2 border-dashed pointer-events-none" style={{ background: 'rgba(179, 157, 219, 0.05)', borderColor: '#b39ddb' }}>
//                       <div className="text-center space-y-2">
//                         <Upload className="h-12 w-12 mx-auto" style={{ color: '#b39ddb' }} />
//                         <p className="text-lg font-medium" style={{ color: '#b39ddb' }}>Drop your files here</p>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="absolute bottom-5 right-5 text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(179, 157, 219, 0.2)', color: '#9575a3' }}>
//                     {taskPrompt.length} characters
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-2">
//                 <button
//                   onClick={handleGenerate}
//                   disabled={isProcessing || !taskPrompt.trim()}
//                   className="w-full h-16 rounded-full text-lg font-medium text-white group relative overflow-hidden transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                   style={{ background: isProcessing || !taskPrompt.trim() ? '#e1bee7' : '#b39ddb' }}
//                 >
//                   <div className="absolute inset-0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
                  
//                   {isProcessing ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <Loader2 className="h-6 w-6 animate-spin" />
//                       AI is analyzing your task...
//                     </span>
//                   ) : (
//                     <span className="flex items-center justify-center gap-2">
//                       <Sparkles className="h-6 w-6" />
//                       Generate AI Breakdown
//                       <Sparkles className="h-6 w-6" />
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="rounded-3xl p-6 shadow-sm" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(179,157,219,0.2)' }}>
//             <div className="flex items-center justify-center gap-8 text-sm" style={{ color: '#9575a3' }}>
//               <div className="flex items-center gap-2">
//                 <span className="text-2xl">🔒</span>
//                 <span>Secure & Private</span>
//               </div>
//               <div className="w-px h-8" style={{ background: 'rgba(179, 157, 219, 0.2)' }} />
//               <div className="flex items-center gap-2">
//                 <span className="text-2xl">✨</span>
//                 <span>AI-Powered Guidance</span>
//               </div>
//               <div className="w-px h-8" style={{ background: 'rgba(179, 157, 219, 0.2)' }} />
//               <div className="flex items-center gap-2">
//                 <span className="text-2xl">🌿</span>
//                 <span>Calm & Focused</span>
//               </div>
//             </div>
//           </div>
//       </div>
//     </div>
//   );
// }

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

  const handleGenerate = async () => {
    console.log("🖱️ Button Clicked!"); 
    console.log("Current Prompt:", taskPrompt);
    
    // 1. Validation
    if (!taskPrompt.trim()) {
      console.error("❌ Prompt is empty");
      setError("Please describe your task first.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 2. Create FormData for file upload
      const formData = new FormData();
      formData.append("userPrompt", taskPrompt);
      
      // ✅ HARDCODED USHNA BATOOL'S ID FROM THE SEED FILE
      formData.append("userId", "a1111111-1111-1111-1111-111111111111"); 

      if (rubricFile) {
        formData.append("rubricFile", rubricFile);
      }

      console.log("🚀 Sending request to AI Agent...");

      // 3. API Call (Changed to 127.0.0.1 for stability)
      const response = await fetch("http://127.0.0.1:5000/api/ai/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The AI Agent encountered an error while processing.");
      }

      console.log("✅ AI Response Received:", data);
      
      // 4. Send the REAL AI data to the next screen!
      if (onAnalyze) {
        onAnalyze({
          originalPrompt: taskPrompt,
          rubricUsed: !!rubricFile,
          aiResult: data.data // ✨ Passes the actual Gemini backend data!
        });
      }

    } catch (err) {
      // 5. This CATCH block was missing!
      console.error("❌ Generation Error:", err);
      setError(err.message);
    } finally {
      setIsProcessing(false); // Turns off the loading spinner
    }
  };

  const removeFile = () => {
    setRubricFile(null);
  };

  return (
    <div className="min-h-screen p-8" style={{ background: '#f5eef8' }}>
      <div className="max-w-5xl mx-auto space-y-8 relative">
        
        {/* Header */}
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

        {/* AI Agent Info Section */}
        <div className="relative">
          <div className="rounded-3xl p-10 shadow-sm overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(179, 157, 219, 0.1) 0%, rgba(248, 187, 208, 0.1) 100%)' }} />
            
            <div className="relative space-y-8">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse" style={{ background: '#b39ddb' }}>
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: '#b39ddb' }}>
                  Meet Your AI Learning Guide
                </h2>
                <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: '#9575a3' }}>
                  I'm here to help you organize your tasks into clear, manageable steps. 
                  I won't solve your homework—but I'll guide you to success! 🌟
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: '#f3e5f5' }}>
                      <Target className="h-7 w-7" style={{ color: '#b39ddb' }} />
                    </div>
                    <h3 className="font-semibold text-lg" style={{ color: '#5a4a61' }}>What I Do</h3>
                    <ul className="space-y-2 text-sm" style={{ color: '#9575a3' }}>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
                        <span>Break complex tasks into steps</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
                        <span>Suggest helpful resources</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
                        <span>Create manageable timelines</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group" style={{ background: '#ffffff', border: '1px solid rgba(248, 187, 208, 0.2)' }}>
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: '#fce4ec' }}>
                      <AlertCircle className="h-7 w-7" style={{ color: '#f8bbd0' }} />
                    </div>
                    <h3 className="font-semibold text-lg" style={{ color: '#5a4a61' }}>What I Don't Do</h3>
                    <ul className="space-y-2 text-sm" style={{ color: '#9575a3' }}>
                      <li className="flex items-start gap-2">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#f8bbd0' }} />
                        <span>Solve problems for you</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#f8bbd0' }} />
                        <span>Write your assignments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#f8bbd0' }} />
                        <span>Give direct answers</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: '#e1bee7' }}>
                      <Lightbulb className="h-7 w-7" style={{ color: '#b39ddb' }} />
                    </div>
                    <h3 className="font-semibold text-lg" style={{ color: '#5a4a61' }}>Best Prompt Tips</h3>
                    <ul className="space-y-2 text-sm" style={{ color: '#9575a3' }}>
                      <li className="flex items-start gap-2">
                        <Star className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
                        <span>Include all requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
                        <span>Mention your deadline</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
                        <span>Be specific & detailed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl p-6 border-2 border-dashed" style={{ background: '#fdf7fd', borderColor: 'rgba(179, 157, 219, 0.3)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#b39ddb' }}>
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-semibold text-sm" style={{ color: '#5a4a61' }}>Example of a Great Prompt:</h4>
                    <p className="text-sm leading-relaxed italic" style={{ color: '#9575a3' }}>
                      "Write a 10-page research paper on climate change impacts. Must include 5 peer-reviewed sources, 
                      proper citations, abstract, introduction, methodology, findings, and conclusion. Due in 2 weeks. 
                      I need help organizing my research and writing process."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="relative">
          <div className="rounded-3xl p-8 shadow-sm overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(248, 187, 208, 0.1) 0%, rgba(179, 157, 219, 0.1) 100%)' }} />
            
            <div className="relative space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}
              {rubricFile && (
                <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#f3e5f5', border: '1px solid rgba(179, 157, 219, 0.3)' }}>
                  <FileText className="h-5 w-5 flex-shrink-0" style={{ color: '#b39ddb' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#5a4a61' }}>{rubricFile.name}</p>
                    <p className="text-xs" style={{ color: '#9575a3' }}>
                      {(rubricFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="rounded-full h-8 w-8 p-0 flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}
                  >
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
                    <label className="text-lg font-medium" style={{ color: '#5a4a61' }}>
                      Describe your task or assignment
                    </label>
                  </div>
                  
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleRubricUpload}
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                    />
                    <label htmlFor="file-upload">
                      <span className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-opacity hover:opacity-80" style={{ background: '#fdf7fd', border: '1px solid rgba(179, 157, 219, 0.2)', color: '#5a4a61' }}>
                        <Upload className="h-4 w-4" />
                        Upload Files
                      </span>
                    </label>
                  </div>
                </div>
                
                <div 
                  className="relative"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <textarea
                    value={taskPrompt}
                    onChange={(e) => setTaskPrompt(e.target.value)}
                    onPaste={handlePaste}
                    placeholder={"Example: Write a 10-page research paper on climate change impacts...\n\nYou can also drag and drop files here! 📄"}
                    className={`w-full h-56 p-6 rounded-3xl resize-none focus:outline-none transition-all text-base ${
                      isDragging ? 'border-dashed' : ''
                    }`}
                    style={{
                      background: isDragging ? '#f3e5f5' : '#fdf7fd',
                      border: isDragging ? '2px dashed #b39ddb' : '1px solid rgba(179, 157, 219, 0.2)',
                      color: '#5a4a61',
                      boxShadow: isDragging ? '0 0 0 4px rgba(179, 157, 219, 0.1)' : 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#b39ddb';
                      e.target.style.boxShadow = '0 0 0 4px rgba(179, 157, 219, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(179, 157, 219, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  {isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-3xl border-2 border-dashed pointer-events-none" style={{ background: 'rgba(179, 157, 219, 0.05)', borderColor: '#b39ddb' }}>
                      <div className="text-center space-y-2">
                        <Upload className="h-12 w-12 mx-auto" style={{ color: '#b39ddb' }} />
                        <p className="text-lg font-medium" style={{ color: '#b39ddb' }}>Drop your files here</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-5 right-5 text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(179, 157, 219, 0.2)', color: '#9575a3' }}>
                    {taskPrompt.length} characters
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing || !taskPrompt.trim()}
                  className="w-full h-16 rounded-full text-lg font-medium text-white group relative overflow-hidden transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: isProcessing || !taskPrompt.trim() ? '#e1bee7' : '#b39ddb' }}
                >
                  <div className="absolute inset-0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
                  
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      AI is analyzing your task...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="h-6 w-6" />
                      Generate AI Breakdown
                      <Sparkles className="h-6 w-6" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="rounded-3xl p-6 shadow-sm" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(179,157,219,0.2)' }}>
            <div className="flex items-center justify-center gap-8 text-sm" style={{ color: '#9575a3' }}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span>Secure & Private</span>
              </div>
              <div className="w-px h-8" style={{ background: 'rgba(179, 157, 219, 0.2)' }} />
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span>AI-Powered Guidance</span>
              </div>
              <div className="w-px h-8" style={{ background: 'rgba(179, 157, 219, 0.2)' }} />
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌿</span>
                <span>Calm & Focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}