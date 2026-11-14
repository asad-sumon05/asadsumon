import React, { useEffect, useRef, useState, useCallback } from 'react';
import { bindHovers } from '../utils/spring';

const CONTACT_EMAIL = ['asad.sumon05', 'gmail.com'].join('@');
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * ContactModal - Interactive project request modal.
 * Integrates with /api/contact (Express backend) and falls back cleanly to the user's mail client.
 */
export default function ContactModal({ isOpen, onClose }) {
  // DOM element references
  const modalRef = useRef(null);
  const panelRef = useRef(null);
  const nameInputRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '', project: '', company: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successState, setSuccessState] = useState({
    title: 'Almost there',
    body: "Your email app has opened with your message ready to go. Press send there and I'll reply within one business day.",
    showAlt: true,
  });

  // ==========================================================================
  // 1. EULER SPRING MICRO-INTERACTIONS
  // ==========================================================================
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !isOpen) return;
    const unbind = bindHovers(panel);
    return () => unbind();
  }, [isOpen, submitted]);

  // ==========================================================================
  // 2. MODAL CLOSE HANDLER
  // ==========================================================================
  const handleClose = useCallback(() => {
    const el = modalRef.current;
    if (!el || el.hidden) return;

    el.classList.remove('open');
    el.classList.add('closing');

    setTimeout(() => {
      el.hidden = true;
      el.classList.remove('closing');
      onClose();
      // Reset form state after transition completes
      setSubmitted(false);
      setFormData({ name: '', email: '', project: '', company: '' });
    }, 460);
  }, [onClose]);

  // ==========================================================================
  // 3. LIFECYCLE, ANIMATION & FOCUS MANAGEMENT
  // ==========================================================================
  useEffect(() => {
    const el = modalRef.current;
    if (!el || !isOpen) return;

    el.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('open');
        setTimeout(() => nameInputRef.current?.focus({ preventScroll: true }), 120);
      });
    });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = [...el.querySelectorAll(FOCUSABLE)].filter(
        (n) => n.offsetWidth || n.offsetHeight || n.getClientRects().length
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!el.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
        return;
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  // ==========================================================================
  // 4. FORM CHANGE & SUBMIT HANDLERS
  // ==========================================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, project, company } = formData;

    // Honeypot check: silently abort if bot filled the hidden field
    if (company) {
      handleClose();
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedProject = project.trim();

    const subject = `New project enquiry from ${trimmedName}`;
    const body = `Hi Sumon,\n\n${trimmedProject}\n\n— ${trimmedName}\n${trimmedEmail}`;

    const viaMail = () => {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      setSuccessState({
        title: 'Almost there',
        body: "Your email app has opened with your message ready to go. Press send there and I'll reply within one business day.",
        showAlt: true,
      });
      setSubmitted(true);
    };

    setSubmitting(true);

    try {
      // POST to Express REST API endpoint
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          project: trimmedProject,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setSuccessState({
        title: 'Message sent',
        body: `Thanks, ${trimmedName}. I'll reply to ${trimmedEmail} within one business day.`,
        showAlt: false,
      });
      setSubmitted(true);
    } catch {
      // Clean fallback to native mail client
      viaMail();
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================================
  // 5. RENDER MODAL & FORM STATE
  // ==========================================================================
  return (
    <div
      className={`modal${isOpen ? ' open' : ''}`}
      id="modal"
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mTitle"
      hidden={!isOpen}
      onClick={handleClose}
    >
      <div className="modal__panel" id="mPanel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="x-btn"
          id="mClose"
          aria-label="Close"
          onClick={handleClose}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 4l16 16M20 4 4 20" />
          </svg>
        </button>

        {!submitted ? (
          <div id="mForm">
            <div className="mhead">
              <p>Start a project</p>
              <h2 id="mTitle">Tell me what you're building.</h2>
            </div>
            <form
              className="mform"
              id="reqForm"
              name="contact"
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="mform__hp" aria-hidden="true" style={{ display: 'none' }}>
                <label>
                  Leave this empty{' '}
                  <input
                    name="company"
                    tabIndex="-1"
                    autoComplete="off"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </label>
              </p>
              <label htmlFor="f-name">
                <span>Name</span>
                <input
                  id="f-name"
                  ref={nameInputRef}
                  name="name"
                  type="text"
                  required
                  maxLength="80"
                  placeholder="Your name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="f-email">
                <span>Email</span>
                <input
                  id="f-email"
                  name="email"
                  type="email"
                  required
                  maxLength="120"
                  placeholder="you@company.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="f-project">
                <span>Project</span>
                <textarea
                  id="f-project"
                  name="project"
                  rows="4"
                  required
                  maxLength="1500"
                  placeholder="A few words about your project, timeline, and budget."
                  value={formData.project}
                  onChange={handleChange}
                ></textarea>
              </label>
              <div className="mform__bot">
                <small>I reply within one business day.</small>
                <button
                  type="submit"
                  className="pill pill--dark pill--arrow"
                  id="mSend"
                  disabled={submitting}
                >
                  <span
                    className="pill__in"
                    data-h="s 1 1.04"
                    data-hs="320 18"
                    data-ht=".pill"
                  >
                    <span id="mSendLbl">
                      {submitting ? 'Sending…' : 'Send message'}
                    </span>
                    <span className="pill__badge">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-h="x 0 2|y 0 -2"
                        data-hs="320 18"
                        data-ht=".pill"
                      >
                        <path d="M7 17 17 7M8 7h9v9" />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="msuccess" id="mSuccess" role="status" aria-live="polite">
            <div className="msuccess__badge">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z" />
              </svg>
            </div>
            <h2 id="mOkT">{successState.title}</h2>
            <p id="mOkP">{successState.body}</p>
            {successState.showAlt && (
              <p className="msuccess__alt">
                Email app didn't open? Write to{' '}
                <a data-mail href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            )}
            <button
              type="button"
              className="pill pill--dark"
              id="mDone"
              onClick={handleClose}
            >
              <span className="pill__in" data-h="s 1 1.04" data-hs="320 18" data-ht=".pill">
                Close
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
