import React, { useState } from 'react';
import { Target, ChevronRight, Check } from 'lucide-react';
import { AIGeneratedResult } from './AIGeneratedResult';

export function BriefBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [briefData, setBriefData] = useState({
    clientName: '',
    industry: '',
    website: '',
    competitors: '',
    objective: 'awareness',
    audience: '',
    budget: '',
    tone: 'professional',
    imageryStyle: '',
    colors: '',
    dosAndDonts: ''
  });

  const steps = [
    { id: 1, title: 'Client Details' },
    { id: 2, title: 'Objective' },
    { id: 3, title: 'Creative' },
    { id: 4, title: 'Review' }
  ];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleChange = (e) => setBriefData({ ...briefData, [e.target.name]: e.target.value });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5001/api/brief/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefData })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate brief');

      setGeneratedResult(data);
    } catch (error) {
      console.error(error);
      alert('Error generating brief: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGeneratedResult(null);
    setCurrentStep(1);
  };

  if (generatedResult) {
    return <AIGeneratedResult result={generatedResult} onReset={handleReset} />;
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between relative mb-8">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted/50 -z-10 rounded-full" />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg ${isActive ? 'bg-primary text-primary-foreground scale-110 ring-4 ring-primary/20' :
                isCompleted ? 'bg-primary text-primary-foreground' : 'bg-card border-2 border-muted-foreground/30 text-muted-foreground'
              }`}>
              {isCompleted ? <Check className="w-5 h-5" /> : step.id}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel rounded-2xl p-6 sm:px-8 border-white/40 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/2" />

        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            AI Creative <span className="text-primary">Brief Builder</span>
          </h2>
          <p className="text-base text-muted-foreground mt-1.5 font-medium">
            Generate print-ready strategic directions instantly.
          </p>
        </div>
      </div>

      <div className="glass-panel border-white/40 dark:border-white/5 rounded-2xl p-6 sm:p-10 relative">
        {renderStepIndicator()}

        <div className="min-h-[300px] mt-8 bg-card/30 rounded-xl p-6 border border-border/50">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold border-b border-border/50 pb-4">Client Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Client/Brand Name</label>
                  <input name="clientName" value={briefData.clientName} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" placeholder="e.g. Lumiere Skincare" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Industry Sector</label>
                  <input name="industry" value={briefData.industry} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" placeholder="e.g. Beauty / D2C" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-muted-foreground">Website URL</label>
                  <input name="website" value={briefData.website} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" placeholder="https://..." />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-muted-foreground">Key Competitors</label>
                  <textarea name="competitors" value={briefData.competitors} onChange={handleChange} rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm resize-none" placeholder="List top 3 competitors..." />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold border-b border-border/50 pb-4">Campaign Objective</h3>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Primary Goal</label>
                <select name="objective" value={briefData.objective} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm">
                  <option value="awareness">Brand Awareness (Reach & Impressions)</option>
                  <option value="consideration">Consideration (Traffic & Engagement)</option>
                  <option value="conversion">Conversion (Sales & Leads)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Target Audience</label>
                <textarea name="audience" value={briefData.audience} onChange={handleChange} rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm resize-none" placeholder="Describe demographics, interests, and pain points..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Campaign Budget ($)</label>
                <input type="number" name="budget" value={briefData.budget} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" placeholder="50000" />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold border-b border-border/50 pb-4">Creative Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Tone of Voice</label>
                  <select name="tone" value={briefData.tone} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm">
                    <option value="professional">Professional & Authoritative</option>
                    <option value="fun">Fun & Quirky</option>
                    <option value="urgent">Urgent & Sales-Driven</option>
                    <option value="luxury">Luxury & Premium</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Imagery Style</label>
                  <input name="imageryStyle" value={briefData.imageryStyle} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" placeholder="e.g. Minimalist, UGC, High-fashion" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-muted-foreground">Color Palette Direction</label>
                  <input name="colors" value={briefData.colors} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" placeholder="e.g. Earth tones, Neon accents, Black & White" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-muted-foreground">Brand Do's & Dont's</label>
                  <textarea name="dosAndDonts" value={briefData.dosAndDonts} onChange={handleChange} rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm resize-none" placeholder="Do: Show authentic faces. Don't: Use stock photos..." />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold border-b border-border/50 pb-4">Review & Generate</h3>
              <div className="bg-muted/40 rounded-xl p-6 border border-border/50 text-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-muted-foreground font-semibold">Client:</span> <span className="font-medium text-foreground">{briefData.clientName || 'N/A'}</span></div>
                  <div><span className="text-muted-foreground font-semibold">Budget:</span> <span className="font-medium text-foreground">${briefData.budget || 'N/A'}</span></div>
                  <div><span className="text-muted-foreground font-semibold">Objective:</span> <span className="font-medium text-foreground capitalize">{briefData.objective}</span></div>
                  <div><span className="text-muted-foreground font-semibold">Tone:</span> <span className="font-medium text-foreground capitalize">{briefData.tone}</span></div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center pt-2">
                All parameters look good? Sending this to the LLM agent will generate a complete creative strategy.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border/50">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isGenerating}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Go Back
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-lg hover:opacity-90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-emerald-500 text-white font-bold px-8 py-2.5 rounded-lg hover:opacity-90 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate AI Brief'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
