"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createGalleryComment, deleteGalleryComment, getGalleryComments, getPlayerById, updateGalleryComment } from "@/lib/supabase";
import type { GalleryComment, Player } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { Edit2, Loader2, Lock, MoreHorizontal, Send, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";

interface CommentSectionProps {
  albumId: string;
}

export function CommentSection({ albumId }: CommentSectionProps) {
  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Edit State
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Delete State
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    loadComments();
    checkUser();
  }, [albumId]);

  async function checkUser() {
    const token = getCookie("player_token");
    if (token) {
      const player = await getPlayerById(token);
      if (player) {
        setCurrentUser(player);
      }
    }
  }

  async function loadComments() {
    try {
      setIsLoading(true);
      const data = await getGalleryComments(albumId);
      setComments(data);
    } catch (error) {
       console.error("Failed to load comments:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;

    try {
      setIsSubmitting(true);

      const newComment = await createGalleryComment({
        albumId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        content,
      });

      if (newComment) {
         const optimisticComment: GalleryComment = {
             id: newComment.id,
             albumId: newComment.album_id,
             authorId: newComment.author_id,
             authorName: newComment.author_name,
             content: newComment.content,
             createdAt: newComment.created_at,
             updatedAt: null
         };
         
         setComments((prev) => [optimisticComment, ...prev]);
         setContent("");
         setShowForm(false);
         toast({
            title: "Comment posted!",
            description: "Thanks for sharing your thoughts.",
         });
      }
    } catch (error) {
        console.error("Error posting comment:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to post comment. Please try again.",
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateGalleryComment(commentId, editContent);
      
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, content: editContent, updatedAt: new Date().toISOString() } : c
      ));
      
      setEditingCommentId(null);
      setEditContent("");
      toast({
        title: "Comment updated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update comment.",
      });
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    try {
      await deleteGalleryComment(commentToDelete);
      
      setComments(prev => prev.filter(c => c.id !== commentToDelete));
      setCommentToDelete(null);
      
      toast({
        title: "Comment deleted",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment.",
      });
    }
  };

  const startEditing = (comment: GalleryComment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent("");
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
      <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Comment Button / Form */}
      {currentUser ? (
        !showForm ? (
          <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
            Add a Comment as {currentUser.name}
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-lg bg-card anim-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground">
                Posting as <span className="text-foreground font-bold">{currentUser.name}</span>
              </span>
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
                {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Posting...
                    </>
                ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Post Comment
                    </>
                )}
              </Button>
            </div>
          </form>
        )
      ) : (
        <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-center gap-2 text-muted-foreground text-sm">
           <Lock className="h-4 w-4" />
           <span>Only team members can post comments.</span>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 opacity-50" />
                Loading comments...
            </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 group"
            >
              <Avatar className="h-10 w-10 shrink-0 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                  {getInitials(comment.authorName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {comment.authorName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString("tr-TR", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                      {comment.updatedAt && (
                        <span className="ml-1 italic text-[10px] opacity-70">(edited)</span>
                      )}
                    </span>
                  </div>
                  
                  {/* Actions Menu */}
                  {currentUser && (currentUser.id === comment.authorId || currentUser.isAdmin) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEditing(comment)}>
                          <Edit2 className="h-4 w-4 mr-2" /> 
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCommentToDelete(comment.id)} className="text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> 
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {editingCommentId === comment.id ? (
                  <div className="mt-2 space-y-2">
                    <Textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="bg-background"
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={cancelEditing}>Cancel</Button>
                      <Button size="sm" onClick={() => handleEditSubmit(comment.id)}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
