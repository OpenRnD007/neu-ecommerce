import { useEffect, useRef } from "react";
import { useProductStore } from "../product/store";
import { animateEle } from "../utils";

const Layout = () => {
    const toggleCart = useProductStore((state) => state.toggleCart);
    const cartLength = useProductStore((state) => state.cartCount);
    const showMenu = useRef<HTMLDivElement>(null);
    const animateCart = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (animateCart && animateCart.current) {
            animateEle(animateCart.current,"animate-ping")
        }
    }, [cartLength])

    return (
        <nav className="fixed flex items-center justify-between flex-wrap bg-zinc-800 px-6 w-full z-10">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <img src="/logo.png" alt="neustack logo" className="h-16" />
            </div>
            <div className="block lg:hidden">
                <button onClick={() => {
                    if (showMenu && showMenu.current) {
                        showMenu.current.classList.toggle("hidden")
                    }
                }} className="flex items-center px-3 py-2 border rounded border-white hover:text-white hover:border-white">
                    <svg className="fill-current h-3 w-3 text-white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
            </div>
            <div ref={showMenu} className="hidden w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    {menus.map(ele =>
                        <a key={ele.label} href={ele.link} target={ele.target} className="block mt-4 lg:inline-block lg:mt-0 text-white mr-4">
                            {ele.label}
                        </a>
                    )}
                </div>
                <div>
                    <div onClick={toggleCart} className="cursor-pointer	relative inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-500 hover:bg-white mt-4 lg:mt-0">
                        Cart&nbsp;
                        <div ref={animateCart} className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-indigo-500 border-2 border-white rounded-full -top-2 -right-3 dark:border-gray-900">{cartLength}</div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Layout

const menus = [
    {
        "link": "https://github.com/OpenRnD007/neu-ecommerce",
        "target": "_blank",
        "label": "Code"
    }, {
        "link": "https://github.com/neustackapp/assignment",
        "target": "_blank",
        "label": "Assignment"
    }
]