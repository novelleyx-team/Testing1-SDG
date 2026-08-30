import { Role } from "./roles";
import { User } from "@/store/auth-store";

export interface PredefinedUser extends User {
  passkey: string;
}

/**
 * Whitelisted Registration IDs
 * ─────────────────────────────
 * Only these IDs can be used to register new accounts on the portal.
 * Each ID is mapped to the role it authorises and the department (if applicable).
 */
export interface RegistrationID {
  id: string;
  allowedRole: Role;
  department?: string;
}

export const VALID_REGISTRATION_IDS: RegistrationID[] = [
  // ── Faculty Registration IDs (20 IDs) ──────────────────────────────
  { id: "FAC-CSE-001", allowedRole: Role.FACULTY, department: "Computer Science" },
  { id: "FAC-CSE-002", allowedRole: Role.FACULTY, department: "Computer Science" },
  { id: "FAC-CSE-003", allowedRole: Role.FACULTY, department: "Computer Science" },
  { id: "FAC-CSD-001", allowedRole: Role.FACULTY, department: "Computer Science Data (CSD)" },
  { id: "FAC-CSD-002", allowedRole: Role.FACULTY, department: "Computer Science Data (CSD)" },
  { id: "FAC-AIML-001", allowedRole: Role.FACULTY, department: "Artificial Intelligence & Machine Learning" },
  { id: "FAC-AIML-002", allowedRole: Role.FACULTY, department: "Artificial Intelligence & Machine Learning" },
  { id: "FAC-MECH-001", allowedRole: Role.FACULTY, department: "Mechanical Engineering" },
  { id: "FAC-MECH-002", allowedRole: Role.FACULTY, department: "Mechanical Engineering" },
  { id: "FAC-CIVIL-001", allowedRole: Role.FACULTY, department: "Civil Engineering" },
  { id: "FAC-CIVIL-002", allowedRole: Role.FACULTY, department: "Civil Engineering" },
  { id: "FAC-ECE-001", allowedRole: Role.FACULTY, department: "Electronics & Communication" },
  { id: "FAC-ECE-002", allowedRole: Role.FACULTY, department: "Electronics & Communication" },
  { id: "FAC-EEE-001", allowedRole: Role.FACULTY, department: "Electrical Engineering" },
  { id: "FAC-EEE-002", allowedRole: Role.FACULTY, department: "Electrical Engineering" },
  { id: "FAC-IT-001", allowedRole: Role.FACULTY, department: "Information Technology" },
  { id: "FAC-IT-002", allowedRole: Role.FACULTY, department: "Information Technology" },
  { id: "FAC-CYS-001", allowedRole: Role.FACULTY, department: "Cyber Security" },
  { id: "FAC-CYS-002", allowedRole: Role.FACULTY, department: "Cyber Security" },
  { id: "FAC-MBA-001", allowedRole: Role.FACULTY, department: "MBA" },

  // ── HOD Registration IDs (10 IDs — one per department) ─────────────
  { id: "HOD-CSE-001", allowedRole: Role.HOD, department: "Computer Science" },
  { id: "HOD-CSD-001", allowedRole: Role.HOD, department: "Computer Science Data (CSD)" },
  { id: "HOD-AIML-001", allowedRole: Role.HOD, department: "Artificial Intelligence & Machine Learning" },
  { id: "HOD-MECH-001", allowedRole: Role.HOD, department: "Mechanical Engineering" },
  { id: "HOD-CIVIL-001", allowedRole: Role.HOD, department: "Civil Engineering" },
  { id: "HOD-ECE-001", allowedRole: Role.HOD, department: "Electronics & Communication" },
  { id: "HOD-EEE-001", allowedRole: Role.HOD, department: "Electrical Engineering" },
  { id: "HOD-IT-001", allowedRole: Role.HOD, department: "Information Technology" },
  { id: "HOD-CYS-001", allowedRole: Role.HOD, department: "Cyber Security" },
  { id: "HOD-MBA-001", allowedRole: Role.HOD, department: "MBA" },

  // ── Dean Registration IDs (7 IDs) ──────────────────────────────────
  { id: "DEAN-ACAD-001", allowedRole: Role.DEAN },
  { id: "DEAN-RND-001", allowedRole: Role.DEAN },
  { id: "DEAN-IQAC-001", allowedRole: Role.DEAN },
  { id: "DEAN-SA-001", allowedRole: Role.DEAN },
  { id: "DEAN-PLACE-001", allowedRole: Role.DEAN },
  { id: "DEAN-IIC-001", allowedRole: Role.DEAN },
  { id: "DEAN-CLUBS-001", allowedRole: Role.DEAN },
];

