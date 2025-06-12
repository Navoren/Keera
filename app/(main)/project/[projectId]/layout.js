import React, {Suspense} from 'react'
import { BarLoader, SyncLoader } from 'react-spinners'

const LoaderFallback = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <SyncLoader size={15} color="white" />
    </div>
  )
}

const ProjectLayout = async ({children}) => {
  return (
      <div className='mx-auto'>
          <Suspense fallback={ LoaderFallback() }>
          {children}
          </Suspense>
      </div>
  )
}

export default ProjectLayout