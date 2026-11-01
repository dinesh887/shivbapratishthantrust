"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import designInteractions from "../../../app/design-interactions";
import { validateRegistration } from "../../../lib/registration-validation.js";
import { useLanguage, useLanguageContent } from "@/src/components/layout/LanguageProvider";

const FORM_KEYS = {
  country: "country",
  countryIso: "country",
  rt: "registrationType",
  name: "name",
  district: "district",
  mobile: "mobile",
  alternateMobile: "alternateMobile",
  email: "email",
  fortName: "fortName",
  ft: "fortType",
  driveFolderUrl: "driveFolderUrl",
  consent: "consent",
  stateProvince: "stateProvince",
  stateCode: "stateProvince",
  city: "city",
  cityId: "city",
  postalCode: "postalCode",
};
const FORM_NAMES = {
  country: "country",
  countryIso: "countryIso",
  registrationType: "rt",
  name: "name",
  district: "district",
  mobile: "mobile",
  alternateMobile: "alternateMobile",
  email: "email",
  fortName: "fortName",
  fortType: "ft",
  driveFolderUrl: "driveFolderUrl",
  consent: "consent",
  stateProvince: "stateProvince",
  stateCode: "stateCode",
  city: "city",
  cityId: "cityId",
  postalCode: "postalCode",
};

function getFormValues(form) {
  const data = new FormData(form);
  return {
    country: data.get("country") || "",
    countryIso: data.get("countryIso") || "IN",
    callingCode: data.get("callingCode") || "",
    stateProvince: data.get("stateProvince") || "",
    stateCode: data.get("stateCode") || "",
    city: data.get("city") || "",
    cityId: data.get("cityId") || "",
    stateRequired: data.get("stateRequired") || "",
    cityRequired: data.get("cityRequired") || "",
    postalCode: data.get("postalCode") || "",
    registrationType: data.get("rt") || "",
    name: data.get("name") || "",
    district: data.get("district") || "",
    mobile: data.get("mobile") || "",
    alternateMobile: data.get("alternateMobile") || "",
    email: data.get("email") || "",
    fortName: data.get("fortName") || "",
    fortType: data.get("ft") || "",
    driveFolderUrl: data.get("driveFolderUrl") || "",
    consent: data.get("consent") === "yes",
  };
}

