"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { content as allContent } from "@/src/data/content";
import { useLanguageContent } from "@/src/components/layout/LanguageProvider";

function Required() { return <span className="rq">*</span>; }
function ErrorText({ name }: { name: string }) { return <span id={`${name}-error`} className="validation-error" data-error-for={name} hidden/>; }
function FortIcon({ icon }: { icon: string }) {
  const shapes: Record<string, ReactNode> = {
    mountain: <path d="M3 20l6-11 4 6 2-3 6 8z"/>,
    water: <path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>,
    fort: <path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M3 10l9-6 9 6z"/>,
    tree: <path d="M12 3l5 7h-3l4 6H6l4-6H7zM12 16v5"/>,
  };
  return <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#D9520B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[icon]}</svg>;
}

type DistrictOption = { value: string; label: string };

function DistrictSearchSelect({
  id,
  labelId,
  placeholder,
  searchPlaceholder,
  noResults,
  options,
}: {
  id: string;
  labelId: string;
  placeholder: string;
  searchPlaceholder: string;
  noResults: string;
  options: DistrictOption[];
}) {
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const selectedLabel = options.find((option) => option.value === selected)?.label ?? "";
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return normalizedQuery
      ? options.filter((option) => option.label.toLocaleLowerCase().includes(normalizedQuery))
      : options;
  }, [options, query]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  useEffect(() => {
    const form = valueRef.current?.form;
    const resetSelection = () => {
      setSelected("");
      setQuery("");
      setOpen(false);
    };
    form?.addEventListener("reset", resetSelection);
    return () => form?.removeEventListener("reset", resetSelection);
  }, []);

  function chooseDistrict(option: DistrictOption) {
    setSelected(option.value);
    setQuery("");
    setOpen(false);
    if (valueRef.current) {
      valueRef.current.value = option.value;
      valueRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      valueRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
    triggerRef.current?.focus();
  }

  function handleSearchKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && filteredOptions.length) {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filteredOptions.length - 1));
    } else if (event.key === "ArrowUp" && filteredOptions.length) {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && filteredOptions.length) {
      event.preventDefault();
      chooseDistrict(filteredOptions[Math.min(activeIndex, filteredOptions.length - 1)]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <div className="district-select" ref={rootRef}>
      <input type="hidden" name="district" value={selected} readOnly ref={valueRef} />
      <button
        id={`${id}-control`}
        ref={triggerRef}
        type="button"
        className="district-select-trigger"
        role="combobox"
        aria-labelledby={`${labelId} ${id}-value`}
        aria-haspopup="listbox"
        aria-required="true"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-describedby={`${id}-error`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setActiveIndex(0);
            setOpen(true);
          }
        }}
      >
        <span id={`${id}-value`} className={selectedLabel ? "" : "district-select-placeholder"}>{selectedLabel || placeholder}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="district-select-menu">
          <input
            ref={searchRef}
            type="search"
            className="district-select-search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            aria-controls={`${id}-options`}
            aria-activedescendant={filteredOptions.length ? `${id}-option-${activeIndex}` : undefined}
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleSearchKeyDown}
          />
          <div className="district-select-options" id={`${id}-options`} role="listbox" aria-label={searchPlaceholder}>
            {filteredOptions.length ? filteredOptions.map((option, index) => (
              <button
                id={`${id}-option-${index}`}
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected === option.value}
                className={`district-select-option${activeIndex === index ? " active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => chooseDistrict(option)}
              >
                {option.label}
              </button>
            )) : <p className="district-select-empty" role="status">{noResults}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegistrationSection() {
  const content = useLanguageContent();
  const registration = content.sections.register;
  const fields = registration.fields;
  const districtOptions = registration.districtOptions.map((label, index) => ({
    value: allContent.mr.sections.register.districtOptions[index],
    label,
  }));
  return <section id="register" className="reg"><div className="w grid two" style={{ gridTemplateColumns: "4fr 8fr", gap: 48, alignItems: "start" }}>
    <div><p className="kick" style={{ color: "#FFD21F" }}>{registration.eyebrow}</p><h2 className="h2" style={{ color: "#FBF3E4", fontSize: 40 }}>{registration.title}</h2><p style={{ fontSize: 18, lineHeight: 1.7, margin: "0 0 18px", color: "#F3E3C3" }}>{registration.description}</p><p style={{ margin: "0 0 14px", fontSize: 14, color: "#F3E3C3" }}>{registration.requiredNote}</p><div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,210,31,.45)", borderRadius: 10, padding: "10px 16px", color: "#FFD21F", fontWeight: 600 }}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#FFD21F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>{registration.secureNote}</div></div>
    <form className="card2" id="registration-form" noValidate><Image className="seal" src="/images/trust-seal.png" alt={content.layout.header.logo.alt} width={76} height={76}/>
      <div className="tabs" role="radiogroup" aria-label={registration.registrationTypeLabel}>{registration.registrationTypes.map((type, index) => <label className="tab" key={type.value}><input type="radio" name="rt" value={type.value} defaultChecked={index === 0} required/><span>{type.label}</span></label>)}</div>
      <div className="grid fld" style={{ gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
        <div className="f"><label htmlFor={fields.name.id}>{fields.name.label} <Required/></label><input id={fields.name.id} name="name" type="text" maxLength={80} autoComplete="name" required placeholder={fields.name.placeholder}/><ErrorText name="name"/></div>
        <div className="f"><label id={`${fields.district.id}-label`}>{fields.district.label} <Required/></label><DistrictSearchSelect id={fields.district.id} labelId={`${fields.district.id}-label`} placeholder={fields.district.placeholder} searchPlaceholder={registration.districtSearchPlaceholder} noResults={registration.districtNoResults} options={districtOptions}/><ErrorText name="district"/></div>
        <div className="f"><label htmlFor={fields.mobile.id}>{fields.mobile.label} <Required/> <span className="op">{registration.mobileLengthNote}</span></label><div className="p91"><b>{registration.mobilePrefix}</b><input id={fields.mobile.id} name="mobile" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} autoComplete="off" required placeholder={fields.mobile.placeholder}/></div><ErrorText name="mobile"/></div>
        <div className="f"><label htmlFor={fields.alternateMobile.id}>{fields.alternateMobile.label} <span className="op">{registration.alternateNote}</span></label><div className="p91"><b>{registration.mobilePrefix}</b><input id={fields.alternateMobile.id} name="alternateMobile" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} autoComplete="off" placeholder={fields.alternateMobile.placeholder}/></div><ErrorText name="alternateMobile"/></div>
        <div className="f"><label htmlFor={fields.email.id}>{fields.email.label} <Required/></label><input id={fields.email.id} name="email" type="email" maxLength={254} autoComplete="email" required placeholder={fields.email.placeholder}/><ErrorText name="email"/></div>
        <div className="f"><label htmlFor={fields.fortName.id}>{fields.fortName.label} <Required/></label><input id={fields.fortName.id} name="fortName" type="text" maxLength={80} required placeholder={fields.fortName.placeholder}/><ErrorText name="fortName"/></div>
        <div className="f" style={{ gridColumn: "1/-1" }}><label id="ftl">{registration.fortTypeLabel} <Required/></label><div className="ft" role="radiogroup" aria-labelledby="ftl">{registration.fortTypes.map((fort: {value:string;label:string;description:string;icon:string}) => <label className="ftc" key={fort.value}><input type="radio" name="ft" value={fort.value} required/><FortIcon icon={fort.icon}/><span><b>{fort.label}</b><small>{fort.description}</small></span></label>)}</div><ErrorText name="fortType"/></div>
        <div className="f" style={{ gridColumn: "1/-1" }}><label htmlFor={fields.driveFolderUrl.id}>{fields.driveFolderUrl.label} <Required/></label><input id={fields.driveFolderUrl.id} name="driveFolderUrl" type="url" maxLength={2048} required placeholder={fields.driveFolderUrl.placeholder}/><ErrorText name="driveFolderUrl"/><span className="hint">{registration.driveHint}</span></div>
        <div className="sbm" style={{ gridColumn: "1/-1" }}><label className="chk"><input type="checkbox" name="consent" value="yes" required/><span>{registration.consentPrefix} <a href="#rules" style={{ color: "#980315", textDecoration: "underline" }}>{registration.rulesLink}</a> {registration.consentSuffix}</span></label><ErrorText name="consent"/><button type="submit" className="btn go"><span className="submit-label">{registration.submit}</span> <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3F0208" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div>
      </div><div className="form-status" id="registration-status" role="status" aria-live="polite" hidden/>
    </form>
  </div></section>;
}
