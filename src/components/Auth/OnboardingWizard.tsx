"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { getSingleUser, updateUser } from "@/services/data";

type OnboardingData = {
  purpose: string;
  targetScore: string;
  examDateType: string;
  customExamDate: string;
  englishLevel: string;
  hardestModule: string;
  targetCountries: string[];
  testType: string;
  counsellingInterest: string;
  interestAreas: string[];
  communication: string[];
  availability: string[];
  shareScores: boolean;
  notes: string;
};

const purposeOptions = [
  "Study Abroad",
  "Work Abroad",
  "Immigration / PR",
  "Professional Registration",
  "Other / Exploring",
];

const targetScoreOptions = ["6.0", "6.5", "7.0", "7.5", "8.0+", "Not sure yet"];

const englishLevels = [
  "Beginner",
  "Upper Beginner",
  "Intermediate",
  "Upper Intermediate",
  "Advanced",
];

const moduleOptions = [
  "Listening",
  "Reading",
  "Writing",
  "Speaking",
  "Not sure",
];

const countryOptions = [
  "UK",
  "Canada",
  "Australia",
  "USA",
  "New Zealand",
  "Europe (Other)",
  "Middle East",
  "Still exploring",
];

const testTypes = ["Academic", "General Training", "UKVI", "Not sure"];

const interestAreas = [
  "Study abroad consultation",
  "IELTS coaching",
  "Writing correction",
  "Speaking partners / live room",
  "Intensive crash course",
  "Scholarship alerts",
  "Visa guidance",
];

const communicationChannels = ["Email", "WhatsApp", "SMS", "In-app only"];

const availabilityOptions = [
  "Weekday mornings",
  "Weekday evenings",
  "Weekend mornings",
  "Weekend evenings",
  "Flexible / contact to schedule",
];

const examDateQuickSelect = [
  { id: "lt1", label: "Within 1 month" },
  { id: "1-3", label: "In 1–3 months" },
  { id: "3+", label: "3+ months away" },
];

const DEFAULT_FORM: OnboardingData = {
  purpose: "",
  targetScore: "",
  examDateType: "",
  customExamDate: "",
  englishLevel: "",
  hardestModule: "",
  targetCountries: [],
  testType: "",
  counsellingInterest: "",
  interestAreas: [],
  communication: ["Email"],
  availability: [],
  shareScores: false,
  notes: "",
};

const stepOrder = ["goals", "profile", "services", "wrapUp"] as const;

const ONBOARDING_STORAGE_KEY = "ielts-onboarding-status";

