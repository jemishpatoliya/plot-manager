const DB_NAME = 'plotperfect-db';
const DB_VERSION = 1;
const STORE_NAME = 'images';

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const withStore = async <T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>) => {
  const db = await openDb();

  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const req = fn(store);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);

    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      reject(tx.error);
      db.close();
    };
  });
};

export const putImageBlob = (key: string, blob: Blob) => withStore('readwrite', (s) => s.put(blob, key)).then(() => undefined);

export const getImageBlob = (key: string) => withStore<Blob | undefined>('readonly', (s) => s.get(key));

export const deleteImageBlob = (key: string) => withStore('readwrite', (s) => s.delete(key)).then(() => undefined);

export const storeFileImage = async (file: File, key: string) => {
  await putImageBlob(key, file);
  return `idb:${key}`;
};

export const storeDataUrlImage = async (dataUrl: string, key: string) => {
  const blob = await (await fetch(dataUrl)).blob();
  await putImageBlob(key, blob);
  return `idb:${key}`;
};

export const makeObjectUrlFromRef = async (ref: string) => {
  if (!ref.startsWith('idb:')) return ref;
  const key = ref.slice(4);
  const blob = await getImageBlob(key);
  if (!blob) {
    throw new Error('Image not found');
  }
  return URL.createObjectURL(blob);
};
