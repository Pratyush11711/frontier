"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, ArrowRight } from "lucide-react";
import { useWaitlist } from "@/context/WaitlistContext";
import { useLenis } from "@/components/SmoothScrollProvider";
import { REFERRAL_STORAGE_KEY } from "@/components/ConfirmationContent";
import { cn } from "@/lib/utils";

const inputClass =
  "type-body-s w-full rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white outline-none transition-colors placeholder:text-white/40 focus:border-pacific sm:type-body-l sm:px-4 sm:py-3";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC",
] as const;

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="type-mono-label mb-1.5 block text-white/75">
      {children}
      {required ? <span className="text-destructive">*</span> : null}
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="type-h3 border-t border-white/10 pt-6 text-white first:border-t-0 first:pt-0">
      {children}
    </h3>
  );
}

function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-white/85">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="h-4 w-4 accent-pacific"
      />
      <span className="type-body-s sm:type-body-l">{label}</span>
    </label>
  );
}

function FileUploadField({
  id,
  name,
  required,
  helper,
  onChange,
}: {
  id: string;
  name: string;
  required?: boolean;
  helper?: string;
  onChange?: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File | null) => {
    setFileName(file?.name ?? null);
    onChange?.(file);
  };

  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {name}
      </FieldLabel>
      {helper ? <p className="type-body-s mb-2 text-white/55">{helper}</p> : null}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0] ?? null;
          handleFile(file);
          if (inputRef.current && file) {
            const dt = new DataTransfer();
            dt.items.add(file);
            inputRef.current.files = dt.files;
          }
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 transition-colors sm:flex-row sm:py-5",
          dragging ? "border-pacific bg-pacific/10" : "border-white/20 bg-white/[0.04]",
        )}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-pacific/50 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
        <span className="type-body-s text-white/50">or drag files here.</span>
        {fileName ? <span className="type-body-s text-pacific">{fileName}</span> : null}
        <input
          ref={inputRef}
          id={id}
          name={id}
          type="file"
          required={required && !fileName}
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}

