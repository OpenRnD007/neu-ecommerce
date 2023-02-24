export const getAllProductApi = async (signal: AbortSignal) => {
    try {
        const response = await fetch('https://dummyjson.com/products/', { signal })
        return await response.json()
    }
    catch (err) {
        throw err
    }
}

export const getDiscountCoupon = async (cid: String) => {
    try {
        const response = await fetch('https://neu-ecommerce-be.onrender.com/cart/coupon/' + cid)
        return await response.json()
    }
    catch (err) {
        throw err
    }
}

export const placeOrder = async (data: any) => {
    try {
        await fetch('https://neu-ecommerce-be.onrender.com/cart/save/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        return { "success": 1 }
    }
    catch (err) {
        throw err
    }
}