export const PREDEFINED_USERS: PredefinedUser[] = [
  // Super Administrators (8 Accounts)
  {
    id: "ADMIN_01",
    name: "ADMIN",
    role: Role.ADMIN,
    email: "admin1@mlritm.ac.in",
    designation: "Super Administrator",
    passkey: "W#qKpRzT",
  },
  {
    id: "ADMIN_02",
    name: "ADMIN",
    role: Role.ADMIN,
    email: "admin2@mlritm.ac.in",
    designation: "Super Administrator",
    passkey: "B@mJxNcY",
  },
  {
    id: "ADMIN_03",
    name: "ADMIN",
    role: Role.ADMIN,
    email: "admin3@mlritm.ac.in",
    designation: "Super Administrator",
    passkey: "L$vHgFsD",
  },
  {
    id: "ADMIN_04",
    name: "ADMIN",
    role: Role.ADMIN,
    email: "admin4@mlritm.ac.in",
    designation: "Super Administrator",
    passkey: "K*cMwXqP",
  },
  {
    id: "ADMIN_05",
    name: "ADMIN",
    role: Role.ADMIN,
    email: "admin5@mlritm.ac.in",
    designation: "Super Administrator",
    passkey: "T&pRjNbV",
  },
  {
    id: "ADMIN_06",
    name: "ADMIN",
    role: Role.ADMIN,
    email: "admin6@mlritm.ac.in",
    designation: "Super Administrator",
    passkey: "F#xZcMgK",
  },
  {
    id: "ADMIN_07",
    name: "ADMIN",
    role: Role.ADMIN,
    email: "admin7@mlritm.ac.in",
    designation: "Super Administrator",
    passkey: "H@dSvXyL",
  },
  {
    id: "ADMIN_08",
    name: "ADMIN",
    role: Role.ADMIN,
    email: "admin8@mlritm.ac.in",
    designation: "Super Administrator",
    passkey: "R$nJpTcW",
  },

  // Deans (7 Accounts)
  {
    id: "MLRS10005",
    name: "DR. B RAVI PRASAD",
    role: Role.DEAN,
    email: "mlrs10005@mlritm.ac.in",
    designation: "Academic Dean",
    passkey: "C#mPrXtY",
  },
  {
    id: "MLRS10255",
    name: "DR. G NARSINGA RAO",
    role: Role.DEAN,
    email: "mlrs10255@mlritm.ac.in",
    designation: "Dean of Research & Development (R&D)",
    passkey: "D@kXcVbN",
  },
  {
    id: "MLRS10320",
    name: "DR. K CHAITANYA",
    role: Role.DEAN,
    email: "mlrs10320@mlritm.ac.in",
    designation: "IQAC Coordinator",
    passkey: "P$jLnWxM",
  },
  {
    id: "MLRS10158",
    name: "MR. Y APPARAO",
    role: Role.DEAN,
    email: "mlrs10158@mlritm.ac.in",
    designation: "Dean of Student Affairs",
    passkey: "M*hBzXcL",
  },
  {
    id: "MLRS10415",
    name: "MS. PARUCHURI ILA CHANDANA KUMARI",
    role: Role.DEAN,
    email: "mlrs10415@mlritm.ac.in",
    designation: "Placement Head",
    passkey: "Y&tNwKqP",
  },
  {
    id: "MLRS10327",
    name: "DR. S P JANI",
    role: Role.DEAN,
    email: "mlrs10327@mlritm.ac.in",
    designation: "Institution Innovation Council (IIC)",
    passkey: "V#dFsGpH",
  },
  {
    id: "MLRS10323",
    name: "DR. K SRAVANTHI",
    role: Role.DEAN,
    email: "mlrs10323@mlritm.ac.in",
    designation: "Student Clubs Coordinator",
    passkey: "J@rNxBcM",
  },

  // Heads of Departments (10 Accounts)
  {
    id: "MLRS10319",
    name: "DR. U. SUDHAKAR",
    role: Role.HOD,
    email: "mlrs10319@mlritm.ac.in",
    designation: "HOD",
    department: "Mechanical Engineering",
    passkey: "S$kLmXpQ",
  },
  {
    id: "MLRS10003",
    name: "DR. K. ABDUL BASITH",
    role: Role.HOD,
    email: "mlrs10003@mlritm.ac.in",
    designation: "HOD",
    department: "Computer Science",
    passkey: "W*pNzXcL",
  },
  {
    id: "MLRS10154",
    name: "DR. A ARUN KUMAR",
    role: Role.HOD,
    email: "mlrs10154@mlritm.ac.in",
    designation: "HOD",
    department: "Computer Science Data (CSD)",
    passkey: "Q&tFbVjM",
  },
  {
    id: "MLRS10130",
    name: "DR. M VENKAT REDDY",
    role: Role.HOD,
    email: "mlrs10130@mlritm.ac.in",
    designation: "HOD",
    department: "Cyber Security",
    passkey: "Z#dMgHrP",
  },
  {
    id: "MLRS10008",
    name: "DR. M NAGALAKSHMI",
    role: Role.HOD,
    email: "mlrs10008@mlritm.ac.in",
    designation: "HOD",
    department: "Information Technology",
    passkey: "X@cNbVjK",
  },
  {
    id: "MLRS10005-HOD",
    name: "DR. B RAVI PRASAD",
    role: Role.HOD,
    email: "mlrs10005.hod@mlritm.ac.in",
    designation: "HOD",
    department: "Artificial Intelligence & Machine Learning",
    passkey: "N$vFwZcL",
  },
  {
    id: "MLRS10181",
    name: "DR. N. SRINIVAS",
    role: Role.HOD,
    email: "mlrs10181@mlritm.ac.in",
    designation: "HOD",
    department: "Electronics & Communication",
    passkey: "L*kHjGfM",
  },
  {
    id: "MLRS10220",
    name: "DR. A. VINOD",
    role: Role.HOD,
    email: "mlrs10220@mlritm.ac.in",
    designation: "HOD",
    department: "Electrical Engineering",
    passkey: "K&pDcSxZ",
  },
  {
    id: "MLRS10011",
    name: "DR. K MURALI",
    role: Role.HOD,
    email: "mlrs10011@mlritm.ac.in",
    designation: "HOD",
    department: "Civil Engineering",
    passkey: "G#tRwQyP",
  },
  {
    id: "MLRS10269",
    name: "DR. K. VEERAIAH",
    role: Role.HOD,
    email: "mlrs10269@mlritm.ac.in",
    designation: "HOD",
    department: "MBA",
    passkey: "F@mJzNxV",
  },
];
