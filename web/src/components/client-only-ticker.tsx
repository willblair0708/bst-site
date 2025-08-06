"use client"

import { useState, useEffect } from 'react'
// import TimeToCureTicker from './time-to-cure-ticker'

const ClientOnlyTicker: React.FC = () => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <></>/* {isClient && <TimeToCureTicker />} */
}

export default ClientOnlyTicker