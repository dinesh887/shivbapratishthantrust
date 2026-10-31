"use client";

import Image from "next/image";
import { useLanguageContent } from "@/src/components/layout/LanguageProvider";

const positions = ["c2", "c1", "c3"];
const medals = ["m2", "m1", "m3"];
const badges = ["bd2", "bd1", "bd3"];

function WinnerPodium({ winners }: { winners: { team: string; fort: string; image: {src:string;alt:string} }[] }) {
  return <div className="pod">{winners.map((winner, index) => <div className={`col ${positions[index]}`} key={`${winner.team}-${index}`}><div className={`mc ${medals[index]}`}><div className={`bdg ${badges[index]}`}/><div className="mp"><div>{winner.image.src ? <Image src={winner.image.src} alt={winner.image.alt} width={300} height={300} style={{ objectPosition: index === 0 ? "50% 40%" : index === 1 ? "50% 35%" : "50% 25%" }}/> : winner.image.alt}</div></div><div className="mn">{winner.team}</div>{winner.fort && <div className="mf"><svg viewBox="0 0 24 24" width="20" height="20" fill="#980315" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>{winner.fort}</div>}<i className="mo"/></div><div className="pd"><i className="t"/><i className="b"/>{index === 1 && <span className="pl"/>}</div></div>)}</div>;
}

export default function WinnersSection() {
  const content = useLanguageContent();
  const winners = content.sections.winners;
  return <section id="winners" className="wsec"><div className="w"><div className="wh"><div className="wt"><i/><h2>{winners.title}</h2><i/></div><p>{winners.description}</p></div><div className="yts" role="tablist" aria-label={winners.yearLabel}>{winners.yearTabs.map((tab, index) => <button type="button" className={`yt${index === 0 ? " on" : ""}`} role="tab" aria-selected={index === 0} data-y={tab.value} key={tab.value}>{tab.label}</button>)}</div>{winners.yearTabs.map((tab, index) => <div className={`wp${index === 0 ? " on" : ""}`} role="tabpanel" data-y={tab.value} key={tab.value}><WinnerPodium winners={winners.years[tab.value as keyof typeof winners.years]}/></div>)}</div><div className="wbot"><div className="tl"><i/><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#B8741A" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6"/></svg><i/></div><p>{winners.thankYou}</p></div></section>;
}
