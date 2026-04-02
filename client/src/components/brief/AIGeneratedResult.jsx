import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Share2, Target, Sparkles, CheckCircle2 } from 'lucide-react';

export function AIGeneratedResult({ result, onReset }) {
  const pdfRef = useRef(null);

  const exportToPDF = async () => {
    if (!pdfRef.current) return;

    try {
      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_brief.pdf`);
    } catch (error) {
      console.error("PDF Export failed", error);
      alert("Failed to export PDF, please try again.");
    }
  };

  if (!result) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            AI Brief <span className="text-emerald-500">Generated</span>
          </h2>
          <p className="text-base text-muted-foreground mt-1.5 font-medium">
            Your campaign strategy is ready for deployment.
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={onReset}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-bold text-muted-foreground hover:bg-muted transition-all"
          >
            Start Over
          </button>
          <button
            onClick={exportToPDF}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-lg hover:opacity-90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* A4 Document Container for PDF Export */}
      <div className="bg-white text-zinc-900 rounded-xl shadow-xl overflow-hidden" ref={pdfRef}>
        {/* Header */}
        <div className="bg-zinc-900 text-white p-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">CampaignHQ</span>
            </div>
            <h1 className="text-4xl font-black mb-2">{result.title}</h1>
            <p className="text-zinc-400 font-medium">AI-Generated Campaign Strategy</p>
          </div>
          <Target className="w-16 h-16 text-zinc-700" />
        </div>

        {/* Content */}
        <div className="p-10 space-y-10">

          {/* Headlines Section */}
          <section>
            <h3 className="text-xl font-bold border-b-2 border-zinc-200 pb-3 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-sm">1</span>
              Key Headlines
            </h3>
            <div className="grid gap-4">
              {result.headlines && result.headlines.map((headline, idx) => (
                <div key={idx} className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="font-semibold text-lg text-zinc-800">{headline}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Tone Guide */}
            <section>
              <h3 className="text-xl font-bold border-b-2 border-zinc-200 pb-3 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-sm">2</span>
                Tone of Voice
              </h3>
              <p className="text-zinc-700 leading-relaxed">
                {result.tone_guide}
              </p>
            </section>

            {/* Visual Direction */}
            <section>
              <h3 className="text-xl font-bold border-b-2 border-zinc-200 pb-3 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-sm">3</span>
                Visual Direction
              </h3>
              <p className="text-zinc-700 leading-relaxed">
                {result.visual_direction}
              </p>
            </section>
          </div>

          {/* Channels Split */}
          <section>
            <h3 className="text-xl font-bold border-b-2 border-zinc-200 pb-3 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-sm">4</span>
              Channel Distribution
            </h3>
            <div className="space-y-5 bg-zinc-50 p-6 rounded-xl border border-zinc-200">
              {result.channels && result.channels.map((channel, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between font-bold text-zinc-800">
                    <span>{channel.name}</span>
                    <span>{channel.split}%</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 rounded-full"
                      style={{ width: `${channel.split}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="bg-zinc-100 p-6 text-center text-sm text-zinc-500 font-medium">
          Generated automatically by CampaignHQ AI Core • Complete Confidentiality Maintained
        </div>
      </div>
    </div>
  );
}
