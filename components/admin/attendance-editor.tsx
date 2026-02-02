"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { upsertAttendance } from "@/lib/supabase";
import { AttendanceRecord, Event, Player, RSVP } from "@/lib/types";
import { Check, Loader2, Save, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AttendanceEditorProps {
  event: Event;
  players: Player[];
  initialAttendance: AttendanceRecord[];
  rsvps: RSVP[];
  dict: any;
}

type EditableRecord = Omit<AttendanceRecord, 'id' | 'createdAt'>;

export function AttendanceEditor({ event, players, initialAttendance, rsvps, dict }: AttendanceEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Initialize state from existing records or defaults
  const [records, setRecords] = useState<Record<string, EditableRecord>>(() => {
    const map: Record<string, EditableRecord> = {};
    
    // Default for everyone
    players.forEach(p => {
      map[p.id] = {
        playerId: p.id,
        eventId: event.id,
        isPresent: false,
        isEarly: false,
        isOnTime: false,
        hasDoubleJersey: false,
        notes: ""
      };
    });

    // Overwrite with existing data
    initialAttendance.forEach(a => {
      map[a.playerId] = {
        playerId: a.playerId,
        eventId: a.eventId,
        isPresent: a.isPresent,
        isEarly: a.isEarly,
        isOnTime: a.isOnTime,
        hasDoubleJersey: a.hasDoubleJersey,
        notes: a.notes || ""
      };
    });

    return map;
  });

  const handleToggle = (playerId: string, field: keyof EditableRecord) => {
    setRecords(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: !prev[playerId][field]
      }
    }));
  };

  const handleNoteChange = (playerId: string, value: string) => {
    setRecords(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        notes: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const recordsToSave = Object.values(records);
      await upsertAttendance(recordsToSave);
      toast.success("Attendance saved successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to save attendance: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.nickname?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    // Sort by presence first, then name
    if (records[a.id].isPresent && !records[b.id].isPresent) return -1;
    if (!records[a.id].isPresent && records[b.id].isPresent) return 1;
    return a.name.localeCompare(b.name);
  });

  const stats = {
    present: Object.values(records).filter(r => r.isPresent).length,
    early: Object.values(records).filter(r => r.isEarly).length,
    total: players.length
  };

  const getRSVPStatus = (playerId: string) => {
    const rsvp = rsvps.find(r => r.playerId === playerId);
    if (!rsvp) return null;
    return rsvp.status;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-xl border border-primary/10">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Present</p>
            <p className="text-3xl font-bold text-primary">{stats.present}</p>
          </div>
          <div className="w-px h-10 bg-primary/20" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Early Arrival</p>
            <p className="text-3xl font-bold text-accent">{stats.early}</p>
          </div>
          <div className="w-px h-10 bg-primary/20" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Total Players</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search players..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSave} disabled={loading} className="gap-2 shadow-lg">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Card className="border-primary/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[250px]">Player</TableHead>
              <TableHead className="text-center">RSVP</TableHead>
              <TableHead className="text-center">Present (+1)</TableHead>
              <TableHead className="text-center">Early (+2)</TableHead>
              <TableHead className="text-center">On Time (+1)</TableHead>
              <TableHead className="text-center">Double Jersey (+1)</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlayers.map((player) => {
              const record = records[player.id];
              const rsvp = getRSVPStatus(player.id);
              
              return (
                <TableRow key={player.id} className={record.isPresent ? "bg-primary/5" : ""}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{player.name}</p>
                      {player.nickname && <p className="text-xs text-muted-foreground">"{player.nickname}"</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {rsvp === 'coming' && <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-none">Coming</Badge>}
                    {rsvp === 'maybe' && <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 border-none">Maybe</Badge>}
                    {rsvp === 'not_coming' && <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/10 border-none">No</Badge>}
                    {!rsvp && <span className="text-xs text-muted-foreground opacity-50">-</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Checkbox 
                        checked={record.isPresent} 
                        onCheckedChange={() => handleToggle(player.id, 'isPresent')}
                        className="w-6 h-6 data-[state=checked]:bg-primary"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Checkbox 
                        disabled={!record.isPresent}
                        checked={record.isEarly} 
                        onCheckedChange={() => handleToggle(player.id, 'isEarly')}
                        className="w-6 h-6 data-[state=checked]:bg-accent"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Checkbox 
                        disabled={!record.isPresent}
                        checked={record.isOnTime} 
                        onCheckedChange={() => handleToggle(player.id, 'isOnTime')}
                        className="w-6 h-6 data-[state=checked]:bg-blue-500 border-blue-200"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Checkbox 
                        disabled={!record.isPresent}
                        checked={record.hasDoubleJersey} 
                        onCheckedChange={() => handleToggle(player.id, 'hasDoubleJersey')}
                        className="w-6 h-6 data-[state=checked]:bg-purple-500 border-purple-200"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input 
                      placeholder="Special notes..." 
                      value={record.notes}
                      onChange={(e) => handleNoteChange(player.id, e.target.value)}
                      className="h-8 text-xs bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary/30"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <div className="flex justify-end gap-3">
         <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
         <Button onClick={handleSave} disabled={loading} className="gap-2 px-8">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Confirm & Save Attendance
          </Button>
      </div>
    </div>
  );
}