export function WaitlistModal() {
  const router = useRouter();
  const lenis = useLenis();
  const { isOpen, closeWaitlist } = useWaitlist();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [npiOwnerMatch, setNpiOwnerMatch] = useState("");
  const [hasResellerLicense, setHasResellerLicense] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      setNpiOwnerMatch("");
      setHasResellerLicense("");
      setFormError(null);
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [isOpen, lenis]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!npiOwnerMatch) {
      setFormError("Please select whether the NPI owner matches the contact for this account.");
      return;
    }
    if (!hasResellerLicense) {
      setFormError("Please select whether your business has a reseller's license.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    const refCode = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
    sessionStorage.setItem(REFERRAL_STORAGE_KEY, refCode);
    closeWaitlist();
    router.push("/confirmation");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-deep-teal/80 backdrop-blur-sm"
        onClick={closeWaitlist}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal
        aria-labelledby="waitlist-title"
        className="glossy-card-dark relative z-10 flex h-[min(92dvh,100%)] max-h-[92dvh] w-full min-h-0 flex-col overflow-hidden rounded-t-2xl sm:h-auto sm:max-h-[90dvh] sm:max-w-2xl sm:rounded-2xl lg:max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeWaitlist}
          className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:right-4 sm:top-4"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5 [-webkit-overflow-scrolling:touch] sm:px-8 sm:pt-8"
          data-lenis-prevent
        >
            <div className="pr-8 text-center sm:pr-10">
              <p className="type-mono-label text-pacific">Provider registration</p>
              <h2 id="waitlist-title" className="type-editorial-40 mt-2 text-white">
                Provider account request
              </h2>
              <p className="type-body-s mx-auto mt-3 max-w-2xl text-pretty text-white/65 sm:type-body-l">
                <span className="font-medium text-white/80">Disclaimer:</span> Frontier BioMed provides
                platform access exclusively to verified healthcare providers, research institutions,
                and GPOs for institutional and laboratory use only. We do not sell to individual
                consumers.
              </p>
            </div>

            <form
              id="waitlist-form"
              onSubmit={handleSubmit}
              className="mt-6 space-y-5 pb-8 sm:mt-8"
            >
              {formError ? (
                <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-white">
                  {formError}
                </p>
              ) : null}
              <SectionTitle>Contact Information</SectionTitle>

              <fieldset className="space-y-3">
                <legend className="type-mono-label mb-1.5 block text-white/75">
                  Name<span className="text-destructive">*</span>
                </legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <FieldLabel htmlFor="firstName" required>
                      First
                    </FieldLabel>
                    <input id="firstName" name="firstName" required className={inputClass} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="lastName" required>
                      Last
                    </FieldLabel>
                    <input id="lastName" name="lastName" required className={inputClass} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="suffix">Suffix</FieldLabel>
                    <select id="suffix" name="suffix" className={inputClass} defaultValue="">
                      <option value="" className="bg-deep-teal">
                        —
                      </option>
                      {["Jr.", "Sr.", "II", "III", "IV", "MD", "DO", "NP", "PA"].map((suffix) => (
                        <option key={suffix} value={suffix} className="bg-deep-teal">
                          {suffix}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              <div>
                <FieldLabel htmlFor="email" required>
                  Email
                </FieldLabel>
                <input id="email" name="email" type="email" required className={inputClass} />
              </div>

              <div>
                <FieldLabel htmlFor="phone" required>
                  Phone
                </FieldLabel>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="US-based mobile number"
                  className={inputClass}
                />
              </div>

              <SectionTitle>Business Profile</SectionTitle>

              <div>
                <FieldLabel htmlFor="companyName" required>
                  Company Name
                </FieldLabel>
                <input id="companyName" name="companyName" required className={inputClass} />
              </div>

              <div>
                <FieldLabel htmlFor="businessType">Business Type</FieldLabel>
                <input
                  id="businessType"
                  name="businessType"
                  readOnly
                  value="Provider"
                  className={cn(inputClass, "text-white/60")}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="website" required>
                    Website
                  </FieldLabel>
                  <input id="website" name="website" type="text" inputMode="url" required className={inputClass} />
                </div>
                <div>
                  <FieldLabel htmlFor="taxId" required>
                    Tax ID / EIN
                  </FieldLabel>
                  <input id="taxId" name="taxId" required className={inputClass} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="npiNumber" required>
                    NPI Number
                  </FieldLabel>
                  <input id="npiNumber" name="npiNumber" required className={inputClass} />
                </div>
                <div>
                  <FieldLabel htmlFor="stateLicense">State License Number</FieldLabel>
                  <input id="stateLicense" name="stateLicense" className={inputClass} />
                </div>
              </div>

              <fieldset className="space-y-2">
                <legend className="type-body-s text-white/80 sm:type-body-l">
                  Does the owner of the NPI number match the contact for this account?
                </legend>
                <div className="flex flex-wrap gap-5 pt-1">
                  <RadioOption
                    name="npiOwnerMatch"
                    value="yes"
                    label="Yes"
                    checked={npiOwnerMatch === "yes"}
                    onChange={setNpiOwnerMatch}
                  />
                  <RadioOption
                    name="npiOwnerMatch"
                    value="no"
                    label="No"
                    checked={npiOwnerMatch === "no"}
                    onChange={setNpiOwnerMatch}
                  />
                </div>
              </fieldset>

              <div>
                <FieldLabel htmlFor="deaNumber">DEA Registration Number</FieldLabel>
                <input id="deaNumber" name="deaNumber" className={inputClass} />
              </div>

              <fieldset className="space-y-2">
                <legend className="type-body-s text-white/80 sm:type-body-l">
                  Does your business have a reseller&apos;s license<span className="text-destructive">*</span>
                </legend>
                <p className="type-body-s text-white/55">
                  Helps determine your eligibility for sales tax exemption.
                </p>
                <div className="flex flex-wrap gap-5 pt-1">
                  <RadioOption
                    name="hasResellerLicense"
                    value="yes"
                    label="Yes"
                    checked={hasResellerLicense === "yes"}
                    onChange={setHasResellerLicense}
                  />
                  <RadioOption
                    name="hasResellerLicense"
                    value="no"
                    label="No"
                    checked={hasResellerLicense === "no"}
                    onChange={setHasResellerLicense}
                  />
                </div>
              </fieldset>

              {hasResellerLicense === "yes" ? (
                <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div>
                    <FieldLabel htmlFor="resellerPermitNumber" required>
                      Reseller&apos;s Permit Number
                    </FieldLabel>
                    <input
                      id="resellerPermitNumber"
                      name="resellerPermitNumber"
                      required
                      className={inputClass}
                    />
                  </div>
                  <FileUploadField
                    id="resellerCertificate"
                    name="Upload Reseller's Certificate"
                    required
                  />
                </div>
              ) : null}

              <SectionTitle>Business Address</SectionTitle>
              <p className="type-body-s -mt-3 text-white/55">
                If not applicable, use your main operating address
              </p>

              <div>
                <FieldLabel htmlFor="addressLine1" required>
                  Address Line 1
                </FieldLabel>
                <input id="addressLine1" name="addressLine1" required className={inputClass} />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <FieldLabel htmlFor="city" required>
                    City
                  </FieldLabel>
                  <input id="city" name="city" required className={inputClass} />
                </div>
                <div>
                  <FieldLabel htmlFor="state" required>
                    State
                  </FieldLabel>
                  <select id="state" name="state" required className={inputClass} defaultValue="">
                    <option value="" className="bg-deep-teal">
                      Select state
                    </option>
                    {US_STATES.map((state) => (
                      <option key={state} value={state} className="bg-deep-teal">
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor="zipCode" required>
                    Zip Code
                  </FieldLabel>
                  <input id="zipCode" name="zipCode" required className={inputClass} />
                </div>
              </div>

              <SectionTitle>Verification &amp; Referral</SectionTitle>

              <FileUploadField
                id="proofOfLicense"
                name="Upload Proof of Business or Professional License"
                helper="Optional at this stage. Clinics may upload a business permit; individual providers may upload a license or valid ID. Required later to complete your application."
              />

              <div>
                <FieldLabel htmlFor="referredBy" required>
                  Referred by someone? Let us know!
                </FieldLabel>
                <input
                  id="referredBy"
                  name="referredBy"
                  required
                  placeholder="Name or code of the person who referred you"
                  className={inputClass}
                />
              </div>

              <SectionTitle>Additional Notes</SectionTitle>

              <div>
                <FieldLabel htmlFor="comments">Comments</FieldLabel>
                <textarea
                  id="comments"
                  name="comments"
                  rows={4}
                  className={cn(inputClass, "resize-y")}
                />
              </div>

              <p className="type-body-s text-pretty text-white/55">
                By registering, you consent to receive email and/or SMS notifications, alerts, and
                occasional marketing communication from Frontier BioMed. Message frequency varies.
                Message &amp; data rates may apply. See our{" "}
                <a href="#" className="text-pacific underline underline-offset-2">
                  Terms &amp; Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-pacific underline underline-offset-2">
                  Privacy Policy
                </a>
                .
              </p>

              <button
                type="submit"
                disabled={loading}
                className="btn-icon-pill btn-icon-pill--primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="btn-icon-label">{loading ? "Submitting..." : "Submit"}</span>
                <span className="btn-icon-bubble btn-icon-bubble--primary" aria-hidden>
                  <ArrowRight className="btn-icon-arrow h-[1.1rem] w-[1.1rem]" strokeWidth={2.4} />
                </span>
              </button>
            </form>
          </div>
      </div>
    </div>
  );
}
