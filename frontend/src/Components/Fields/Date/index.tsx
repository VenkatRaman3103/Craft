import React, { useState, useRef, useEffect } from "react";
import { FieldWrapper } from "../FieldWrapper";
import "./index.scss";
import { CalendarDays } from "lucide-react";
import { lightFont } from "@/Styles/base";

export const DateField = ({ data }: { data: field }) => {
    const [date, setDate] = useState(
        data?.value ? new Date(data?.value) : null,
    );
    const [isOpen, setIsOpen] = useState(false);
    const calendarRef = useRef(null);

    console.log(date, "date");

    useEffect(() => {
        setDate(data.value ? new Date(data.value) : null);
    }, [data.value]);

    const formatDate = (date) => {
        if (!date) return "Select a date";

        if (!(date instanceof Date)) return "Select a date";

        if (isNaN(date.getTime())) return "Select a date";

        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const [currentMonth, setCurrentMonth] = useState(
        date && date instanceof Date ? new Date(date) : new Date(),
    );

    const handleDateSelect = (day) => {
        const newDate = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day,
        );
        setDate(newDate);
        setIsOpen(false);
    };

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1,
            ),
        );
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1,
            ),
        );
    };

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

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`empty-${i}`} className="calendar-day empty"></div>,
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day,
            );
            const isSelected =
                date instanceof Date &&
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
                        <button className="month-nav" onClick={handlePrevMonth}>
                            ←
                        </button>
                        <span className="current-month">
                            {currentMonth.toLocaleString("default", {
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                        <button className="month-nav" onClick={handleNextMonth}>
                            →
                        </button>
                    </div>

                    <div className="calendar-weekdays">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <div key={day} className="weekday">
                                    {day}
                                </div>
                            ),
                        )}
                    </div>

                    <div className="calendar-days">{renderCalendarDays()}</div>
                </div>
            )}
        </div>
    );
};
