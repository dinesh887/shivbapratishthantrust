"use client";

import { useLanguageContent } from "@/src/components/layout/LanguageProvider";

function StepIcon({ icon }: { icon: string }) {
  const paths: Record<string, React.ReactNode> = {
    registration: <><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 17.5h3"/></>,
    fort: <path d="M5 21V9h14v12M5 9V6h2.5v1.5h2V6h3v1.5h2V6H19v3M10 21v-4a2 2 0 0 1 4 0v4M12 6V1.5M12 1.5l4 1.5-4 1.5"/>,
    model: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 9.67h18M3 14.33h18M9 5v4.67M15 9.67v4.66M9 14.33V19"/></>,
    photo: <><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/></>,
  };
  return <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#FFD21F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[icon]}</svg>;
}

export default function JoinSection() {
  const content = useLanguageContent();
  const join = content.sections.join;
  return <section id="join" className="sec join"><div className="w"><div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}><p className="kick">{join.eyebrow}</p><h2 className="h2">{join.title}</h2><div className="orn"><i/><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#980315" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 21V9h14v12M5 9V6h2.5v1.5h2V6h3v1.5h2V6H19v3M10 21v-4a2 2 0 0 1 4 0v4M12 6V1.5M12 1.5l4 1.5-4 1.5"/></svg><i/></div><p style={{ fontSize: 18, lineHeight: 1.6, margin: "16px 0 0", color: "#2B1810" }}>{join.description}</p></div>
    <div className="grid four" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 24, marginTop: 108 }}>{join.steps.map((step: {number:string;label:string;title:string;description:string;icon:string}) => <div className="stp" key={step.number}><div className="bd"><StepIcon icon={step.icon}/></div><div className="clip"><span className="big" aria-hidden="true">{step.number}</span></div><span className="lb">{step.label}</span><h3 className="st">{step.title}</h3><p className="sd">{step.description}</p></div>)}</div>
    <div style={{ textAlign: "center", marginTop: 32 }}><a className="btn" href="#register" style={{ background: "#7A0210", color: "#FFD21F" }}>{join.button}</a></div>
  </div></section>;
}
