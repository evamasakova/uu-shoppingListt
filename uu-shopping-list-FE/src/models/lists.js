const port = import.meta.env.VITE_PORT || 3000;
const baseUrl = `http://localhost:${port}`;

const parseJsonSafe = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};
const makeResponse = (res, data) => ({
  status: res.status,
  payload: data ?? null,
  msg: data?.msg ?? null,
  errors: data?.errors ?? null,
});
/**
 *  Creates a new shopping list
 * @param {*} formData
 * @returns created list response
 */

export const fetchLists = async () => {
  try {
    const req = await fetch(`${baseUrl}/shoppingLists`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    const data = await parseJsonSafe(req);
    return makeResponse(req, data);
  } catch (err) {
    return {
      status: 0,
      payload: null,
      msg: null,
      errors: [err.message],
    };
  }
};
export const createList = async (formData) => {
  try {
    const req = await fetch(`${baseUrl}/shoppingLists`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data = await parseJsonSafe(req);
    return makeResponse(req, data);
  } catch (err) {
    return {
      status: 0,
      payload: null,
      msg: null,
      errors: [err.message],
    };
  }
};
export const updateList = async (formData, listID) => {
  try {
    const req = await fetch(
      `${baseUrl}/shoppingLists/${encodeURIComponent(listID)}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(formData),
      }
    );

    const data = await parseJsonSafe(req);
    return makeResponse(req, data);
  } catch (err) {
    return {
      status: 0,
      payload: null,
      msg: null,
      errors: [err.message],
    };
  }
};
/**
 * Deletes a shopping list by ID
 * @param {*} listID
 * @returns
 */
export const deleteList = async (listID) => {
  try {
    const req = await fetch(
      `${baseUrl}/shoppingLists/${encodeURIComponent(listID)}`,
      {
        headers: {
          Accept: "application/json",
        },
        method: "DELETE",
      }
    );

    const data = await parseJsonSafe(req);
    return makeResponse(req, data);
  } catch (err) {
    return {
      status: 0,
      payload: null,
      msg: null,
      errors: [err.message],
    };
  }
};
