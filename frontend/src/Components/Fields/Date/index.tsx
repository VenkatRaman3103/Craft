import React, { useState, useRef, useEffect } from "react";
import { FieldWrapper } from "../FieldWrapper";
import "./index.scss";
import { CalendarDays } from "lucide-react";
import { lightFont } from "@/Styles/base";

export const DateField = ({ data }: { data: field }) => {
    const [date, setDate] = useState(data.value ? new Date(data.value) : null);
    const [isOpen, setIsOpen] = useState(false);
    const calendarRef = useRef(null);

    // Format date to display
    const formatDate = (date) => {
        if (!date) return "Select a date";

        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    };

    // Generate days for the calendar
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // State for current month being viewed
    const [currentMonth, setCurrentMonth] = useState(
        date ? new Date(date) : new Date(),
    );

    // Handle date selection
    const handleDateSelect = (day) => {
        const newDate = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day,
        );
        setDate(newDate);
        setIsOpen(false);

        // If you need to update the field value in your CMS
        // You might want to call an update function here
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

    return (
        <FieldWrapper data={data}>
            <div className="date-picker-container">
                <div
                    className="date-input-field"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {formatDate(date)}
                    <span className="calendar-icon">
                        <CalendarDays size={20} color={lightFont} />
                    </span>
                </div>

                {isOpen && (
                    <div className="calendar-dropdown" ref={calendarRef}>
                        <div className="calendar-header">
                            <button
                                className="month-nav"
                                onClick={handlePrevMonth}
                            >
                                ←
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
                                →
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
        </FieldWrapper>
    );
};
