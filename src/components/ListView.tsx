'use client';

import { List, Item } from '@/types';
import { createItem, toggleItemStatus, deleteItem } from '@/app/actions';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useActionState, useRef } from 'react';

export default function ListView({ list, items }: { list: List; items: Item[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  const pendingItems = items.filter(i => !i.is_completed);
  const completedItems = items.filter(i => i.is_completed);

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 pt-20 md:pt-8 h-full flex flex-col">
      <div className="mb-6 md:mb-8">
        <h2 className="text-3xl font-bold text-gray-900">{list.name}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {items.length} total items • {completedItems.length} completed
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 mb-6">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>This list is empty.</p>
            <p className="text-sm mt-1">Add an item below to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingItems.length > 0 && (
              <div className="space-y-2">
                {pendingItems.map(item => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            )}
            
            {completedItems.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Completed</h3>
                <div className="space-y-2">
                  {completedItems.map(item => (
                    <ItemRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <form
          ref={formRef}
          action={async (formData) => {
            await createItem(list.id, formData);
            formRef.current?.reset();
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            name="content"
            placeholder="Add a new item..."
            className="flex-1 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
            maxLength={1024}
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-md font-medium transition-colors"
          >
            <Plus size={20} className="mr-1" />
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

function ItemRow({ item }: { item: Item }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-md border group transition-colors ${
      item.is_completed ? 'bg-gray-50 border-gray-100 opacity-75' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
    }`}>
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <form action={toggleItemStatus.bind(null, item.id, !item.is_completed)}>
          <button
            type="submit"
            className={`flex-shrink-0 transition-colors ${
              item.is_completed ? 'text-green-500 hover:text-green-600' : 'text-gray-300 hover:text-blue-500'
            }`}
          >
            {item.is_completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>
        </form>
        <span className={`truncate text-lg ${item.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {item.content}
        </span>
      </div>
      <form action={deleteItem.bind(null, item.id)} className="ml-4">
        <button
          type="submit"
          className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors lg:opacity-0 group-hover:opacity-100"
          aria-label="Delete item"
        >
          <Trash2 size={18} />
        </button>
      </form>
    </div>
  );
}