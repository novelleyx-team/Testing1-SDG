"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Search, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

interface Department {
  id: number;
  name: string;
}

interface DepartmentSelectProps {
  value?: number;
  onChange?: (departmentId: number, departmentName: string) => void;
  className?: string;
  disabled?: boolean;
}

export function DepartmentSelect({
  value,
  onChange,
  className,
  disabled = false,
}: DepartmentSelectProps) {
  const { user } = useAuthStore();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine if the current value is auto-selected from the user's profile
  const isAutoSelected = user?.departmentId === value && !!value;

  useEffect(() => {
    let isMounted = true;
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setDepartments(data.departments || []);
            
            // Auto-select logic if no value provided but user has a department
            if (!value && user?.departmentId) {
              const userDept = data.departments.find((d: Department) => d.id === user.departmentId);
              if (userDept && onChange) {
                onChange(userDept.id, userDept.name);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch departments", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDepartments();
    return () => { isMounted = false; };
  }, [user, value, onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDepartment = departments.find((d) => d.id === value);
  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input type="hidden" name="departmentId" value={value || ""} />
      <input type="hidden" name="department" value={selectedDepartment?.name || ""} />
      <input type="hidden" name="branch" value={selectedDepartment?.name || ""} />
      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled={disabled || isLoading}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            className
          )}
        >
          <span className="truncate">
            {isLoading
              ? "Loading departments..."
              : selectedDepartment
              ? selectedDepartment.name
              : "Select your Department"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
        </button>

        {isAutoSelected && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1 pl-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Auto-selected from your profile</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2937] shadow-lg outline-none animate-in fade-in zoom-in-95">
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100"
              placeholder="Search department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredDepartments.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                Department information could not be verified. Please select your department.
              </div>
            ) : (
              filteredDepartments.map((dept) => (
                <div
                  key={dept.id}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 focus:bg-gray-100 focus:text-gray-900 cursor-pointer transition-colors",
                    value === dept.id && "bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100 font-medium"
                  )}
                  onClick={() => {
                    onChange?.(dept.id, dept.name);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {value === dept.id && <Check className="h-4 w-4" />}
                  </span>
                  {dept.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
