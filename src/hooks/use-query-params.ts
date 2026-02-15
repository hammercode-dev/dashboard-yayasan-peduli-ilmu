import { useSearchParams, useRouter, usePathname } from "next/navigation"

/**
 * Hook to get and set query params
 * @returns An object with the getParam, getNumberParam, setParam, setParams, and searchParams functions
 */
export function useQueryParams() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  /**
   * Get a parameter from the search params
   * @param key - The key of the parameter
   * @param defaultValue - The default value of the parameter
   * @returns The value of the parameter
   */
  const getParam = (key: string, defaultValue?: string) => {
    return searchParams.get(key) || defaultValue || ""
  }

  /**
   * Get a number parameter from the search params
   * @param key - The key of the parameter
   * @param defaultValue - The default value of the parameter
   * @returns The value of the parameter
   */
  const getNumberParam = (key: string, defaultValue: number = 0) => {
    const value = searchParams.get(key)
    return value ? parseInt(value, 10) : defaultValue
  }

  /**
   * Set a parameter in the search params
   * @param key - The key of the parameter
   * @param value - The value of the parameter
   */
  const setParam = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === null || value === "" || value === undefined) {
      params.delete(key)
    } else {
      params.set(key, value.toString())
    }

    const query: Record<string, string> = {}
    params.forEach((value, key) => {
      query[key] = value
    })

    router.push(`${pathname}?${new URLSearchParams(query).toString()}`, {
      scroll: false,
    })
  }

  /**
   * Set multiple parameters in the search params
   * @param updates - The updates to the search params
   */
  const setParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        params.delete(key)
      } else {
        params.set(key, value.toString())
      }
    })

    const query: Record<string, string> = {}
    params.forEach((value, key) => {
      query[key] = value
    })

    router.push(`${pathname}?${new URLSearchParams(query).toString()}`, {
      scroll: false,
    })
  }

  return {
    getParam,
    getNumberParam,
    setParam,
    setParams,
    searchParams,
  }
}
