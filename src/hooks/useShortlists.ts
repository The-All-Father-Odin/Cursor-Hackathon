"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createShortlist,
  DEFAULT_SHORTLIST_ID,
  deleteShortlist,
  readStoredShortlists,
  removeSupplierFromShortlist,
  toggleSupplierInShortlist,
  writeStoredShortlists,
} from "@/lib/shortlists";
import { Shortlist, ShortlistSupplier } from "@/types/supplier";

export function useShortlists() {
  const [shortlists, setShortlists] = useState<Shortlist[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setShortlists(readStoredShortlists());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStoredShortlists(shortlists);
  }, [ready, shortlists]);

  const defaultShortlist = useMemo(
    () =>
      shortlists.find((shortlist) => shortlist.id === DEFAULT_SHORTLIST_ID) ?? {
        id: DEFAULT_SHORTLIST_ID,
        name: "Saved Suppliers",
        suppliers: [],
        createdAt: new Date(0).toISOString(),
      },
    [shortlists]
  );

  return {
    shortlists,
    ready,
    defaultShortlist,
    getShortlist: (id: string) => shortlists.find((shortlist) => shortlist.id === id) ?? null,
    isShortlisted: (supplierId: string, shortlistId = DEFAULT_SHORTLIST_ID) =>
      (shortlists.find((shortlist) => shortlist.id === shortlistId) ?? defaultShortlist).suppliers.some(
        (supplier) => supplier.id === supplierId
      ),
    createShortlist: (name: string) => setShortlists((prev) => createShortlist(prev, name)),
    deleteShortlist: (id: string) => setShortlists((prev) => deleteShortlist(prev, id)),
    removeSupplier: (shortlistId: string, supplierId: string) =>
      setShortlists((prev) => removeSupplierFromShortlist(prev, shortlistId, supplierId)),
    toggleDefaultSupplier: (supplier: ShortlistSupplier) =>
      setShortlists((prev) => toggleSupplierInShortlist(prev, DEFAULT_SHORTLIST_ID, supplier)),
  };
}
