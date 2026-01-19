"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Send, AlertCircle } from "lucide-react";
import type { Comment } from "@/lib/types";

interface CommentSectionProps {
  albumId: string;
}

// Mock comments for demonstration
const mockComments: Comment[] = [
  {
    id: "1",
    albumId: "1",
    authorName: "Alex Rivera",
    authorEmail: "alex@example.com",
    content:
      "What an incredible day! So proud of everyone on the team. That final point was epic!",
    createdAt: "2025-12-16T10:30:00Z",
  },
  {
    id: "2",
    albumId: "1",
    authorName: "Jordan Chen",
    authorEmail: "jordan@example.com",
    content:
      "Great shots! Love the action photos. Can someone tag me in photo #23?",
    createdAt: "2025-12-16T14:15:00Z",
  },
];

export function CommentSection({ albumId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(
    mockComments.filter((c) => c.albumId === albumId)
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) return;

    setIsSubmitting(true);

    // Simulate API call - in production, this would POST to your backend
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newComment: Comment = {
      id: Date.now().toString(),
      albumId,
      authorName: name,
      authorEmail: email,
      content,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);
    setName("");
    setEmail("");
    setContent("");
    setShowForm(false);
    setIsSubmitting(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Info Notice */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
        <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p>
            Comments are stored locally for this demo. In production, they would
            be saved to a database like Supabase for persistence and moderation.
          </p>
        </div>
      </div>

      {/* Add Comment Button / Form */}
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
          Add a Comment
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-lg">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Comment</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about this album..."
              rows={3}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? "Posting..." : "Post Comment"}
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 p-4 rounded-lg bg-muted/30"
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {getInitials(comment.authorName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.authorName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-foreground">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
