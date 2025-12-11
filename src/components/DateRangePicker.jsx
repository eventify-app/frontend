
const DateRangePicker = ({ fromDate, toDate, setFromDate, setToDate }) => {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="date"
        value={fromDate || ""}
        onChange={(e) => setFromDate(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <span className="text-muted-foreground">a</span>
      <input
        type="date"
        value={toDate || ""}
        onChange={(e) => setToDate(e.target.value)}
        className="border rounded px-2 py-1"
      />
    </div>
  );
};

export default DateRangePicker;
