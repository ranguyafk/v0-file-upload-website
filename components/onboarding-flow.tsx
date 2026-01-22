"use client"

import { useState, useEffect } from "react"
import { X, Upload, Lock, Zap, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const ONBOARDING_STEPS = [
  {
    icon: <Upload className="w-8 h-8" />,
    title: "Upload Files Instantly",
    description: "Drag and drop files up to 1GB. Get a shareable link in seconds.",
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Secure & Private",
    description: "Add password protection and set expiration times for your files.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Fast & Simple",
    description: "No signup required. Upload, share, and manage files effortlessly.",
  },
]

export function OnboardingFlow() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("onboarding-completed")
    if (!hasSeenOnboarding) {
      // Show onboarding after a brief delay
      setTimeout(() => setShowOnboarding(true), 1000)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    localStorage.setItem("onboarding-completed", "true")
    setShowOnboarding(false)
  }

  const handleSkip = () => {
    localStorage.setItem("onboarding-completed", "true")
    setShowOnboarding(false)
  }

  if (!showOnboarding) return null

  const step = ONBOARDING_STEPS[currentStep]
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="max-w-md w-full space-y-8">
        {/* Skip button */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip
          </Button>
        </div>

        {/* Content */}
        <div className="text-center space-y-6 animate-in slide-in-from-bottom-4">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
            <div className="text-primary">{step.icon}</div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {step.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {step.description}
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : index < currentStep
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Action button */}
        <Button
          onClick={handleNext}
          className="w-full h-12 text-base"
        >
          {isLastStep ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Get Started
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
