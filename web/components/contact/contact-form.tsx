"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Send, Loader2 } from "lucide-react";
import type { ContactFormData } from "@/lib/types";

const experienceLevels = [
  {
    value: "beginner",
    label: "Beginner",
    description: "New to Ultimate - never played before",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Played casually / know the basics",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Regular player / league experience",
  },
  {
    value: "competitive",
    label: "Competitive",
    description: "Tournament / club level experience",
  },
];

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    experienceLevel: "beginner",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Simulate API call - in production, this would POST to your backend
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Log form data (in production, send to database or email service)
      console.log("Form submitted:", formData);
      
      setIsSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-primary/20">
        <CardContent className="py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-2">
            Thanks for reaching out!
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We've received your message and will get back to you soon. In the
            meantime, check out our upcoming events or learn more about the
            rules of Ultimate!
          </p>
          <Button
            variant="outline"
            className="mt-6 bg-transparent"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                email: "",
                experienceLevel: "beginner",
                message: "",
              });
            }}
          >
            Submit Another Response
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Our Team</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level *</Label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  experienceLevel: value as ContactFormData["experienceLevel"],
                }))
              }
            >
              <SelectTrigger id="experience">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {level.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Tell us about yourself - your interests, availability, questions, etc."
              rows={4}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <Send className="h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting this form, you agree to be contacted by Disc Dynasty
            regarding team activities and events.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
