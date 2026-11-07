"use client";

import { useSyncExternalStore } from "react";

// Shared "intro finished" signal so the hero can wait for the preloader.
let introDone = false;
const EVENT = "lr:intro-done";

export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  window.dispatchEvent(new Event(EVENT));
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => introDone,
    () => false
  );
}

// Lets any "Discuss this" button pre-select a service in the contact form.
export const SERVICE_EVENT = "lr:select-service";
export function selectService(service: string) {
  window.dispatchEvent(new CustomEvent(SERVICE_EVENT, { detail: service }));
}
