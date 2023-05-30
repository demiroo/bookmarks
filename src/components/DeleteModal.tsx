import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { useBookmarkStore } from "../stores/BookmarkStore"
import { useAuthStore } from "../stores/AuthStore"
import { toast } from "sonner"
import Button from "./Button"

type Props = {
  isModalOpen: boolean
  closeModal: () => void
  bookmark: Bookmark
}

const DeleteModal = ({ isModalOpen, closeModal, bookmark }: Props) => {
  const { delete: deleteBookmark } = useBookmarkStore(state => ({ delete: state.delete }))
  const session = useAuthStore(state => state.session)
  const userId = session?.user.id

  const handleDelete = async (bookmarkId: number) => {
    if (!userId) return
    const response = await deleteBookmark(bookmarkId)
    if (!response.success) return toast.error(response.data)
    toast.success("Bookmark deleted successfully!")
  }

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeModal}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-brightness-50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform rounded-lg bg-slate-200">
                <Dialog.Title as="h3" className="font-medium">Delete Bookmark</Dialog.Title>
                <p className="mt-2 text-sm text-slate-500">{`You are going to delete '${bookmark.title}' bookmark. Are you sure?`}</p>
                <div className="flex gap-2 mt-4 text-slate-200">
                  <Button onClick={() => handleDelete(bookmark.id)}>Yes, delete!</Button>
                  <Button onClick={closeModal} className="bg-transparent text-slate-900 hover:bg-slate-300">No, keep it!</Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default DeleteModal