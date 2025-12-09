"use client"

import React, { useState, useEffect } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function CalendarInput({ dateValue, timeValue, onChange }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(dateValue ? new Date(dateValue) : null)
  const [time, setTime] = useState(timeValue || "")

  // 🔄 SINCRONIZAR FECHA SI CAMBIA DESDE EL PADRE
  useEffect(() => {
    setDate(dateValue ? new Date(dateValue) : null)
  }, [dateValue])

  // 🔄 SINCRONIZAR HORA SI CAMBIA DESDE EL PADRE
  useEffect(() => {
    setTime(timeValue || "")
  }, [timeValue])

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    if (onChange) {
      onChange({
        date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
        time,
      })
    }
    setOpen(false)
  }

  const handleTimeChange = (e) => {
    const newTime = e.target.value.split(":").slice(0, 2).join(":")
    setTime(newTime)
    if (onChange) {
      onChange({
        date: date ? date.toISOString().split("T")[0] : "",
        time: newTime,
      })
    }
  }

  const today = new Date()
  const maxDate = new Date(today.getFullYear() + 10, 11, 31)

  return (
    <div className="flex gap-4">
      {/* Fecha */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="date-picker" className="px-1">Fecha</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-40 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Seleccionar fecha"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
              disabled={(d) => d < today}
              fromMonth={today}
              toMonth={maxDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Hora */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="time-picker" className="px-1">Hora</Label>
        <Input
          type="time"
          id="time-picker"
          step="60"
          value={time}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
