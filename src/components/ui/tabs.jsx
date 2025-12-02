import React, { useState, createContext, useContext } from "react"

// 🔹 Creamos un contexto para compartir el estado entre los componentes
const TabsContext = createContext()

export function Tabs({ defaultValue, children, className }) {
  const [value, setValue] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children }) {
  return <div className="flex gap-2">{children}</div>
}

export function TabsTrigger({ value: tabValue, children }) {
  const { value, setValue } = useContext(TabsContext)
  const isActive = value === tabValue

  return (
    <button
      className={`px-4 py-2 rounded ${
        isActive ? "bg-primary text-white" : "bg-gray-200"
      }`}
      onClick={() => setValue(tabValue)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value: tabValue, children }) {
  const { value } = useContext(TabsContext)
  return value === tabValue ? <div className="mt-4">{children}</div> : null
}