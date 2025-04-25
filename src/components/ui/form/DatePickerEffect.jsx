"use client";
import React, { useState, useRef, useEffect } from "react";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";
import { Calendar } from "lucide-react";
import { cn, formatDate, parseDate } from "../../../lib/utils";


export function DatePickerWithEffect({
  value,
  onChange,
  label = "Date",
  id,
  name,
  className,
  isRequired = false,
  placeholder = "Select date",
  variant = "bordered",
  labelPlacement = "outside",
  showMonthAndYearPickers = false,
  disablePreviousDates = false,
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [selectedDate, setSelectedDate] = useState(parseDate(value || ""));
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  // Motion animation values
  const radius = 100;
  const [visible, setVisible] = useState(false);
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  // Handle outside clicks to close calendar
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update local state when external value changes
  useEffect(() => {
    if (value) {
      setInputValue(value);
      setSelectedDate(parseDate(value));
    }
  }, [value]);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY
  }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleInputChange(e) {
    const newValue = e.target.value;
    console.log(newValue);
    setInputValue(newValue);
    
    const newDate = parseDate(newValue);
    console.log(newDate);
    if (newDate) {
      setSelectedDate(newDate);
      setCurrentMonth(newDate);
      if (onChange) onChange(newValue);
    }
  }

  function handleDateSelect(date) {
    const formattedDate = formatDate(date);
    setSelectedDate(date);
    setInputValue(formattedDate);
    setShowCalendar(false);
    if (onChange) onChange(formattedDate);
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function goToPreviousMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  }

  function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = today.getTime() === date.getTime();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isDisabled = disablePreviousDates ? date < today : false;
      // const isDisabled = disablePreviousDates ? date < today : true;
      
      days.push(
        <button
          key={`day-${day}`}
          type="button"
          onClick={() => !isDisabled && handleDateSelect(date)}
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center text-sm transition-colors",
            isToday && "font-medium text-blue-500 border border-blue-200",
            isSelected && "bg-blue-500 text-white hover:bg-blue-600",
            !isSelected && !isToday && "hover:bg-gray-200 dark:hover:bg-zinc-700",
            isDisabled && "text-gray-300 dark:text-zinc-600 cursor-not-allowed hover:bg-transparent"
          )}
          disabled={isDisabled}
        >
          {day}
        </button>
      );
    }
    
    return days;
  }

  function renderMonthYearPickers() {
    if (!showMonthAndYearPickers) return null;
    
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year <= currentYear + 10; year++) {
      years.push(year);
    }
    
    return (
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex gap-2">
          <select
            value={currentMonth.getMonth()}
            onChange={(e) => setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value), 1))}
            className="flex-1 py-1 px-2 rounded-md bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          
          <select
            value={currentMonth.getFullYear()}
            onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth(), 1))}
            className="flex-1 py-1 px-2 rounded-md bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* {labelPlacement === "outside" && label && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )} */}
      
      <div className="relative">
        <motion.div
          style={{
            background: useMotionTemplate`
              radial-gradient(
                ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
                #3b82f6,
                transparent 80%
              )
            `,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className="group/input rounded-lg p-[2px] transition duration-300"
        >
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="date"
              id={id}
              name={name}
              value={inputValue}
              onChange={handleInputChange}
              onClick={() => setShowCalendar(true)}
              required={isRequired}
              min={formatDate(new Date())}
              className={cn(
                "shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-gray-50",
                "px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "placeholder:text-neutral-200 focus-visible:ring-[2px] focus-visible:ring-neutral-400",
                "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                "dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600",
                "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:bottom-0 [&::-webkit-calendar-picker-indicator]:top-0"
              )}
            />
            
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="absolute right-3 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <Calendar size={16} />
            </button>
          </div>
        </motion.div>
        
        {showCalendar && (
          <div
            ref={calendarRef}
            className="absolute z-50 mt-1 w-full max-w-[320px] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
              >
                <span className="sr-only">Previous month</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="text-sm font-medium">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
              >
                <span className="sr-only">Next month</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {renderMonthYearPickers()}
            
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="h-9 w-9 flex items-center justify-center text-xs text-neutral-500">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
            
            <div className="mt-3 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  handleDateSelect(today);
                }}
                className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Today
              </button>
              
              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}