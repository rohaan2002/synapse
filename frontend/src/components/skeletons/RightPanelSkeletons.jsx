import React from 'react'

const RightPanelSkeletons = () => {
  return (
    <div className="flex  gap-2 w-52 pb-2">
    <div className="flex gap-3 items-center">
      <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
      <div className="flex flex-col gap-4">
        <div className="skeleton h-3 w-16"></div>
        <div className="skeleton h-3 w-24"></div>
      </div>
    </div>
    <div className="skeleton h-7 w-16"></div>
  </div>
  )
}

export default RightPanelSkeletons
