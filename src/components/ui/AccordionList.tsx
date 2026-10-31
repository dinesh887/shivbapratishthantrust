import type { AccordionContent } from "@/src/data/content";

function RuleIcon({ index }: { index: number }) {
  const icons = [
    <><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></>,
    <><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7.5 18c1-2.5 2.5-3.5 4.5-3.5s3.5 1 4.5 3.5"/></>,
    <><circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/></>,
    <><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/></>,
    <><circle cx="12" cy="12" r="9"/><path d="M12 7.5V13M12 16.5v.01"/></>,
  ];
  return <span className="ic"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[index % icons.length]}</svg></span>;
}

export default function AccordionList({ group, items }: { group: "rules" | "faq"; items: AccordionContent[] }) {
  return <>{items.map((item, index) => <details key={item.question} data-accordion-group={group} data-accordion-index={index} open={index === 0}>
    <summary>{group === "rules" && <RuleIcon index={index} />}{item.question}</summary>
    <div className={group === "rules" ? "ab" : "fa"}>{item.answers.length > 1 ? <ol>{item.answers.map(answer => <li key={answer}>{answer}</li>)}</ol> : item.answers.map(answer => <p key={answer}>{answer}</p>)}</div>
  </details>)}</>;
}