function AccordionController({ root }) {
  const [activeItems, setActiveItems] = useState({ rules: 0, faq: 0 });
  const activeRef = useRef(activeItems);


  useEffect(() => {
    const container = root.current;
    if (!container) return;

    function handleClick(event) {
      const summary = event.target.closest?.("summary");
      const details = summary?.closest("details[data-accordion-group]");
      if (!details || !container.contains(details)) return;

      event.preventDefault();
      const group = details.dataset.accordionGroup;
      const index = Number(details.dataset.accordionIndex);
      const nextIndex = activeRef.current[group] === index ? null : index;
      const nextState = { ...activeRef.current, [group]: nextIndex };
      activeRef.current = nextState;
      setActiveItems(nextState);
      container.querySelectorAll(`details[data-accordion-group="${group}"]`).forEach((item) => {
        item.open = Number(item.dataset.accordionIndex) === nextIndex;
      });
    }

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [root]);

  return null;
}

export default function SiteInteractions({ children }) {
  const { language } = useLanguage();
  const content = useLanguageContent();
  const invalidFormMessage = content.messages.invalidForm;
  const root = useRef(null);
  const submitting = useRef(false);
  const [formErrors, setFormErrors] = useState({});
  const [submission, setSubmission] = useState({ status: "idle", message: "" });
  const [registrationType, setRegistrationType] = useState("individual");
  const [certificate, setCertificate] = useState({ open: false, status: "idle", name: "", token: "", details: null, url: "", message: "" });
  const certificateGenerating = useRef(false);
  const certificateUrl = useRef("");
  const certificateBlob = useRef(null);
  const certificateRequestId = useRef(0);
  const previewChannel = useRef(null);
  const previewTimer = useRef(null);
  const [previewMessage, setPreviewMessage] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.dataset.designInteractions = "true";
    script.textContent = designInteractions;
    root.current?.appendChild(script);
    return () => script.remove();
  }, [designInteractions]);

  useEffect(() => {
    const nameInput = root.current?.querySelector("#rn");
    if (!nameInput) return;
    nameInput.placeholder = registrationType === "group"
      ? content.messages.groupPlaceholder
      : content.messages.individualPlaceholder;
  }, [registrationType, language, content.messages]);

  useEffect(() => {
    const form = root.current?.querySelector("#registration-form");
    if (!form || Object.keys(formErrors).length === 0) return;
    const { errors } = validateRegistration(getFormValues(form), language);
    setFormErrors(errors);
    setSubmission((current) => current.status === "error"
      ? { ...current, message: content.messages.invalidForm }
      : current);
  }, [language, content.messages]);

  useEffect(() => {
    const container = root.current;
    if (!container) return;

    container.querySelectorAll("[data-error-for]").forEach((node) => {
      const message = formErrors[node.dataset.errorFor] || "";
      node.textContent = message;
      node.hidden = !message;
    });

    Object.entries(FORM_NAMES).forEach(([key, name]) => {
      container.querySelectorAll(`[name="${name}"]`).forEach((input) => {
        if (formErrors[key]) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
      });
    });
    [["country", "#country-control"], ["stateProvince", "#state-control"], ["city", "#city-control"]].forEach(([key, selector]) => {
      const control = container.querySelector(selector);
      if (!control) return;
      if (formErrors[key]) control.setAttribute("aria-invalid", "true");
      else control.removeAttribute("aria-invalid");
    });

    const status = container.querySelector("#registration-status");
    if (status) {
      status.textContent = submission.message;
      status.hidden = !submission.message;
      status.className = `form-status ${submission.status}`;
    }

    const form = container.querySelector("#registration-form");
    const button = form?.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = submission.status === "submitting";
      button.setAttribute("aria-busy", String(submission.status === "submitting"));
      const label = button.querySelector(".submit-label");
      if (label) {
        if (submission.status === "submitting") label.textContent = content.messages.submitButtonSubmitting;
        else if (submission.status === "success") label.textContent = content.messages.submitButtonSuccess;
        else label.textContent = content.messages.submitButtonIdle;
      }
    }
  }, [formErrors, submission, content.messages]);

  const closeCertificate = useCallback(() => {
    certificateRequestId.current += 1;
    certificateGenerating.current = false;
    if (certificateUrl.current) URL.revokeObjectURL(certificateUrl.current);
    certificateUrl.current = "";
    setCertificate((current) => ({ ...current, open: false, url: "" }));
  }, []);

  useEffect(() => () => {
    if (certificateUrl.current) URL.revokeObjectURL(certificateUrl.current);
    certificateBlob.current = null;
    if (previewChannel.current) {
      previewChannel.current.postMessage({ type: "timeout" });
      previewChannel.current.close();
    }
    if (previewTimer.current) window.clearTimeout(previewTimer.current);
  }, []);

  useEffect(() => {
    if (!certificate.open) return;
    function closeOnEscape(event) {
      if (event.key === "Escape") closeCertificate();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [certificate.open, closeCertificate]);

  async function generateCertificate(name, token, details = null) {
    if (certificateGenerating.current) return false;
    const requestId = certificateRequestId.current + 1;
    certificateRequestId.current = requestId;
    certificateGenerating.current = true;
    setSubmission({ status: "submitting", message: content.messages.savedAndGenerating });
    setCertificate({ open: false, status: "loading", name, token, details, url: "", message: content.messages.generatingCertificate });
    try {
      const response = await fetch("/api/certificate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, certificateToken: token, language, details }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || content.messages.certificateFailed);
      }
      const pdfBlob = await response.blob();
      if (pdfBlob.type !== "application/pdf" || pdfBlob.size === 0) {
        throw new Error(content.messages.certificatePdfFailed);
      }
      if (certificateRequestId.current !== requestId) return;
      if (certificateUrl.current) URL.revokeObjectURL(certificateUrl.current);
      certificateBlob.current = pdfBlob;
      certificateUrl.current = URL.createObjectURL(pdfBlob);
      setCertificate({ open: true, status: "ready", name, token, details, url: certificateUrl.current, message: "" });
      setSubmission({ status: "success", message: content.messages.saved });
      return true;
    } catch (error) {
      if (certificateRequestId.current !== requestId) return;
      setCertificate({ open: false, status: "error", name, token, details, url: "", message: error.message || content.messages.certificateFailed });
      setSubmission({ status: "error", message: content.messages.savedCertificateFailed });
      return false;
    } finally {
      if (certificateRequestId.current === requestId) certificateGenerating.current = false;
    }
  }

  function downloadCertificate() {
    if (!certificate.url) return;
    const safeName = certificate.name.replace(/[^\p{L}\p{N} -]/gu, "").trim().replace(/\s+/g, "_");
    const link = document.createElement("a");
    link.href = certificate.url;
    link.download = `Certificate_${safeName || "Participant"}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function openCertificatePreview() {
    if (!certificateBlob.current || !certificate.url || !("BroadcastChannel" in window)) {
      setPreviewMessage(content.messages.previewUnavailable);
      return;
    }

    if (previewChannel.current) {
      previewChannel.current.postMessage({ type: "timeout" });
      previewChannel.current.close();
    }
    if (previewTimer.current) window.clearTimeout(previewTimer.current);
    setPreviewMessage("");

    const channelId = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const channel = new BroadcastChannel(`shivba-certificate-${channelId}`);
    previewChannel.current = channel;
    let received = false;

    channel.onmessage = ({ data }) => {
      if (data?.type === "ready" && !received) {
        channel.postMessage({ type: "certificate", name: certificate.name, blob: certificateBlob.current });
      }
      if (data?.type === "received") {
        received = true;
        if (previewTimer.current) window.clearTimeout(previewTimer.current);
        previewTimer.current = null;
        channel.close();
        previewChannel.current = null;
        setPreviewMessage("");
      }
    };

    const tab = window.open(`/certificate-preview?channel=${encodeURIComponent(channelId)}`, "_blank");
    if (!tab) {
      channel.close();
      previewChannel.current = null;
      setPreviewMessage(content.messages.popupBlocked);
      return;
    }
    tab.opener = null;

    previewTimer.current = window.setTimeout(() => {
      if (!received) {
        channel.postMessage({ type: "timeout" });
        channel.close();
        previewChannel.current = null;
        setPreviewMessage(content.messages.previewNotLoaded);
      }
      previewTimer.current = null;
    }, 20000);
  }

  function handleFieldChange(event) {
    const form = event.target.closest?.("#registration-form");
    const fieldName = FORM_KEYS[event.target.name];
    if (!form || !fieldName) return;
    if (event.target.name === "rt") setRegistrationType(event.target.value);

    const { errors } = validateRegistration(getFormValues(form), language);
    if (Object.keys(errors).length === 0 && submission.message === invalidFormMessage) {
      setSubmission({ status: "idle", message: "" });
    }
    if (["country", "countryIso", "mobile", "alternateMobile", "stateCode", "cityId"].includes(event.target.name)) {
      setFormErrors(errors);
      return;
    }
    setFormErrors((current) => {
      const next = { ...current };
      if (errors[fieldName]) next[fieldName] = errors[fieldName];
      else delete next[fieldName];
      return next;
    });
  }

  async function handleFormSubmit(event) {
    const form = event.target;
    if (!form.matches?.("#registration-form")) return;
    event.preventDefault();
    if (submitting.current) return;

    const { values, errors, valid } = validateRegistration(getFormValues(form), language);
    setFormErrors(errors);
    if (!valid) {
      setSubmission({ status: "error", message: invalidFormMessage });
      const firstInvalidField = Object.keys(errors)[0];
      const firstInvalidControl = ({ country: "#country-control", stateProvince: "#state-control", city: "#city-control" }[firstInvalidField])
        ? form.querySelector(({ country: "#country-control", stateProvince: "#state-control", city: "#city-control" }[firstInvalidField]))
        : form.querySelector(`[name="${FORM_NAMES[firstInvalidField] || firstInvalidField}"]`);
      firstInvalidControl?.focus();
      return;
    }

    submitting.current = true;
    setSubmission({ status: "submitting", message: content.messages.submitting });
    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, language }),
      });
      const result = await response.json();

      if (!response.ok || result.success !== true) {
        if (result.errors) setFormErrors(result.errors);
        setSubmission({ status: "error", message: result.message || content.messages.registrationFailed });
        return;
      }

      form.reset();
      setFormErrors({});
      const certificateDetails = values.countryIso !== "IN" ? {
        country: values.country,
        countryIso: values.countryIso,
        stateProvince: values.stateProvince,
        city: values.city,
        postalCode: values.postalCode,
      } : null;
      await generateCertificate(values.name, result.certificateToken, certificateDetails);
    } catch {
      setSubmission({ status: "error", message: content.messages.serviceUnavailable });
    } finally {
      submitting.current = false;
    }
  }

  return (
    <>
      <div
        ref={root}
        onInput={handleFieldChange}
        onChange={handleFieldChange}
        onSubmit={handleFormSubmit}
      >{children}</div>
      <AccordionController root={root} />
      {certificate.status === "error" && !certificate.open && (
        <div className="certificate-retry-banner" role="alert">
          <span>{certificate.message}</span>
          <button type="button" className="certificate-retry" onClick={() => generateCertificate(certificate.name, certificate.token, certificate.details)}>{content.messages.retry}</button>
        </div>
      )}
      {certificate.open && (
        <div className="certificate-overlay" onMouseDown={(event) => event.target === event.currentTarget && closeCertificate()}>
          <section className="certificate-modal" data-status={certificate.status} role="dialog" aria-modal="true" aria-labelledby="certificate-title">
            <button className="certificate-close" type="button" onClick={closeCertificate} aria-label={content.messages.close}>×</button>
            <header className="certificate-heading">
              <div className="certificate-success-mark" aria-hidden="true">✓</div>
              <h2 id="certificate-title">{content.messages.successTitle}</h2>
              {certificate.status === "ready" && <p className="certificate-subtitle">{content.messages.certificateReady}</p>}
            </header>
            <div className="certificate-modal-body">
              {certificate.status === "ready" && (
                <div className="certificate-document">
                  <iframe className="certificate-preview" src={certificate.url} title={`${content.certificatePreview.participationCertificate} for ${certificate.name}`} />
                </div>
              )}
              <div className="certificate-details">
                <p className="certificate-detail-label">{content.messages.certificateFor}</p>
                <p className="certificate-participant">{certificate.name}</p>
                {certificate.details && <p className="certificate-location">{[certificate.details.country, [certificate.details.city, certificate.details.stateProvince].filter(Boolean).join(", "), certificate.details.postalCode].filter(Boolean).join(" · ")}</p>}
                {certificate.status === "ready" && (
                  <div className="certificate-actions">
                    <button className="certificate-preview-action" type="button" onClick={openCertificatePreview}>{content.messages.previewAction} <span aria-hidden="true">↗</span></button>
                    <button className="btn pri certificate-download" type="button" onClick={downloadCertificate}>{content.messages.downloadAction}</button>
                  </div>
                )}
                {previewMessage && <p className="certificate-preview-message" role="status">{previewMessage}</p>}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}



