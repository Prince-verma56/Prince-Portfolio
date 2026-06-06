"use client";

import { motion, useReducedMotion } from "framer-motion";
import type React from "react";
import { useMemo, useState } from "react";

export interface ContributionData {
  count: number;
  date: string;
  level: number;
}

export interface ContributionGraphProps {
  className?: string;
  data?: ContributionData[];
  showLegend?: boolean;
  showTooltips?: boolean;
  year?: number;
}

const WEEKS_IN_YEAR = 53;
const DAYS_IN_WEEK = 7;
const JANUARY_MONTH = 0;
const DECEMBER_MONTH = 11;
const SUNDAY_DAY = 0;
const MIN_WEEKS_FOR_DECEMBER_HEADER = 2;
const TOOLTIP_OFFSET_X = 10;
const TOOLTIP_OFFSET_Y = 40;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CONTRIBUTION_COLORS = [
  "bg-[#161b22]", 
  "bg-[#0e4429]", 
  "bg-[#006d32]", 
  "bg-[#26a641]", 
  "bg-[#39d353]", 
];

const LEVEL_0 = 0;
const LEVEL_1 = 1;
const LEVEL_2 = 2;
const LEVEL_3 = 3;
const LEVEL_4 = 4;
const CONTRIBUTION_LEVELS = [LEVEL_0, LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4];
const DAY_1 = 1;
const DAY_31 = 31;

const isDateInValidRange = (currentDate: Date, startDate: Date, endDate: Date, targetYear: number) => {
  const isInRange = currentDate >= startDate && currentDate <= endDate;
  const isPreviousYearDecember = currentDate.getFullYear() === targetYear - 1 && currentDate.getMonth() === DECEMBER_MONTH;
  const isNextYearJanuary = currentDate.getFullYear() === targetYear + 1 && currentDate.getMonth() === JANUARY_MONTH;
  return isInRange || isPreviousYearDecember || isNextYearJanuary;
};

const createDayData = (currentDate: Date, contributionData: ContributionData[]): ContributionData => {
  const dateString = currentDate.toISOString().split("T")[0];
  const existingData = contributionData.find((d) => d.date === dateString);
  return {
    date: dateString,
    count: existingData?.count ?? LEVEL_0,
    level: existingData?.level ?? LEVEL_0,
  };
};

interface MonthHeaderCheck {
  currentMonth: number;
  currentYear: number;
  startDateDay: number;
  targetYear: number;
  weekCount: number;
}

const shouldShowMonthHeader = ({ currentYear, targetYear, currentMonth, startDateDay, weekCount }: MonthHeaderCheck) =>
  currentYear === targetYear ||
  (currentYear === targetYear - 1 && currentMonth === DECEMBER_MONTH && startDateDay !== SUNDAY_DAY && weekCount >= MIN_WEEKS_FOR_DECEMBER_HEADER);

const calculateMonthHeaders = (targetYear: number) => {
  const headers: { month: string; colspan: number; startWeek: number }[] = [];
  const startDate = new Date(targetYear, JANUARY_MONTH, DAY_1);
  const firstSunday = new Date(startDate);
  firstSunday.setDate(startDate.getDate() - startDate.getDay());

  let currentMonth = -1;
  let currentYear = -1;
  let monthStartWeek = 0;
  let weekCount = 0;

  for (let weekNumber = 0; weekNumber < WEEKS_IN_YEAR; weekNumber++) {
    const weekDate = new Date(firstSunday);
    weekDate.setDate(firstSunday.getDate() + weekNumber * DAYS_IN_WEEK);

    const monthKey = weekDate.getMonth();
    const yearKey = weekDate.getFullYear();

    if (monthKey !== currentMonth || yearKey !== currentYear) {
      if (currentMonth !== -1 && shouldShowMonthHeader({ currentYear, targetYear, currentMonth, startDateDay: startDate.getDay(), weekCount })) {
        headers.push({ month: MONTHS[currentMonth], colspan: weekCount, startWeek: monthStartWeek });
      }
      currentMonth = monthKey;
      currentYear = yearKey;
      monthStartWeek = weekNumber;
      weekCount = 1;
    } else {
      weekCount++;
    }
  }

  if (currentMonth !== -1 && shouldShowMonthHeader({ currentYear, targetYear, currentMonth, startDateDay: startDate.getDay(), weekCount })) {
    headers.push({ month: MONTHS[currentMonth], colspan: weekCount, startWeek: monthStartWeek });
  }

  return headers;
};

