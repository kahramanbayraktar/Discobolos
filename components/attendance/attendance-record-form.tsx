"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { upsertAttendance } from "@/lib/supabase";
import { AttendanceRecord, Player } from "@/lib/types";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AttendanceRecordFormProps {
  players: Player[];
  eventId: string;
  initialAttendance?: AttendanceRecord[];
  dict: any;
}

export function AttendanceRecordForm({ players, eventId, initialAttendance, dict }: AttendanceRecordFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = dict.attendance;

  const [records, setRecords] = useState<Record<string, Partial<AttendanceRecord>>>(
    players.reduce((acc, player) => {
      const existing = initialAttendance?.find(a => a.playerId === player.id);
      acc[player.id] = existing || {
        playerId: player.id,
        eventId,
        isPresent: false,
        isEarly: false,
        isOnTime: false,
        hasDoubleJersey: false
      };
      return acc;
    }, {} as Record<string, Partial<AttendanceRecord>>)
  );

  const toggleField = (playerId: string, field: keyof AttendanceRecord) => {
    setRecords(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: !prev[playerId][field]
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const recordsToSave = Object.values(records).map(r => ({
        playerId: r.playerId!,
        eventId: r.eventId!,
        isPresent: r.isPresent || false,
        isEarly: r.isEarly || false,
        isOnTime: r.isOnTime || false,
        hasDoubleJersey: r.hasDoubleJersey || false,
        notes: r.notes
      }));

      await upsertAttendance(recordsToSave);
      toast.success(t.admin.save_success);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t.admin.save_error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">{t.table.player}</TableHead>
              <TableHead className="text-center">{t.table.presence}</TableHead>
              <TableHead className="text-center">{t.table.early}</TableHead>
              <TableHead className="text-center">{t.table.on_time}</TableHead>
              <TableHead className="text-center">{t.table.double_jersey}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map(player => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">
                  {player.name}
                  <span className="text-xs text-muted-foreground ml-2">#{player.number}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox 
                      checked={records[player.id].isPresent} 
                      onCheckedChange={() => toggleField(player.id, "isPresent")}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox 
                      checked={records[player.id].isEarly} 
                      onCheckedChange={() => toggleField(player.id, "isEarly")}
                      disabled={!records[player.id].isPresent}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox 
                      checked={records[player.id].isOnTime} 
                      onCheckedChange={() => toggleField(player.id, "isOnTime")}
                      disabled={!records[player.id].isPresent}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox 
                      checked={records[player.id].hasDoubleJersey} 
                      onCheckedChange={() => toggleField(player.id, "hasDoubleJersey")}
                      disabled={!records[player.id].isPresent}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} size="lg" className="min-w-[150px]">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Kaydet
        </Button>
      </div>
    </div>
  );
}
