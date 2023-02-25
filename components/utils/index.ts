/**
 * Animate any Component
 * @param animate `JSX.Element` | `HTMLElement`
 * @param type `animate-spin` | `animate-pulse`...
 * @param timeout number of second
 */
export const animateEle = (animate: any, type: string, timeout: number = 500) => {
    if (animate) {
        animate.classList.add(type)
        setTimeout(() => {
            animate && animate.classList.remove(type)
        }, timeout)
    }
}

/**
 * Calculate Discount
 * @param discount string
 * @returns number
 */
export const calculateDiscount = (discount: string, subtotal: string, returnOnlyVal: boolean = false) => {
    let disc = parseFloat(discount ?? "0")
    const subttl = parseFloat(subtotal)
    if (disc) {
        disc = disc / 100
        const discVal = subttl * disc
        if(returnOnlyVal) return discVal
        return subttl - discVal
    }
    if(returnOnlyVal) return disc
    return subttl
}