import { API_BASE_URL } from './constants.js';

export async function fetchBrands(pageSize = 12, pageNumber = 1) {
  const url = `${API_BASE_URL}/random?pageSize=${pageSize}&pageNumber=${pageNumber}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Ошибка загрузки данных');
  const data = await res.json();
  return data.data || [];
}