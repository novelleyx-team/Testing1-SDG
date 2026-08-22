"use client";

import React, { useState, useMemo } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle, Clock, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

function getSeededRandom(seed: string) {
  let h = 0;
  for(let i = 0; i < seed.length; i++) 
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export default function LeadershipApprovalsPage() {
  const { user } = useAuthStore();
  const userScope = user?.department || user?.designation || "College";
  const isDean = user?.designation?.includes("Dean") || user?.designation?.includes("Coordinator") || user?.designation?.includes("Head");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Pending");

  const initialRequests = useMemo(() => {
    const rand = getSeededRandom(userScope + "approvals");
    const numRequests = isDean ? 45 : 15;
    
    return Array.from({ length: numRequests }).map((_, i) => {
      const sFirstNames = ["Abhinav", "Rahul", "Priya", "Sneha", "Karthik", "Anjali"];
      const sLastNames = ["Reddy", "Kumar", "Sharma", "Singh", "Patel", "Verma"];
      const studentName = `${sFirstNames[Math.floor(rand() * sFirstNames.length)]} ${sLastNames[Math.floor(rand() * sLastNames.length)]}`;
      const rollNum = `22R11A0${String(Math.floor(rand() * 90) + 10).padStart(2, '0')}`;
      
      const projectTopics = [
        "Smart Agriculture IoT System",
        "Clean Energy Grid Optimization",
        "Accessible Education Platform",
        "Waste Management Analytics",
        "Healthcare Data Blockchain"
      ];
      
      const r = rand();
      const status = r > 0.6 ? "Pending" : r > 0.2 ? "Approved" : "Rejected";

      return {
        id: `REQ${5000 + i}`,
        title: projectTopics[Math.floor(rand() * projectTopics.length)],
        studentName,
        studentId: rollNum,
        department: userScope,
        sdg: `SDG ${Math.floor(rand() * 17) + 1}`,
        status,
        dateSubmitted: new Date(2025, Math.floor(rand() * 12), Math.floor(rand() * 28) + 1).toLocaleDateString(),
        budget: `₹${Math.floor(rand() * 40 + 10) * 1000}`
      };
    });
  }, [userScope, isDean]);

  const [requests, setRequests] = useState(initialRequests);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Approved" } : req));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Rejected" } : req));
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            req.studentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === "All" || req.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, selectedStatus]);

  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const approvedCount = requests.filter(r => r.status === "Approved").length;
  const rejectedCount = requests.filter(r => r.status === "Rejected").length;

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <CheckSquare className="text-blue-600" size={32} />
            Approval Workflow
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Review and manage student project proposals, resource requests, and SDG initiatives in <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{userScope}</span>.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Clock size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Review</p>
              <h3 className="text-2xl font-bold text-slate-900">{pendingCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Approved</p>
              <h3 className="text-2xl font-bold text-slate-900">{approvedCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><XCircle size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Rejected</p>
              <h3 className="text-2xl font-bold text-slate-900">{rejectedCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm border border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">Proposal Queue</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search proposals..."
                  className="pl-9 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="flex h-10 w-full sm:w-40 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-white">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 font-medium">Project Title</th>
                  <th className="px-6 py-4 font-medium">Student / Dept</th>
                  <th className="px-6 py-4 font-medium text-center">SDG</th>
                  <th className="px-6 py-4 font-medium">Req. Budget</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors bg-white">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{req.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Submitted: {req.dateSubmitted}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-700">{req.studentName} <span className="font-mono text-slate-400">({req.studentId})</span></div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          {req.sdg}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {req.budget}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap ${
                          req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                          req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === "Pending" ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => handleApprove(req.id)}>Approve</Button>
                            <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleReject(req.id)}>Reject</Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No requests found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
