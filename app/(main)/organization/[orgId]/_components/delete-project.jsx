'use client'

import React, { useEffect, useState } from 'react'
import { useOrganization } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import useFetch from '@/app/hooks/use-fetch'
import { deleteProject } from '@/actions/projects'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

const DeleteProject = ({projectId}) => {
  const { membership } = useOrganization()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const {
    loading: isDeleting,
    error,
    fn: deleteProjectFn,
    data: deleted,
  } = useFetch(deleteProject)

    const isAdmin = membership?.role === 'org:admin'
    
  const handleDelete = async () => {
    try {
      await deleteProjectFn(projectId)
      router.push(`/organization/${membership.organization.id}`)
    } catch (err) {
      console.error('Failed to delete project:', err)
    }
  }

  useEffect(() => {
    if (deleted) {
      router.refresh()
      setOpen(false)
    }
  }, [deleted])

  if (!isAdmin) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2
          title="Delete Project"
          aria-label="Delete this project"
          className={`
            w-5 h-5 cursor-pointer transition-all
            text-red-500 hover:text-red-600 focus:text-red-600
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400
            opacity-100
          `}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this project?</DialogTitle>
          <DialogDescription>
            This action <strong>cannot be undone</strong>. All project data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProject
