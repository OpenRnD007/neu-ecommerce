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