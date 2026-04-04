import { getLists, getItems } from './actions';
import Sidebar from '@/components/Sidebar';
import ListView from '@/components/ListView';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ listId?: string }> }) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const lists = await getLists();
  
  // 1. Get listId from URL if present
  let listId: number | undefined;
  if (params.listId) {
    listId = parseInt(params.listId, 10);
  } 
  // 2. Otherwise get from cookie
  else {
    const lastListId = cookieStore.get('last_list_id')?.value;
    if (lastListId) {
      listId = parseInt(lastListId, 10);
    }
  }
  
  // Find selected list and its items
  const selectedList = listId ? lists.find(l => l.id === listId) : lists.length > 0 ? lists[0] : undefined;
  const activeListId = selectedList?.id;
  
  const items = activeListId ? await getItems(activeListId) : [];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar lists={lists} activeListId={activeListId} />
      <main className="flex-1 overflow-y-auto">
        {selectedList ? (
          <ListView list={selectedList} items={items} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            {lists.length === 0 ? 'Create a list to get started.' : 'Select a list.'}
          </div>
        )}
      </main>
    </div>
  );
}