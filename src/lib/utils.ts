/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDirtyValues(dirtyFields: any, allValues: any) {
  const changed: any = {}

  Object.keys(dirtyFields).forEach(key => {
    if (dirtyFields[key]) {
      changed[key] = allValues[key]
    }
  })

  return changed
}