const OnboardingWizard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const { data: session, status } = useSession();
  const [step, setStep] = useState<typeof stepOrder[number]>("goals");
  const [form, setForm] = useState<OnboardingData>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const storageKey = session?.user?.id
    ? `${ONBOARDING_STORAGE_KEY}-${session.user.id}`
    : ONBOARDING_STORAGE_KEY;

  useEffect(() => {
    if (status === "loading") return;
    if (typeof window === "undefined") return;

    if (status === "unauthenticated") {
      setIsCheckingStatus(false);
      router.replace("/user/signin");
      return;
    }

    if (!session?.user?.id) {
      setIsCheckingStatus(false);
      return;
    }

    let isMounted = true;

    const hydrateStatus = async () => {
      try {
        const response = await getSingleUser(session.user.id);
        const userRecord =
          response?.data?.[0] ?? response?.data ?? response ?? null;
        const onboardingStatus =
          userRecord?.onboarding?.status ?? userRecord?.onboardingStatus;

        if (
          onboardingStatus === "completed" ||
          onboardingStatus === "skipped"
        ) {
          localStorage.setItem(storageKey, onboardingStatus);
          router.replace(nextPath);
          return;
        }

        localStorage.setItem(storageKey, "in-progress");
      } catch (error) {
        console.error("Failed to load onboarding status", error);
      } finally {
        if (isMounted) {
          setIsCheckingStatus(false);
        }
      }
    };

    hydrateStatus();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, status, router, nextPath, storageKey]);

  const progressValue = useMemo(() => {
    const index = stepOrder.indexOf(step);
    return Math.round(((index + 1) / stepOrder.length) * 100);
  }, [step]);

  const handleSelect = (field: keyof OnboardingData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMultiSelect = (field: keyof OnboardingData, value: string) => {
    setForm((prev) => {
      const current = new Set(prev[field] as string[]);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { ...prev, [field]: Array.from(current) };
    });
  };

  const goToNext = () => {
    const index = stepOrder.indexOf(step);
    if (index < stepOrder.length - 1) {
      setStep(stepOrder[index + 1]);
    }
  };

  const goToPrevious = () => {
    const index = stepOrder.indexOf(step);
    if (index > 0) {
      setStep(stepOrder[index - 1]);
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (status === "loading") return;
    if (!session?.user?.id) {
      setSubmitError(
        "We couldn’t verify your account. Please sign in again to continue."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        onboarding: {
          ...form,
          examDate:
            form.customExamDate?.trim() ||
            (form.examDateType ? form.examDateType : ""),
          status: "completed",
          completedAt: new Date().toISOString(),
        },
      };

      await updateUser(session.user.id, payload);

      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, "completed");
      }
      setIsComplete(true);
      setTimeout(() => {
        router.push(nextPath);
      }, 1500);
    } catch (error) {
      console.error("Failed to save onboarding", error);
      setSubmitError(
        "We couldn’t save your preferences. Please try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepShell: React.FC<{
    title: string;
    description: string;
    children: React.ReactNode;
  }> = ({ title, description, children }) => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
      {(status === "loading" || isCheckingStatus) && (
        <div className="flex min-h-screen items-center justify-center">
          <span className="loading loading-dots loading-lg text-rose-500" />
        </div>
      )}
      {!(status === "loading" || isCheckingStatus) && (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
              Smart onboarding
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">
              Tell us about your IELTS journey
            </h1>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (typeof window !== "undefined") {
                localStorage.setItem(storageKey, "skipped");
              }
              if (session?.user?.id) {
                try {
                  await updateUser(session.user.id, {
                    onboarding: {
                      status: "skipped",
                      updatedAt: new Date().toISOString(),
                    },
                  });
                } catch (error) {
                  console.error("Failed to persist onboarding skip", error);
                }
              }
              router.push(nextPath);
            }}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </button>
        </div>

        <div className="space-y-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-rose-100">
            <div
              className="h-2 rounded-full bg-rose-500 transition-all duration-500"
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-widest text-gray-400">
            <span>{progressValue}% complete</span>
            <span>
              Step {stepOrder.indexOf(step) + 1} / {stepOrder.length}
            </span>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-rose-100/70 bg-white/95 shadow-2xl backdrop-blur-md">
          <div className="grid gap-0 md:grid-cols-[1.1fr,0.9fr]">
            <div className="border-b border-rose-100/70 p-8 sm:p-10 md:border-b-0 md:border-r">
              {submitError && (
                <div className="alert alert-error mb-6">
                  <span>{submitError}</span>
                </div>
              )}
              {step === "goals" && (
                <StepShell
                  title="Your IELTS goals"
                  description="Set the tone so we can prioritise the lessons, reminders, and offers that match your plan."
                >
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Purpose for IELTS
                    </h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {purposeOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSelect("purpose", option)}
                          className={`btn h-auto justify-start border ${
                            form.purpose === option
                              ? "border-rose-400 bg-rose-50 text-rose-600"
                              : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Target band score
                      </h3>
                      <div className="mt-3 grid gap-2">
                        {targetScoreOptions.map((score) => (
                          <button
                            key={score}
                            type="button"
                            onClick={() => handleSelect("targetScore", score)}
                            className={`btn h-10 justify-start border ${
                              form.targetScore === score
                                ? "border-rose-400 bg-rose-50 text-rose-600"
                                : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Expected exam date
                      </h3>
                      <div className="mt-3 grid gap-2">
                        {examDateQuickSelect.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              handleSelect("examDateType", item.label)
                            }
                            className={`btn h-10 justify-start border ${
                              form.examDateType === item.label
                                ? "border-rose-400 bg-rose-50 text-rose-600"
                                : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                        <div className="divider text-xs uppercase tracking-widest text-gray-400">
                          or pick a date
                        </div>
                        <input
                          type="date"
                          value={form.customExamDate}
                          onChange={(e) =>
                            handleSelect("customExamDate", e.target.value)
                          }
                          className="input input-bordered w-full border-gray-200 focus:border-rose-400 focus:ring focus:ring-rose-100"
                        />
                      </div>
                    </div>
                  </section>
                </StepShell>
              )}

              {step === "profile" && (
                <StepShell
                  title="Profile & readiness"
                  description="Understand where you stand today to personalise coaching and feedback loops."
                >
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Current English level (self assessment)
                    </h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {englishLevels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleSelect("englishLevel", level)}
                          className={`btn h-10 justify-start border ${
                            form.englishLevel === level
                              ? "border-rose-400 bg-rose-50 text-rose-600"
                              : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Hardest IELTS module right now
                    </h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {moduleOptions.map((module) => (
                        <button
                          key={module}
                          type="button"
                          onClick={() => handleSelect("hardestModule", module)}
                          className={`btn h-10 justify-start border ${
                            form.hardestModule === module
                              ? "border-rose-400 bg-rose-50 text-rose-600"
                              : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                          }`}
                        >
                          {module}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Target country or region
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {countryOptions.map((country) => {
                        const active = form.targetCountries.includes(country);
                        return (
                          <button
                            key={country}
                            type="button"
                            onClick={() =>
                              toggleMultiSelect("targetCountries", country)
                            }
                            className={`btn h-10 rounded-full border px-4 ${
                              active
                                ? "border-rose-400 bg-rose-50 text-rose-600"
                                : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                            }`}
                          >
                            {country}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Preferred test format
                    </h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {testTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleSelect("testType", type)}
                          className={`btn h-10 justify-start border ${
                            form.testType === type
                              ? "border-rose-400 bg-rose-50 text-rose-600"
                              : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </section>
                </StepShell>
              )}

              {step === "services" && (
                <StepShell
                  title="Services & support"
                  description="Choose what kind of support and offers you want us to bring to you first."
                >
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Interested in free counselling?
                    </h3>
                    <div className="mt-3 flex gap-3">
                      {["Yes", "Maybe later", "No"].map((choice) => (
                        <button
                          key={choice}
                          type="button"
                          onClick={() =>
                            handleSelect("counsellingInterest", choice)
                          }
                          className={`btn h-10 flex-1 border ${
                            form.counsellingInterest === choice
                              ? "border-rose-400 bg-rose-50 text-rose-600"
                              : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                          }`}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      What would you like help with?
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {interestAreas.map((area) => {
                        const active = form.interestAreas.includes(area);
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() =>
                              toggleMultiSelect("interestAreas", area)
                            }
                            className={`btn h-10 rounded-full border px-4 ${
                              active
                                ? "border-rose-400 bg-rose-50 text-rose-600"
                                : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                            }`}
                          >
                            {area}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      How should we reach you?
                    </h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {communicationChannels.map((channel) => {
                        const active = form.communication.includes(channel);
                        return (
                          <button
                            key={channel}
                            type="button"
                            onClick={() =>
                              toggleMultiSelect("communication", channel)
                            }
                            className={`btn h-10 justify-start border ${
                              active
                                ? "border-rose-400 bg-rose-50 text-rose-600"
                                : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                            }`}
                          >
                            {channel}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </StepShell>
              )}

              {step === "wrapUp" && (
                <StepShell
                  title="Almost done"
                  description="Share a few final details so we can schedule counsellors and match you to the right mentors."
                >
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      When can we reach you?
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {availabilityOptions.map((slot) => {
                        const active = form.availability.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() =>
                              toggleMultiSelect("availability", slot)
                            }
                            className={`btn h-10 rounded-full border px-4 ${
                              active
                                ? "border-rose-400 bg-rose-50 text-rose-600"
                                : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                    <input
                      type="checkbox"
                      checked={form.shareScores}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          shareScores: e.target.checked,
                        }))
                      }
                      className="checkbox checkbox-rose"
                    />
                    <div className="text-sm text-gray-600">
                      Share my latest band score or mock test results with the
                      counsellor to get precise guidance.
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Anything else we should know?
                    </h3>
                    <textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      rows={4}
                      placeholder="Example: Need writing feedback before 15th May; prefer evening slots."
                      className="textarea textarea-bordered w-full border-gray-200 focus:border-rose-400 focus:ring focus:ring-rose-100"
                    />
                  </section>
                </StepShell>
              )}

              <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-gray-400">
                  We’ll never share your details without permission. Update your
                  preferences anytime in your profile.
                </div>
                <div className="flex gap-3">
                  {step !== "goals" && (
                    <button
                      type="button"
                      onClick={goToPrevious}
                      className="btn btn-ghost text-sm text-gray-500 hover:text-gray-700"
                    >
                      Back
                    </button>
                  )}
                  {step !== "wrapUp" ? (
                    <button
                      type="button"
                      onClick={goToNext}
                      className="btn btn-primary bg-rose-500 text-white hover:bg-rose-600"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className={`btn btn-primary bg-rose-500 text-white hover:bg-rose-600 ${
                        isSubmitting ? "loading" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving your profile…" : "Finish"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <aside className="flex flex-col justify-between bg-rose-50/70 p-8 sm:p-10">
              <div className="space-y-6">
                <div className="rounded-2xl bg-white/90 p-6 shadow-lg backdrop-blur">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-500">
                    What you unlock
                  </h3>
                  <ul className="mt-3 space-y-3 text-sm text-gray-600">
                    <li>• Personalised study plan synced to your exam date</li>
                    <li>• Priority access to counsellors in your target country</li>
                    <li>
                      • Tailored offers on writing correction, mock tests, and
                      crash courses
                    </li>
                    <li>• Weekly check-ins based on your chosen modules</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-rose-100 bg-rose-100/50 p-6 text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">
                    Completing this takes under 90 seconds.
                  </p>
                  <p className="mt-2">
                    Our counsellors and automated journeys rely on these inputs
                    to ensure every recommendation feels handcrafted.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-white/80 p-5 text-sm text-gray-500 shadow-lg backdrop-blur">
                {isComplete ? (
                  <p className="font-medium text-rose-600">
                    Profile saved! Redirecting you to your dashboard…
                  </p>
                ) : (
                  <>
                    <p className="font-medium text-gray-700">
                      Have questions?
                    </p>
                    <p>
                      Jump into a live chat or request a callback after you
                      finish onboarding. We’re here to help.
                    </p>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
      )}
    </div>
  );
};

export default OnboardingWizard;

