"use client";

import { useState } from "react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { PatientRecord } from "./data";
import { PatientCard } from "./patient-card";
import { PatientDetail } from "./patient-detail";
import { PatientTrends } from "./patient-trends";

interface PatientMonitoringProps {
  patients: PatientRecord[];
}

export function PatientMonitoring({ patients }: PatientMonitoringProps) {
  const [selectedPatientId, setSelectedPatientId] = useState("cardiac-04");
  const [acknowledgedPatientIds, setAcknowledgedPatientIds] = useState<string[]>([]);
  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patients[0] ?? null;
  const acknowledged = selectedPatient ? acknowledgedPatientIds.includes(selectedPatient.id) : false;
  const hasActiveAlarm = selectedPatient?.status === "alarm" && !acknowledged;

  function acknowledgePatient(patientId: string) {
    setAcknowledgedPatientIds((current) => (current.includes(patientId) ? current : [...current, patientId]));
  }

  return (
    <div className="grid min-w-0 flex-1 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <div className="grid grid-cols-2 content-start *:border-border *:border-r *:border-b *:even:border-r-0">
        {patients.map((patient) => (
          <PatientCard
            acknowledged={acknowledgedPatientIds.includes(patient.id)}
            active={selectedPatient ? patient.id === selectedPatient.id : false}
            key={patient.id}
            onSelect={setSelectedPatientId}
            patient={patient}
          />
        ))}
      </div>

      <div className="flex min-w-0 flex-col border-border lg:border-l">
        {!selectedPatient ? (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground text-sm">
            No active patient records. Live telemetry stream ready.
          </div>
        ) : (
          <>
            <div className="flex min-h-11 items-center gap-4 bg-muted/50 px-3">
              <div className="flex items-center gap-3 font-medium">
                <Badge className="rounded-none" variant="outline">
                  {selectedPatient.bed}
                </Badge>
                <span className="text-lg">{selectedPatient.name}</span>
              </div>
              <div className="text-muted-foreground text-sm">
                {selectedPatient.age} {selectedPatient.sex} · {selectedPatient.diagnosis}
              </div>
            </div>
            <Separator />

            {selectedPatient.alarm && (
              <Alert
                className="min-h-9 rounded-none border-x-0 border-t-0 pr-32"
                variant="default"
              >
                <AlertTitle>{selectedPatient.alarm}</AlertTitle>
                {selectedPatient.alarmDuration && (
                  <AlertDescription>
                    Active for {selectedPatient.alarmDuration}
                  </AlertDescription>
                )}
                <AlertAction className="top-1/2 -translate-y-1/2">
                  <Button
                    className="rounded-none"
                    disabled={acknowledged}
                    onClick={() => acknowledgePatient(selectedPatient.id)}
                    size="sm"
                    variant="secondary"
                  >
                    {acknowledged ? "Acknowledged" : "Acknowledge"}
                  </Button>
                </AlertAction>
              </Alert>
            )}

            <PatientDetail hasActiveAlarm={hasActiveAlarm} patient={selectedPatient} />

            <Tabs className="min-h-0 flex-1 gap-0" defaultValue="trends">
              <TabsList
                className="w-full justify-start gap-0 border-b p-0 *:h-full *:max-w-32 *:rounded-none *:border-0 *:border-border *:border-r *:after:-bottom-px!"
                variant="line"
              >
                <TabsTrigger value="real-time">Real time</TabsTrigger>
                <TabsTrigger value="events">Event review</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>
              <TabsContent className="min-h-0" value="real-time">
                <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
                  Real-time telemetry feeds active
                </div>
              </TabsContent>
              <TabsContent className="min-h-0" value="events">
                <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
                  No critical telemetry events logged
                </div>
              </TabsContent>
              <TabsContent className="min-h-0" value="trends">
                <PatientTrends patient={selectedPatient} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
