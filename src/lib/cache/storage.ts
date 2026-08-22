function canUseStorage(): boolean {
  return typeof window !== "undefined"
}

export function readStorageRaw(key: string): string | null {
  if (!canUseStorage()) {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorageRaw(key: string, value: string): boolean {
  if (!canUseStorage()) {
    return false
  }

  try {
    const current = window.localStorage.getItem(key)

    if (current === value) {
      return false
    }

    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function removeStorageRaw(key: string): void {
  if (!canUseStorage()) {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch {
    return
  }
}

export function listStorageKeys(prefix: string): string[] {
  if (!canUseStorage()) {
    return []
  }

  const keys: string[] = []

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index)

      if (key && key.startsWith(prefix)) {
        keys.push(key)
      }
    }
  } catch {
    return keys
  }

  return keys
}
