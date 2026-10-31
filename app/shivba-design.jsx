"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import designContent from "./design-content";
import designInteractions from "./design-interactions";
import { accordionData } from "./accordion-data";
import { validateRegistration } from "../lib/registration-validation.js";

function renderAccordionItems(group, items, activeIndex) {
  return items
    .map((item, index) => {
      const open = activeIndex === index ? " open" : "";
      return `<details data-accordion-group="${group}" data-accordion-index="${index}"${open}><summary>${item.summary}</summary>${item.body}</details>`;
    })
    .join("");
}

function renderPage() {
  const rules = `<div id="rules-accordion-root" class="acc">${renderAccordionItems("rules", accordionData.rules, 0)}</div>`;
  const faq = `<div id="faq-accordion-root" class="fq">${renderAccordionItems("faq", accordionData.faq, 0)}</div>`;
  return designContent
    .replace('<div id="rules-accordion-root" class="acc"></div>', rules)
    .replace('<div id="faq-accordion-root" class="fq"></div>', faq);
}

const INVALID_FORM_MESSAGE = "कृपया नोंदणी पूर्ण करण्यापूर्वी दाखवलेली माहिती दुरुस्त करा.";

const FORM_KEYS = {
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
};
const FORM_NAMES = {
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
};

function getFormValues(form) {
  const data = new FormData(form);
  return {
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

export default function ShivbaDesign() {
  const root = useRef(null);
  const submitting = useRef(false);
  const [formErrors, setFormErrors] = useState({});
  const [submission, setSubmission] = useState({ status: "idle", message: "" });
  const [registrationType, setRegistrationType] = useState("individual");
  const [certificate, setCertificate] = useState({ open: false, status: "idle", name: "", token: "", url: "", message: "" });
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
  }, []);

  useEffect(() => {
    const nameInput = root.current?.querySelector("#rn");
    if (!nameInput) return;
    nameInput.placeholder = registrationType === "group"
      ? "\u0909\u0926\u093e. \u0936\u093f\u0935\u092c\u093e \u092a\u094d\u0930\u0924\u093f\u0937\u094d\u0920\u093e\u0928 \u0938\u092e\u0942\u0939"
      : "\u0909\u0926\u093e. \u0930\u094b\u0939\u0928 \u092a\u093e\u091f\u0940\u0932";
  }, [registrationType]);

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
        if (submission.status === "submitting") label.textContent = "नोंदणी पाठवत आहोत…";
        else if (submission.status === "success") label.textContent = "नोंदणी जतन झाली";
        else label.textContent = "नोंदणी पूर्ण करा";
      }
    }
  }, [formErrors, submission]);

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

  async function generateCertificate(name, token) {
    if (certificateGenerating.current) return false;
    const requestId = certificateRequestId.current + 1;
    certificateRequestId.current = requestId;
    certificateGenerating.current = true;
    setSubmission({ status: "submitting", message: "नोंदणी जतन झाली. प्रमाणपत्र तयार करत आहोत…" });
    setCertificate({ open: false, status: "loading", name, token, url: "", message: "प्रमाणपत्र तयार करत आहोत…" });
    try {
      const response = await fetch("/api/certificate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, certificateToken: token }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "प्रमाणपत्र तयार करता आले नाही. कृपया पुन्हा प्रयत्न करा.");
      }
      const pdfBlob = await response.blob();
      if (pdfBlob.type !== "application/pdf" || pdfBlob.size === 0) {
        throw new Error("प्रमाणपत्राची PDF फाइल तयार करता आली नाही. कृपया पुन्हा प्रयत्न करा.");
      }
      if (certificateRequestId.current !== requestId) return;
      if (certificateUrl.current) URL.revokeObjectURL(certificateUrl.current);
      certificateBlob.current = pdfBlob;
      certificateUrl.current = URL.createObjectURL(pdfBlob);
      setCertificate({ open: true, status: "ready", name, token, url: certificateUrl.current, message: "" });
      setSubmission({ status: "success", message: "नोंदणी यशस्वीरीत्या जतन झाली." });
      return true;
    } catch (error) {
      if (certificateRequestId.current !== requestId) return;
      setCertificate({ open: false, status: "error", name, token, url: "", message: error.message || "प्रमाणपत्र तयार करता आले नाही. कृपया पुन्हा प्रयत्न करा." });
      setSubmission({ status: "error", message: "नोंदणी जतन झाली; परंतु प्रमाणपत्र तयार करता आले नाही. पुन्हा प्रयत्न करा." });
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
      setPreviewMessage("प्रमाणपत्राचा preview उघडता आला नाही. कृपया पुन्हा प्रयत्न करा.");
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
      setPreviewMessage("नवीन tab उघडला नाही. कृपया या वेबसाइटसाठी pop-ups सुरू करा.");
      return;
    }
    tab.opener = null;

    previewTimer.current = window.setTimeout(() => {
      if (!received) {
        channel.postMessage({ type: "timeout" });
        channel.close();
        previewChannel.current = null;
        setPreviewMessage("नवीन tab मध्ये certificate preview लोड झाले नाही. पुन्हा प्रयत्न करा.");
      }
      previewTimer.current = null;
    }, 20000);
  }

  function handleFieldChange(event) {
    const form = event.target.closest?.("#registration-form");
    const fieldName = FORM_KEYS[event.target.name];
    if (!form || !fieldName) return;
    if (event.target.name === "rt") setRegistrationType(event.target.value);

    if (event.target.name === "mobile" || event.target.name === "alternateMobile") {
      const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 10);
      if (event.target.value !== digitsOnly) event.target.value = digitsOnly;
    }

    const { errors } = validateRegistration(getFormValues(form));
    if (Object.keys(errors).length === 0 && submission.message === INVALID_FORM_MESSAGE) {
      setSubmission({ status: "idle", message: "" });
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

    const { values, errors, valid } = validateRegistration(getFormValues(form));
    setFormErrors(errors);
    if (!valid) {
      setSubmission({ status: "error", message: INVALID_FORM_MESSAGE });
      const firstInvalidField = Object.keys(errors)[0];
      form.querySelector(`[name="${FORM_NAMES[firstInvalidField] || firstInvalidField}"]`)?.focus();
      return;
    }

    submitting.current = true;
    setSubmission({ status: "submitting", message: "नोंदणी पाठवत आहोत…" });
    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();

      if (!response.ok || result.success !== true) {
        if (result.errors) setFormErrors(result.errors);
        setSubmission({ status: "error", message: result.message || "नोंदणी जतन झाली नाही. कृपया पुन्हा प्रयत्न करा." });
        return;
      }

      form.reset();
      setRegistrationType("individual");
      setFormErrors({});
      await generateCertificate(values.name, result.certificateToken);
    } catch {
      setSubmission({ status: "error", message: "नोंदणी सेवा सध्या उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा." });
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
        dangerouslySetInnerHTML={{ __html: renderPage() }}
      />
      <AccordionController root={root} />
      {certificate.status === "error" && !certificate.open && (
        <div className="certificate-retry-banner" role="alert">
          <span>{certificate.message}</span>
          <button type="button" className="certificate-retry" onClick={() => generateCertificate(certificate.name, certificate.token)}>पुन्हा प्रयत्न करा</button>
        </div>
      )}
      {certificate.open && (
        <div className="certificate-overlay" onMouseDown={(event) => event.target === event.currentTarget && closeCertificate()}>
          <section className="certificate-modal" data-status={certificate.status} role="dialog" aria-modal="true" aria-labelledby="certificate-title">
            <button className="certificate-close" type="button" onClick={closeCertificate} aria-label="Close certificate">×</button>
            <header className="certificate-heading">
              <div className="certificate-success-mark" aria-hidden="true">✓</div>
              <h2 id="certificate-title">Registration Successful!</h2>
              {certificate.status === "ready" && <p className="certificate-subtitle">Your participation certificate is ready.</p>}
            </header>
            <div className="certificate-modal-body">
              {certificate.status === "ready" && (
                <div className="certificate-document">
                  <iframe className="certificate-preview" src={certificate.url} title={`Participation certificate for ${certificate.name}`} />
                </div>
              )}
              <div className="certificate-details">
                <p className="certificate-detail-label">प्रमाणपत्रासाठी</p>
                <p className="certificate-participant">{certificate.name}</p>
                {certificate.status === "ready" && (
                  <div className="certificate-actions">
                    <button className="certificate-preview-action" type="button" onClick={openCertificatePreview}>Preview Certificate <span aria-hidden="true">↗</span></button>
                    <button className="btn pri certificate-download" type="button" onClick={downloadCertificate}>Download Certificate</button>
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


