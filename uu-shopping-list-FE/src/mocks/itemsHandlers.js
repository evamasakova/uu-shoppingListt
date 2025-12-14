import { http, HttpResponse } from 'msw';

// In-memory store to replace JSON Server
let items = [];

/**
 * Utility: match query params like ?listId=123
 */
function filterByListId(url) {
  const listId = url.searchParams.get('listId');
  return listId ? items.filter(item => String(item.listId) === String(listId)) : items;
}

export const itemsHandlers = [
  /**
   * GET /items?listId=123
   */
  http.get('/items', ({ request }) => {
    const result = filterByListId(new URL(request.url));
    return HttpResponse.json(result, { status: 200 });
  }),

  /**
   * POST /items
   */
  http.post('/items', async ({ request }) => {
    const newItem = await request.json();

    newItem.id = Date.now(); // auto-ID like JSON Server
    newItem.createdAt = new Date().toISOString();
    newItem.updatedAt = newItem.createdAt;

    items.push(newItem);

    return HttpResponse.json(newItem, { status: 201 });
  }),

  /**
   * PATCH /items/:id
   */
  http.patch('/items/:id', async ({ params, request }) => {
    const updates = await request.json();
    let updatedItem = null;

    items = items.map(item => {
      if (String(item.id) === String(params.id)) {
        updatedItem = { ...item, ...updates, updatedAt: new Date().toISOString() };
        return updatedItem;
      }
      return item;
    });

    if (!updatedItem) {
      return HttpResponse.json({ msg: 'Item not found' }, { status: 404 });
    }

    return HttpResponse.json(updatedItem, { status: 200 });
  }),

  /**
   * DELETE /items/:id
   */
  http.delete('/items/:id', ({ params }) => {
    const id = String(params.id);
    const before = items.length;

    items = items.filter(item => String(item.id) !== id);

    if (items.length === before) {
      return HttpResponse.json({ msg: 'Item not found' }, { status: 404 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
