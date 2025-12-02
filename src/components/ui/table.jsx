// src/components/ui/table.jsx
import React from "react";

export function Table({ children, className, ...props }) {
  return <table className={`w-full ${className}`} {...props}>{children}</table>;
}

export function TableHeader({ children, className, ...props }) {
  return <thead className={className} {...props}>{children}</thead>;
}

export function TableRow({ children, className, ...props }) {
  return <tr className={className} {...props}>{children}</tr>;
}

export function TableHead({ children, className, ...props }) {
  return <th className={`text-left font-medium ${className}`} {...props}>{children}</th>;
}

export function TableBody({ children, className, ...props }) {
  return <tbody className={className} {...props}>{children}</tbody>;
}

export function TableCell({ children, className, ...props }) {
  return <td className={`py-2 px-4 ${className}`} {...props}>{children}</td>;
}