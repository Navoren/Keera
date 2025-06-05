import React from 'react'

const Layout = ({children}) => {
  return (
      <div className='flex justify-center items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
          {children}
      </div>
  )
}

export default Layout