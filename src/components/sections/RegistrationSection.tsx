"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { useLanguage, useLanguageContent } from "@/src/components/layout/LanguageProvider";

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

type SelectOption = { value: string; label: string; flag?: string; flagCode?: string };
type LocationCountry = { iso2: string; name: string; callingCode: string; emoji?: string };
type LocationState = { iso2: string; name: string };
type LocationCity = { id: string | number; name: string };

function SearchableSelect({
  id,
  name,
  labelId,
  placeholder,
  searchPlaceholder,
  noResults,
  options,
  value,
  disabled = false,
  onSelect,
}: {
  id: string;
  name: string;
  labelId: string;
  placeholder: string;
  searchPlaceholder: string;
  noResults: string;
  options: SelectOption[];
  value: string;
  disabled?: boolean;
  onSelect: (option: SelectOption) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label ?? "";
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
      setQuery("");
      setOpen(false);
    };
    form?.addEventListener("reset", resetSelection);
    return () => form?.removeEventListener("reset", resetSelection);
  }, []);

  function chooseOption(option: SelectOption) {
    setQuery("");
    setOpen(false);
    if (valueRef.current) {
      valueRef.current.value = option.value;
      valueRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      valueRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
    onSelect(option);
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
      chooseOption(filteredOptions[Math.min(activeIndex, filteredOptions.length - 1)]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <div className="district-select" ref={rootRef}>
      <input type="hidden" name={name} value={value} readOnly ref={valueRef} />
      <button
        id={`${id}-control`}
        ref={triggerRef}
        type="button"
        className="district-select-trigger"
        disabled={disabled}
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
        <span id={`${id}-value`} className={selectedLabel ? "district-select-value" : "district-select-placeholder"}>{selectedOption?.flagCode ? <img className="country-flag-image" src={`https://flagcdn.com/w40/${selectedOption.flagCode.toLowerCase()}.png`} alt="" width="24" height="18"/> : selectedOption?.flag && <span className="country-flag" aria-hidden="true">{selectedOption.flag}</span>}{selectedLabel || placeholder}</span>
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
                aria-selected={value === option.value}
                className={`district-select-option${activeIndex === index ? " active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => chooseOption(option)}
              >
                {option.flagCode ? <img className="country-flag-image" src={`https://flagcdn.com/w40/${option.flagCode.toLowerCase()}.png`} alt="" width="24" height="18" loading="lazy"/> : option.flag && <span className="country-flag" aria-hidden="true">{option.flag}</span>}{option.label}
              </button>
            )) : <p className="district-select-empty" role="status">{noResults}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegistrationSection() {
 const content=useLanguageContent(); const {language}=useLanguage(); const registration=content.sections.register; const fields=registration.fields;
 const [countries,setCountries]=useState<LocationCountry[]>([]); const [countryIso,setCountryIso]=useState('IN'); const [states,setStates]=useState<LocationState[]>([]); const [stateCode,setStateCode]=useState('MH'); const [cities,setCities]=useState<LocationCity[]>([]); const [cityId,setCityId]=useState(''); const [manualCity,setManualCity]=useState(false); const [loadingCities,setLoadingCities]=useState(false); const [loadingStates,setLoadingStates]=useState(true); const [locationError,setLocationError]=useState(''); const stateRequestId=useRef(0); const cityRequestId=useRef(0);
 const labels=language==='en'?{country:'Country',state:'State / Province',city:'City',areaLocality:'Area / Locality',postal:'Postal / ZIP Code',phone:'Phone number',sc:'Search countries',ss:'Search states or provinces',sci:'Search cities',empty:'No matching options',error:'Location data could not be loaded.'}:{country:'देश',state:'राज्य / प्रांत',city:'शहर',areaLocality:'परिसर / स्थानिक भाग',postal:'पोस्टल / पिन कोड',phone:'मोबाईल क्रमांक',sc:'देश शोधा',ss:'राज्य किंवा प्रांत शोधा',sci:'शहर शोधा',empty:'जुळणारे पर्याय सापडले नाहीत',error:'ठिकाणांची यादी लोड झाली नाही.'};
 const country=countries.find(x=>x.iso2===countryIso); const countryOpts=useMemo(()=>countries.map(x=>({value:x.iso2,label:x.name,flag:x.emoji||'🌐',flagCode:x.iso2})),[countries]); const stateOpts=useMemo(()=>states.map(x=>({value:x.iso2,label:x.name})),[states]); const cityOpts=useMemo(()=>cities.map(x=>({value:String(x.id),label:x.name})),[cities]);
 useEffect(()=>{let dead=false;fetch('/api/locations?type=countries',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(x=>{if(!dead)setCountries(x.countries||[])}).catch(()=>{if(!dead){setLoadingStates(false);setLocationError(labels.error)}});return()=>{dead=true}},[]);
 async function load(type:'states'|'cities',iso:string,state=''){const isStates=type==='states';const requestRef=isStates?stateRequestId:cityRequestId;const id=++requestRef.current;if(isStates)setLoadingStates(true);else setLoadingCities(true);try{const q=new URLSearchParams({type,country:iso});if(state)q.set('state',state);const r=await fetch(`/api/locations?${q}`,{cache:"no-store"});if(!r.ok)throw Error();const v=await r.json();if(id===requestRef.current){if(isStates)setStates(v.states||[]);else setCities(v.cities||[]);setLocationError('')}return v}catch{if(id===requestRef.current)setLocationError(labels.error);return null}finally{if(id===requestRef.current){if(isStates)setLoadingStates(false);else setLoadingCities(false)}}}
 useEffect(()=>{if(!countries.length)return;let dead=false;(async()=>{const v=await load('states',countryIso);if(dead||!v)return;if(countryIso==='IN'){const maharashtra=v.states?.find((state:LocationState)=>state.iso2==='MH');if(maharashtra){setStateCode(maharashtra.iso2);const cityResult=await load('cities','IN',maharashtra.iso2);if(!dead&&!cityResult?.cities?.length)setManualCity(true);return}}if(v.states?.length===0){const cityResult=await load('cities',countryIso);if(!dead)setManualCity(!cityResult?.cities?.length)}})();return()=>{dead=true}},[countryIso,countries.length]);
 useEffect(()=>{const f=document.getElementById('registration-form');const reset=()=>{stateRequestId.current++;cityRequestId.current++;setCountryIso('IN');setStates([]);setStateCode('MH');setCities([]);setCityId('');setManualCity(false);setLoadingStates(true);setLoadingCities(false);void load('states','IN').then(async v=>{const maharashtra=v?.states?.find((state:LocationState)=>state.iso2==='MH');if(maharashtra){setStateCode(maharashtra.iso2);const cityResult=await load('cities','IN',maharashtra.iso2);if(!cityResult?.cities?.length)setManualCity(true)}else if(v?.states?.length===0){setManualCity(true);void load('cities','IN')}})};f?.addEventListener('reset',reset);return()=>f?.removeEventListener('reset',reset)},[]);
 const stateName=states.find(x=>x.iso2===stateCode)?.name||'';const cityName=cities.find(x=>String(x.id)===cityId)?.name||'';
 return <section id="register" className="reg"><div className="w grid two" style={{gridTemplateColumns:'4fr 8fr',gap:48,alignItems:'start'}}><div><p className="kick" style={{color:'#FFD21F'}}>{registration.eyebrow}</p><h2 className="h2" style={{color:'#FBF3E4',fontSize:40}}>{registration.title}</h2><p style={{fontSize:18,lineHeight:1.7,margin:'0 0 18px',color:'#F3E3C3'}}>{registration.description}</p><p style={{margin:'0 0 14px',fontSize:14,color:'#F3E3C3'}}>{registration.requiredNote}</p></div>
 <form className="card2" id="registration-form" noValidate><Image className="seal" src="/images/trust-seal.png" alt={content.layout.header.logo.alt} width={76} height={76}/><div className="tabs" role="radiogroup" aria-label={registration.registrationTypeLabel}>{registration.registrationTypes.map((t,i)=><label className="tab" key={t.value}><input type="radio" name="rt" value={t.value} defaultChecked={i===0} required/><span>{t.label}</span></label>)}</div><div className="grid fld" style={{gridTemplateColumns:'1fr 1fr',gap:'0 18px'}}>
        <div className="f"><label htmlFor={fields.name.id}>{fields.name.label} <Required/></label><input id={fields.name.id} name="name" maxLength={80} autoComplete="name" required placeholder={fields.name.placeholder}/><ErrorText name="name"/></div>
        <div className="f"><label htmlFor={fields.email.id}>{fields.email.label} <Required/></label><input id={fields.email.id} name="email" type="email" maxLength={254} required placeholder={fields.email.placeholder}/><ErrorText name="email"/></div>
 <div className="f"><label id="country-label">{labels.country} <Required/></label><SearchableSelect id="country" name="countryIso" labelId="country-label" placeholder={labels.country} searchPlaceholder={labels.sc} noResults={labels.empty} options={countryOpts} value={countryIso} onSelect={o=>{stateRequestId.current++;cityRequestId.current++;setCountryIso(o.value);setStates([]);setLoadingStates(true);setStateCode('');setCities([]);setCityId('');setManualCity(false);setLoadingCities(false)}}/><input type="hidden" name="country" value={country?.name||''}/><input type="hidden" name="callingCode" value={country?country.callingCode:''}/><ErrorText name="country"/></div>
 {states.length>0||countries.length===0||loadingStates?<div className="f"><label id="state-label">{labels.state}{states.length>0&&<Required/>}</label><SearchableSelect id="state" name="stateCode" labelId="state-label" placeholder={loadingStates?'Loading…':labels.state} searchPlaceholder={labels.ss} noResults={labels.empty} options={stateOpts} value={stateCode} disabled={loadingStates||states.length===0} onSelect={o=>{setStateCode(o.value);cityRequestId.current++;setCities([]);setCityId('');setManualCity(false);setLoadingCities(false);void load('cities',countryIso,o.value).then(v=>{if(!v?.cities?.length)setManualCity(true)})}}/><input type="hidden" name="stateProvince" value={stateName}/>{states.length>0&&<input type="hidden" name="stateRequired" value="true"/>}<ErrorText name="stateProvince"/></div>:<div className="f"><label htmlFor="state-manual">{labels.state}</label><input id="state-manual" name="stateProvince" type="text" maxLength={100} autoComplete="address-level1"/><ErrorText name="stateProvince"/></div>}
 {manualCity?<div className="f"><label htmlFor="city-manual">{labels.city} <Required/></label><input id="city-manual" name="city" value={cityId} onChange={e=>setCityId(e.target.value)} maxLength={100} required/><input type="hidden" name="cityRequired" value="true"/><ErrorText name="city"/></div>:<div className="f"><label id="city-label">{labels.city}{cityOpts.length>0&&<Required/>}</label><SearchableSelect id="city" name="cityId" labelId="city-label" placeholder={loadingCities?'Loading…':labels.city} searchPlaceholder={labels.sci} noResults={states.length>0&&!stateCode?(language==='en'?'Select a state or province first.':'आधी राज्य किंवा प्रांत निवडा.'):labels.empty} options={cityOpts} value={cityId} disabled={loadingCities} onSelect={o=>setCityId(o.value)}/><input type="hidden" name="city" value={cityName}/>{cityOpts.length>0&&<input type="hidden" name="cityRequired" value="true"/>}<ErrorText name="city"/></div>}
 <div className="f"><label htmlFor="area-locality">{labels.areaLocality}</label><input id="area-locality" name="areaLocality" type="text" maxLength={100} autoComplete="address-level3" placeholder={language==='en'?'e.g., Dadar, Bandra, Andheri, Hollywood, Downtown':'उदा. दादर, वांद्रे, अंधेरी, हॉलीवूड, डाउनटाउन'}/></div>
 <div className="f"><label htmlFor="postal-code">{labels.postal}</label><input id="postal-code" name="postalCode" maxLength={100} autoComplete="postal-code"/></div>
 <div className="f"><label htmlFor={fields.mobile.id}>{labels.phone} <Required/></label><div className="p91"><b>{country?<><img className="country-flag-image" src={`https://flagcdn.com/w40/${country.iso2.toLowerCase()}.png`} alt="" width={24} height={18}/> {country.callingCode}</>:'+'}</b><input id={fields.mobile.id} name="mobile" type="tel" inputMode="tel" autoComplete="tel-national" maxLength={24} required placeholder={fields.mobile.placeholder} onInput={event=>{let count=0;event.currentTarget.value=Array.from(event.currentTarget.value).filter(char=>!/\d/.test(char)||++count<=10).join("")}}/></div><ErrorText name="mobile"/></div><div className="f"><label htmlFor={fields.alternateMobile.id}>{fields.alternateMobile.label}</label><div className="p91"><b>{country?<><img className="country-flag-image" src={`https://flagcdn.com/w40/${country.iso2.toLowerCase()}.png`} alt="" width={24} height={18}/> {country.callingCode}</>:'+'}</b><input id={fields.alternateMobile.id} name="alternateMobile" type="tel" autoComplete="off"/></div><ErrorText name="alternateMobile"/></div>
 <div className="f"><label htmlFor={fields.fortName.id}>{fields.fortName.label} <Required/></label><input id={fields.fortName.id} name="fortName" maxLength={80} required placeholder={fields.fortName.placeholder}/><ErrorText name="fortName"/></div>
 <div className="f" style={{gridColumn:'1/-1'}}><label id="ftl">{registration.fortTypeLabel} <Required/></label><div className="ft" role="radiogroup" aria-labelledby="ftl">{registration.fortTypes.map((fort:{value:string;label:string;description:string;icon:string})=><label className="ftc" key={fort.value}><input type="radio" name="ft" value={fort.value} required/><FortIcon icon={fort.icon}/><span><b>{fort.label}</b><small>{fort.description}</small></span></label>)}</div><ErrorText name="fortType"/></div><div className="f" style={{gridColumn:'1/-1'}}><label htmlFor={fields.driveFolderUrl.id}>{fields.driveFolderUrl.label} <Required/></label><input id={fields.driveFolderUrl.id} name="driveFolderUrl" type="url" maxLength={2048} required placeholder={fields.driveFolderUrl.placeholder}/><ErrorText name="driveFolderUrl"/><span className="hint">{registration.driveHint}</span></div><div className="sbm" style={{gridColumn:'1/-1'}}><label className="chk"><input type="checkbox" name="consent" value="yes" required/><span>{registration.consentPrefix} <a href="#rules">{registration.rulesLink}</a> {registration.consentSuffix}</span></label><ErrorText name="consent"/><button type="submit" className="btn go"><span className="submit-label">{registration.submit}</span></button></div></div>{locationError&&<p className="validation-error" role="alert">{locationError}</p>}<div className="form-status" id="registration-status" role="status" aria-live="polite" hidden/></form></div></section>;
}
