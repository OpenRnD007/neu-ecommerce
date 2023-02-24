import React, { Fragment, useRef } from 'react'
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react'
import { ICart, useProductStore } from './store';

const Cart = () => {
    const products = useProductStore((state) => state.cart);
    const showCart = useProductStore((state) => state.showCart);
    const toggleCart = useProductStore((state) => state.toggleCart);

    return (
        <Transition.Root show={showCart} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={toggleCart}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                                            <CartHeader />
                                            <CartProducts products={products} />
                                        </div>
                                        <CartFooter products={products} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
export default Cart

/**
 * CardHeader Component [Title and Close Button]
 * @returns JSX.Element
 */
const CartHeader = () => {
    const toggleCart = useProductStore((state) => state.toggleCart);
    return (
        <div className="flex items-start justify-between">
            <Dialog.Title className="text-lg font-medium text-gray-900"> Shopping cart </Dialog.Title>
            <div className="ml-3 flex h-7 items-center">
                <button
                    type="button"
                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={toggleCart}
                >
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" x-description="Heroicon name: outline/x" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    )
}

/**
 * CartFooter Component Checkout Functionality 
 * @param props {products: ICart[]}
 * @returns JSX.Element
 */
const CartFooter = (props: { products: ICart[] }) => {
    const toggleCart = useProductStore((state) => state.toggleCart);
    return (
        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>${props.products.reduce((prev, current) => prev + (current.price * current.qty!), 0).toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">Free Shipping.</p>
            <div className="mt-6">
                <CouponCodeForm />
            </div>
            <div className="mt-6">
                <a
                    href="#"
                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                    Checkout
                </a>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                    or{' '}
                    <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={toggleCart}
                    >
                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                </p>
            </div>
        </div>
    )
}

/**
 * Cart -> All Product Listing
 * @param props products: ICart[]
 * @returns JSX.Element
 */
const CartProducts = (props: { products: ICart[] }) => {
    const removeFromCart = useProductStore((state) => state.removeFromCart);

    return (
        <div className="mt-8">
            <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {props.products.map((product) => (
                        <li key={product.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                            <a> {product.title} </a>
                                        </h3>
                                        <p className="ml-4">${product.price.toFixed(2)}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                                    <p className="mt-1 text-xs text-gray-700">Qty: {product.qty}</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex">
                                        <button
                                            onClick={() => {
                                                removeFromCart(product.id)
                                                toast.error(`${product.title} removed successfully from cart`);
                                            }}
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

/**
 * Coupon Code Form
 * @returns JSX.Element
 */
const CouponCodeForm = () => {
    const showForm = useRef<HTMLFormElement>(null);
    return (
        <React.Fragment>
            <button
                className="items-center justify-center rounded-md border border-transparent bg-teal-600 px-3 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-700"
                onClick={() => {
                    if (showForm && showForm.current) {
                        showForm.current.classList.toggle("hidden")
                    }
                }}
            >Get Coupon Code</button>

            <form ref={showForm} className="hidden w-full max-w-sm">
                <div className="flex items-center border-b border-indigo-500 py-2">
                    <input
                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        type="text"
                        placeholder="Coupon"
                        aria-label="Coupon" />
                    <button
                        className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded"
                        type="button">
                        Apply
                    </button>
                </div>
            </form>
        </React.Fragment>
    )
}