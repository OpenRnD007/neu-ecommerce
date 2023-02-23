export const getAllProductApi = async (signal: AbortSignal) => {
    try {
        const response = await fetch('https://dummyjson.com/products/', { signal })
        return await response.json()
    }
    catch (err) {
        throw err
    }
}