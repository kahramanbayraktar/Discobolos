"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertRSVP } from "@/lib/supabase";
import { RSVP } from "@/lib/types";
import { CheckCircle2, CircleDashed, HelpCircle, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface RSVPSurveyProps {
  eventId: string;
  currentPlayer: any;
  initialRSVPs: RSVP[];
  players: any[];
  dict: any;
  lang: string;
}

export function RSVPSurvey({ eventId, currentPlayer, initialRSVPs, players, dict, lang }: RSVPSurveyProps) {
  const [rsvps, setRsvps] = useState<RSVP[]>(initialRSVPs);
  const [loading, setLoading] = useState<RSVP['status'] | null>(null);
  const router = useRouter();

  const myRSVP = rsvps.find(r => r.playerId === currentPlayer?.id);

  const handleRSVP = async (status: RSVP['status']) => {
    if (!currentPlayer) {
      toast.error(dict.event_detail.rsvp_login_required);
      router.push(`/${lang}/login?next=/${lang}/events/${eventId}`);
      return;
    }

    setLoading(status);
    try {
      await upsertRSVP(currentPlayer.id, eventId, status);
      
      // Update local state instead of full refresh for better UX
      setRsvps(prev => {
        const filtered = prev.filter(r => r.playerId !== currentPlayer.id);
        return [...filtered, {
          id: 'temp-' + Date.now(),
          playerId: currentPlayer.id,
          eventId,
          status,
          createdAt: new Date().toISOString()
        }];
      });
      
      toast.success(dict.event_detail.rsvp_success);
      router.refresh();
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(null);
    }
  };

  const stats = {
    coming: rsvps.filter(r => r.status === 'coming'),
    not_coming: rsvps.filter(r => r.status === 'not_coming'),
    maybe: rsvps.filter(r => r.status === 'maybe'),
  };

  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || "Unknown Player";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* RSVP Actions */}
      <Card className="lg:col-span-1 border-primary/20 shadow-lg h-fit">
        <CardHeader>
          <CardTitle className="text-xl font-[family-name:var(--font-display)]">
            {dict.event_detail.rsvp_title}
          </CardTitle>
          <CardDescription>
            {dict.event_detail.rsvp_description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!currentPlayer ? (
            <Button variant="outline" className="w-full text-xs py-8 border-dashed border-primary/30" asChild>
              <a href={`/${lang}/login?next=/${lang}/events/${eventId}`}>
                {dict.event_detail.rsvp_login_required}
              </a>
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => handleRSVP('coming')}
                disabled={!!loading}
                variant={myRSVP?.status === 'coming' ? "default" : "outline"}
                className={`w-full justify-start gap-3 h-12 ${myRSVP?.status === 'coming' ? 'bg-[#ef6b25] hover:bg-[#ef6b25]/90 border-transparent text-white' : 'hover:border-[#ef6b25] hover:bg-[#ef6b25]/5'}`}
              >
                {loading === 'coming' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className={`w-5 h-5 ${myRSVP?.status === 'coming' ? '' : 'text-[#ef6b25]'}`} />}
                {dict.event_detail.rsvp_coming}
              </Button>

              <Button 
                onClick={() => handleRSVP('maybe')}
                disabled={!!loading}
                variant={myRSVP?.status === 'maybe' ? "default" : "outline"}
                className={`w-full justify-start gap-3 h-12 ${myRSVP?.status === 'maybe' ? 'bg-[#6b97aa] hover:bg-[#6b97aa]/90 border-transparent text-white' : 'hover:border-[#6b97aa] hover:bg-[#6b97aa]/5'}`}
              >
                {loading === 'maybe' ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className={`w-5 h-5 ${myRSVP?.status === 'maybe' ? '' : 'text-[#6b97aa]'}`} />}
                {dict.event_detail.rsvp_maybe}
              </Button>

              <Button 
                onClick={() => handleRSVP('not_coming')}
                disabled={!!loading}
                variant={myRSVP?.status === 'not_coming' ? "default" : "outline"}
                className={`w-full justify-start gap-3 h-12 ${myRSVP?.status === 'not_coming' ? 'bg-[#31393c] hover:bg-[#31393c]/90 text-white border-transparent' : 'hover:border-[#31393c] hover:bg-[#31393c]/5'}`}
              >
                {loading === 'not_coming' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className={`w-5 h-5 ${myRSVP?.status === 'not_coming' ? '' : 'text-[#31393c]'}`} />}
                {dict.event_detail.rsvp_not_coming}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Attendees List */}
      <Card className="lg:col-span-2 border-primary/10 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CircleDashed className="w-5 h-5 text-primary animate-pulse-slow" />
            {dict.event_detail.attendees_title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coming */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#ef6b25]/20 pb-2">
                <span className="text-sm font-bold text-[#ef6b25] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {dict.event_detail.attendees_coming}
                </span>
                <Badge variant="secondary" className="bg-[#ef6b25]/10 text-[#ef6b25] border-none">{stats.coming.length}</Badge>
              </div>
              <ul className="space-y-1.5 px-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                {stats.coming.map(r => (
                  <li key={r.id} className="text-sm text-foreground/80 flex items-center gap-2 animate-in fade-in slide-in-from-left-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef6b25]" />
                    {getPlayerName(r.playerId)}
                  </li>
                ))}
                {stats.coming.length === 0 && <li className="text-xs text-muted-foreground italic">{dict.event_detail.attendees_empty}</li>}
              </ul>
            </div>

            {/* Maybe */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#6b97aa]/20 pb-2">
                <span className="text-sm font-bold text-[#6b97aa] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  {dict.event_detail.attendees_maybe}
                </span>
                <Badge variant="secondary" className="bg-[#6b97aa]/10 text-[#6b97aa] border-none">{stats.maybe.length}</Badge>
              </div>
              <ul className="space-y-1.5 px-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                {stats.maybe.map(r => (
                  <li key={r.id} className="text-sm text-foreground/80 flex items-center gap-2 animate-in fade-in slide-in-from-left-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6b97aa]" />
                    {getPlayerName(r.playerId)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Coming */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#31393c]/20 pb-2">
                <span className="text-sm font-bold text-[#31393c] flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  {dict.event_detail.attendees_not_coming}
                </span>
                <Badge variant="secondary" className="bg-[#31393c]/10 text-[#31393c] border-none">{stats.not_coming.length}</Badge>
              </div>
              <ul className="space-y-1.5 px-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                {stats.not_coming.map(r => (
                  <li key={r.id} className="text-sm text-muted-foreground flex items-center gap-2 animate-in fade-in slide-in-from-left-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#31393c]/30" />
                    {getPlayerName(r.playerId)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
