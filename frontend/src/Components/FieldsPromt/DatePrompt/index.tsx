import React, { useState, useEffect, useRef } from "react";
import "./index.scss";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { darkFont, lightFont } from "@/Styles/base";

export const DatePrompt = ({ date, setDate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(
        date ? new Date(date) : new Date(),
    );
    const [dateFormats, setDateFormats] = useState({
        display: "Select a date",
        iso: "",
        short: "",
        medium: "",
        long: "",
    });
    const calendarRef = useRef(null);

    console.log(date, "dateErroCheck");

    // Format dates in various formats
    const formatDates = (date) => {
        if (!date)
            return {
                display: "Select a date",
                iso: "",
                short: "",
                medium: "",
                long: "",
            };

        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();

        // Format as MM/DD/YYYY
        const shortMonth = date.getMonth() + 1;
        const shortFormat = `${shortMonth}/${day}/${year}`;

        // ISO format YYYY-MM-DD
        const isoMonth = (shortMonth < 10 ? "0" : "") + shortMonth;
        const isoDay = (day < 10 ? "0" : "") + day;
        const isoFormat = `${year}-${isoMonth}-${isoDay}`;

        // Medium format: Month DD, YYYY
        const mediumFormat = `${month} ${day}, ${year}`;

        // Long format: Day of week, Month DD, YYYY
        const weekday = date.toLocaleString("default", { weekday: "long" });
        const longFormat = `${weekday}, ${month} ${day}, ${year}`;

        return {
            display: mediumFormat,
            iso: isoFormat,
            short: shortFormat,
            medium: mediumFormat,
            long: longFormat,
        };
    };

    // Update date formats when date changes
    useEffect(() => {
        if (date) {
            setDateFormats(formatDates(date));
        }
    }, [date]);

    // Generate days for the calendar
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Handle date selection
    const handleDateSelect = (day) => {
        const newDate = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day,
        );

        // Set the complete date object and also update formats
        setDate(newDate);
        setDateFormats(formatDates(newDate));
        setIsOpen(false);
    };

    // Navigate between months
    const handlePrevMonth = () => {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1,
            ),
        );
    };

    const handleNextMonth = () => {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1,
            ),
        );
    };

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Render calendar days
    const renderCalendarDays = () => {
        const days = [];
        const daysInMonth = getDaysInMonth(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
        );
        const firstDayOfMonth = getFirstDayOfMonth(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
        );

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`empty-${i}`} className="calendar-day empty"></div>,
            );
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day,
            );
            const isSelected =
                date &&
                date.getDate() === day &&
                date.getMonth() === currentMonth.getMonth() &&
                date.getFullYear() === currentMonth.getFullYear();

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? "selected" : ""}`}
                    onClick={() => handleDateSelect(day)}
                >
                    {day}
                </div>,
            );
        }

        return days;
    };

    console.log(date, "date");

    return (
        <div className="date-picker-container">
            <div
                className="date-input-field"
                onClick={() => setIsOpen(!isOpen)}
            >
                {dateFormats.display}
                <span className="calendar-icon">
                    <CalendarDays size={20} color={lightFont} />
                </span>

                {isOpen && (
                    <div className="calendar-dropdown" ref={calendarRef}>
                        <div className="calendar-header">
                            <button
                                className="month-nav"
                                onClick={handlePrevMonth}
                            >
                                <ChevronLeft size={20} color={lightFont} />
                            </button>
                            <span className="current-month">
                                {currentMonth.toLocaleString("default", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                            <button
                                className="month-nav"
                                onClick={handleNextMonth}
                            >
                                <ChevronRight size={20} color={lightFont} />
                            </button>
                        </div>

                        <div className="calendar-weekdays">
                            {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                            ].map((day) => (
                                <div key={day} className="weekday">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="calendar-days">
                            {renderCalendarDays()}
                        </div>
                    </div>
                )}
            </div>

            {/* {date && ( */}
            {/*     <div className="date-formats-table-container"> */}
            {/*         <table className="date-formats-table"> */}
            {/*             <thead> */}
            {/*                 <tr> */}
            {/*                     <th>Format Type</th> */}
            {/*                     <th>Date Value</th> */}
            {/*                 </tr> */}
            {/*             </thead> */}
            {/*             <tbody> */}
            {/*                 <tr> */}
            {/*                     <td className="format-label">ISO</td> */}
            {/*                     <td className="format-value"> */}
            {/*                         {dateFormats.iso} */}
            {/*                     </td> */}
            {/*                 </tr> */}
            {/*                 <tr> */}
            {/*                     <td className="format-label">Short</td> */}
            {/*                     <td className="format-value"> */}
            {/*                         {dateFormats.short} */}
            {/*                     </td> */}
            {/*                 </tr> */}
            {/*                 <tr> */}
            {/*                     <td className="format-label">Medium</td> */}
            {/*                     <td className="format-value"> */}
            {/*                         {dateFormats.medium} */}
            {/*                     </td> */}
            {/*                 </tr> */}
            {/*                 <tr> */}
            {/*                     <td className="format-label">Long</td> */}
            {/*                     <td className="format-value"> */}
            {/*                         {dateFormats.long} */}
            {/*                     </td> */}
            {/*                 </tr> */}
            {/*             </tbody> */}
            {/*         </table> */}
            {/*     </div> */}
            {/* )} */}
        </div>
    );
};
