"use client";

import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function BirthdayCalendarInput({
  label = "Fecha de nacimiento",
  value,
  onChange,
  minDate = new Date(1900, 0, 1),     // Opcional
  maxDate = new Date(),               // Hasta hoy por defecto
}) {

  const [open, setOpen] = useState(false);

  // Convertir "2025-01-20" → Date sin UTC
  const parseLocalDate = (value) => {
    if (!value) return null;
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  // Convertir Date → "YYYY-MM-DD"
  const formatDate = (date) =>
    date ? date.toLocaleDateString("en-CA") : "";

  const [date, setDate] = useState(value ? parseLocalDate(value) : null);

  // Si el padre cambia el valor → sincronizamos
  useEffect(() => {
    setDate(value ? parseLocalDate(value) : null);
  }, [value]);

  const handleSelect = (d) => {
    setDate(d);

    if (onChange) {
      onChange(formatDate(d));
    }

    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <Label className="px-1">{label}</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-48 justify-between w-full font-normal"
          >
            {date ? date.toLocaleDateString() : "Seleccionar fecha"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleSelect}
            fromMonth={minDate}
            toMonth={maxDate}
            disabled={(d) => d > maxDate || d < minDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
