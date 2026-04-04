'use client';

import { List } from '@/types';
import Link from 'next/link';
import { createList, deleteList, setActiveList } from '@/app/actions';
import { Plus, Trash2, X, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ lists, activeListId }: { lists: List[]; activeListId?: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 focus:outline-none"
          aria-label="Open Sidebar"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 flex flex-col h-full
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">List Manager</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Lists</h2>
          {lists.map((list) => (
            <div
              key={list.id}
              className={`flex items-center justify-between p-2 rounded-md group hover:bg-gray-100 ${
                activeListId === list.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700'
              }`}
            >
              <Link
                href={`/?listId=${list.id}`}
                className="flex-1 truncate block font-medium"
                onClick={async () => {
                  setIsOpen(false);
                  await setActiveList(list.id);
                }}
              >
                {list.name}
              </Link>
              <form action={deleteList.bind(null, list.id)} className="ml-2">
                <button
                  type="submit"
                  className="text-gray-400 hover:text-red-500 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Delete ${list.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          ))}
          {lists.length === 0 && (
            <p className="text-sm text-gray-500 italic">No lists yet.</p>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <form action={createList} className="flex flex-col gap-2">
            <input
              type="text"
              name="name"
              placeholder="New List Name"
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={255}
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Add List
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}