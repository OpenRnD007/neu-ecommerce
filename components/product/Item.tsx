import React, { useEffect, useRef } from "react";
import { animateEle } from "../utils";
import { IProduct, useProductStore } from "./store";

const Item = (props: { id: number }) => {
    const getProductInfo = useProductStore((state) => state.getProductInfo);
    const product = getProductInfo(props.id);

    return (
        <div className="relative drop-shadow rounded-lg border border-slate-300 p-3">
            {product &&
                <React.Fragment>
                    <ItemHero product={product} />
                    <ItemDescription product={product} />
                    <ItemFooter product={product} />
                </React.Fragment>
            }
        </div>
    )
}

export default Item

/**
 * Product Hero image
 * @param props {product: IProduct}
 * @returns 
 */
const ItemHero = (props: { product: IProduct }) => {
    return (
        <div className="w-full h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden lg:h-60 lg:aspect-none">
            <img
                src={props.product.thumbnail}
                alt={props.product.title}
                className="w-full h-full object-center object-cover lg:w-full lg:h-full"
            />
        </div>
    )
}

/**
 * Product Desciption
 * @param props {product: IProduct}
 * @returns 
 */
const ItemDescription = (props: { product: IProduct }) => {
    return (
        <div className="mt-4 flex justify-between">
            <div className="">
                <div className="text-sm h-20 text-gray-700 overflow-hidden text-ellipsis">
                    <b>{props.product.title}</b>, {props.product.description}
                </div>
            </div>
        </div>
    )
}

/**
 * Product Add to Cart
 * @param props {product: IProduct}
 * @returns 
 */
const ItemFooter = (props: { product: IProduct }) => {
    const addToCart = useProductStore((state) => state.addToCart);
    const animateCart = useRef<HTMLButtonElement>(null);
    const cartLength = useProductStore((state) => state.cartCount);
    const cart = useProductStore((state) => state.cart);

    useEffect(() => {
        const label = cart.find(c => c.id === props.product.id) ? "Added" : "Add to cart";
        if (animateCart && animateCart.current) {
            animateCart.current.innerHTML = label
        }
    }, [cartLength])

    return (
        <div className="grid grid-cols-2 border-t pt-2 border-slate-300 items-center justify-center w-full mt-4">
            <p className="text-lg font-medium text-gray-900">
                ${props.product.price.toFixed(2)}
            </p>
            <button
                ref={animateCart}
                onClick={() => {
                    addToCart(props.product.id)
                    if (animateCart && animateCart.current) {
                        animateEle(animateCart.current, "animate-ping")
                        animateCart.current.innerHTML = "Added"
                    }
                }}
                className={`h-10 px-2 font-semibold rounded-md bg-indigo-500 text-white whitespace-nowrap cursor-pointer disabled:opacity-75`}>
                Add to cart 
            </button>
        </div>
    )
}