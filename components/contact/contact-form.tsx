"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ContactFormData } from "@/lib/types";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { useState } from "react";

export function ContactForm({ dict }: { dict: any }) {
  const experienceLevels = [
    {
      value: "beginner",
      label: dict.experience_levels.beginner.label,
      description: dict.experience_levels.beginner.description,
    },
    {
      value: "intermediate",
      label: dict.experience_levels.intermediate.label,
      description: dict.experience_levels.intermediate.description,
    },
    {
      value: "advanced",
      label: dict.experience_levels.advanced.label,
      description: dict.experience_levels.advanced.description,
    },
    {
      value: "competitive",
      label: dict.experience_levels.competitive.label,
      description: dict.experience_levels.competitive.description,
    },
  ];
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
            {dict.success_title}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {dict.success_desc}
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
            {dict.another_response_button}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{dict.name_label}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev: ContactFormData) => ({ ...prev, name: e.target.value }))
                }
                placeholder={dict.name_placeholder}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{dict.email_label}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev: ContactFormData) => ({ ...prev, email: e.target.value }))
                }
                placeholder={dict.email_placeholder}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">{dict.experience_label}</Label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value) =>
                setFormData((prev: ContactFormData) => ({
                  ...prev,
                  experienceLevel: value as ContactFormData["experienceLevel"],
                }))
              }
            >
              <SelectTrigger id="experience">
                <SelectValue placeholder={dict.experience_placeholder} />
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
            <Label htmlFor="message">{dict.message_label}</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev: ContactFormData) => ({ ...prev, message: e.target.value }))
              }
              placeholder={dict.message_placeholder}
              rows={4}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{dict.error_generic}</p>
          )}

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {dict.submitting_button}
              </>
            ) : (
              <>
                {dict.submit_button}
                <Send className="h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {dict.agreement_text}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
