interface PersonReference {
  name: string;
  role: string;
  initials: string;
}

export interface ProfileDocument {
  id: string;
  name: string;
  category: string;
  updatedAt: string;
  status: "Signed" | "Current";
  isRestricted: boolean;
}

export interface ProfileRecord {
  name: string;
  preferredName: string;
  legalName: string;
  pronouns: string;
  initials: string;
  avatar: string;
  engagementStatus: "Active";
  jobTitle: string;
  jobLevel: string;
  department: string;
  team: string;
  currentProject: string;
  workEmail: string;
  personalEmail: string;
  workPhone: string;
  workplace: string;
  timeZone: string;
  contractorId: string;
  startDate: string;
  engagementLength: string;
  employmentType: string;
  weeklyHours: string;
  schedule: string;
  contractingEntity: string;
  noticePeriod: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  manager: PersonReference;
  bio: string;
  leavePolicy: string;
  annualLeaveAllowance: string;
  remainingLeave: string;
  carriedOverLeave: string;
  usedLeave: string;
  scheduledLeave: string;
  pendingLeaveRequests: string;
  leaveYear: string;
  nextLeave: string;
  lastWorkingDay: string;
  updatedBy: string;
  updatedAt: string;
  documents: ProfileDocument[];
}

export const profile: ProfileRecord = {
  name: "Junaed Rahman",
  preferredName: "Junaed",
  legalName: "Junaed Rahman",
  pronouns: "He / him",
  initials: "JR",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Junaed",
  engagementStatus: "Active",
  jobTitle: "Administrator",
  jobLevel: "Executive",
  department: "Executive",
  team: "Leadership",
  currentProject: "Financial Freedom Platform",
  workEmail: "junaed@financialfreedom.ca",
  personalEmail: "junaed.rahman@gmail.com",
  workPhone: "+1 (415) 555-0148",
  workplace: "HQ",
  timeZone: "UTC-5:00",
  contractorId: "ADM-1001",
  startDate: "March 18, 2022",
  engagementLength: "4 years, 4 months",
  employmentType: "Full-Time Administrator",
  weeklyHours: "40 hours",
  schedule: "Monday–Friday · 9:00 AM–5:30 PM",
  contractingEntity: "Financial Freedom OS Canada",
  noticePeriod: "30 days",
  dateOfBirth: "September 9, 1993",
  address: "1842 Bay Street, Toronto, ON M5V 2T6",
  emergencyContact: "Emergency Support",
  emergencyPhone: "+1 (416) 555-0177",
  manager: {
    name: "Executive Board",
    role: "Board of Directors",
    initials: "EB",
  },
  bio: "Junaed Rahman is the Administrator and Executive Director leading the Financial Freedom OS platform.",
  leavePolicy: "Executive Leave Allowance",
  annualLeaveAllowance: "25 days",
  remainingLeave: "18 days",
  carriedOverLeave: "0 days",
  usedLeave: "7 days",
  scheduledLeave: "5 days",
  pendingLeaveRequests: "0",
  leaveYear: "January 1–December 31, 2026",
  nextLeave: "August 24–28, 2026",
  lastWorkingDay: "October 3, 2026",
  updatedBy: "Junaed Rahman",
  updatedAt: "August 8, 2026",
  documents: [
    {
      id: "doc-1",
      name: "Contractor agreement",
      category: "Contract",
      updatedAt: "Mar 18, 2022",
      status: "Signed",
      isRestricted: false,
    },
    {
      id: "doc-2",
      name: "Confidentiality agreement",
      category: "Compliance",
      updatedAt: "Mar 18, 2022",
      status: "Signed",
      isRestricted: true,
    },
    {
      id: "doc-4",
      name: "Information security policy acknowledgement",
      category: "Policy",
      updatedAt: "Jan 8, 2026",
      status: "Current",
      isRestricted: false,
    },
  ],
};