export function ContributionGraph({ data = [], year = new Date().getFullYear(), className = "", showLegend = true, showTooltips = true }: ContributionGraphProps) {
  const [hoveredDay, setHoveredDay] = useState<ContributionData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const yearData = useMemo(() => {
    const startDate = new Date(year, JANUARY_MONTH, DAY_1);
    const endDate = new Date(year, DECEMBER_MONTH, DAY_31);
    const days: ContributionData[] = [];

    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());

    for (let weekNum = 0; weekNum < WEEKS_IN_YEAR; weekNum++) {
      for (let day = 0; day < DAYS_IN_WEEK; day++) {
        const currentDate = new Date(firstSunday);
        currentDate.setDate(firstSunday.getDate() + weekNum * DAYS_IN_WEEK + day);

        if (isDateInValidRange(currentDate, startDate, endDate, year)) {
          days.push(createDayData(currentDate, data));
        } else {
          days.push({ date: "", count: LEVEL_0, level: LEVEL_0 });
        }
      }
    }
    return days;
  }, [data, year]);

  const monthHeaders = useMemo(() => calculateMonthHeaders(year), [year]);

  const handleDayHover = (day: ContributionData, event: React.MouseEvent) => {
    if (showTooltips && day.date) {
      setHoveredDay(day);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleDayLeave = () => setHoveredDay(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const getContributionText = (count: number) => {
    if (count === LEVEL_0) return "No contributions";
    if (count === LEVEL_1) return "1 contribution";
    return `${count} contributions`;
  };

  return (
    <div className={`contribution-graph flex flex-col w-full ${className}`}>
      
      {/* ── CUSTOM HORIZONTAL SCROLLBAR CONTAINER ── */}
      <div className="w-full overflow-x-auto pb-6 pt-2 pr-4
        [&::-webkit-scrollbar]:h-2.5 
        [&::-webkit-scrollbar-track]:rounded-full 
        [&::-webkit-scrollbar-track]:bg-white/5 
        [&::-webkit-scrollbar-thumb]:rounded-full 
        [&::-webkit-scrollbar-thumb]:bg-white/20 
        hover:[&::-webkit-scrollbar-thumb]:bg-white/40 
        transition-all"
      >
        <table className="border-separate border-spacing-[3px] text-xs w-max">
          <caption className="sr-only">Contribution Graph for {year}</caption>

          <thead>
            <tr className="h-3">
              <td className="w-8 min-w-[32px]" />
              {monthHeaders.map((header) => (
                <td className="relative text-left text-white/50 font-medium" colSpan={header.colspan} key={`${header.month}-${header.startWeek}`}>
                  <span className="absolute top-0 left-1 text-[10px] md:text-xs">{header.month}</span>
                </td>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: DAYS_IN_WEEK }, (_, dayIndex) => (
              <tr className="h-[12px] md:h-[14px]" key={DAYS[dayIndex]}>
                <td className="relative w-8 min-w-[32px] text-white/50 font-medium pr-2">
                  {dayIndex % 2 === 0 && (
                    <span className="absolute -bottom-0.5 left-0 text-[9px] md:text-[10px]">
                      {DAYS[dayIndex]}
                    </span>
                  )}
                </td>

                {Array.from({ length: WEEKS_IN_YEAR }, (_, w) => {
                  const dayData = yearData[w * DAYS_IN_WEEK + dayIndex];
                  const cellKey = `${dayData?.date ?? "empty"}-${w}-${dayIndex}`;
                  if (!dayData?.date) {
                    return (
                      <td className="h-[12px] w-[12px] md:h-[14px] md:w-[14px] p-0" key={cellKey}>
                        <div className="h-[12px] w-[12px] md:h-[14px] md:w-[14px]" />
                      </td>
                    );
                  }

                  return (
                    <td className="h-[12px] w-[12px] md:h-[14px] md:w-[14px] cursor-pointer p-0" key={cellKey} onMouseEnter={(e) => handleDayHover(dayData, e)} onMouseLeave={handleDayLeave}>
                      <div
                        className={`h-[12px] w-[12px] md:h-[14px] md:w-[14px] rounded-sm transition-all duration-300 ${
                          CONTRIBUTION_COLORS[dayData.level]
                        } hover:ring-1 hover:ring-white hover:scale-110`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showTooltips && hoveredDay && (
        <motion.div
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          className="pointer-events-none fixed z-[100] rounded-lg border border-white/10 bg-[#0a0a0a] px-3 py-2 text-white text-sm shadow-xl backdrop-blur-md"
          exit={shouldReduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.8 }}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
          style={{ left: tooltipPosition.x + TOOLTIP_OFFSET_X, top: tooltipPosition.y - TOOLTIP_OFFSET_Y }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
        >
          <div className="font-bold text-[#f04e00]">{getContributionText(hoveredDay.count)}</div>
          <div className="text-white/60 text-xs mt-1 font-mono">{formatDate(hoveredDay.date)}</div>
        </motion.div>
      )}

      {showLegend && (
        <div className="mt-2 flex items-center justify-end gap-2 text-white/50 text-[10px] uppercase tracking-widest font-mono">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {CONTRIBUTION_LEVELS.map((level) => (
              <div className={`h-[10px] w-[10px] rounded-sm ${CONTRIBUTION_COLORS[level]}`} key={level} />
            ))}
          </div>
          <span>More</span>
        </div>
      )}
    </div>
  );
}

export default ContributionGraph;