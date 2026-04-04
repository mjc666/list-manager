'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { List, Item } from '@/types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function setActiveList(id: number) {
  const cookieStore = await cookies();
  cookieStore.set('last_list_id', id.toString(), { maxAge: 60 * 60 * 24 * 30 }); // 30 days
}

export async function getLists(): Promise<List[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM lists ORDER BY created_at DESC');
    return rows as List[];
  } catch (error) {
    console.error('Failed to get lists:', error);
    return [];
  }
}

export async function createList(formData: FormData) {
  const name = formData.get('name')?.toString();
  if (!name || name.trim() === '') return;

  try {
    const [result] = await pool.query<ResultSetHeader>('INSERT INTO lists (name) VALUES (?)', [name.trim()]);
    const newListId = result.insertId;
    await setActiveList(newListId);
    revalidatePath('/');
  } catch (error) {
    console.error('Failed to create list:', error);
  }
}

export async function deleteList(id: number) {
  try {
    await pool.query<ResultSetHeader>('DELETE FROM lists WHERE id = ?', [id]);
    revalidatePath('/');
  } catch (error) {
    console.error('Failed to delete list:', error);
  }
}

export async function getItems(listId: number): Promise<Item[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM items WHERE list_id = ? ORDER BY created_at ASC', [listId]);
    return rows as Item[];
  } catch (error) {
    console.error('Failed to get items:', error);
    return [];
  }
}

export async function createItem(listId: number, formData: FormData) {
  const content = formData.get('content')?.toString();
  if (!content || content.trim() === '') return;

  try {
    await pool.query<ResultSetHeader>('INSERT INTO items (list_id, content) VALUES (?, ?)', [listId, content.trim()]);
    revalidatePath('/');
  } catch (error) {
    console.error('Failed to create item:', error);
  }
}

export async function toggleItemStatus(itemId: number, isCompleted: boolean) {
  try {
    await pool.query<ResultSetHeader>('UPDATE items SET is_completed = ? WHERE id = ?', [isCompleted, itemId]);
    revalidatePath('/');
  } catch (error) {
    console.error('Failed to toggle item status:', error);
  }
}

export async function deleteItem(itemId: number) {
  try {
    await pool.query<ResultSetHeader>('DELETE FROM items WHERE id = ?', [itemId]);
    revalidatePath('/');
  } catch (error) {
    console.error('Failed to delete item:', error);
  }
}