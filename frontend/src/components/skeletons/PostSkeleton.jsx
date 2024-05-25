import React from 'react'

const PostSkeleton = () => {
  return (
<div className="flex flex-col gap-4 full m-4">
    <div className='flex'>
  <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
  <div className='px-4'>
  <div className="skeleton h-6 w-96"></div>
  <br/>
  <div className="skeleton h-6 w-60"></div>
  </div>
        
    </div>
  
  <div className="skeleton h-40 w-full"></div>
  {/* <div className="skeleton h-4 w-28"></div> */}
</div>
  )
}

export default PostSkeleton
