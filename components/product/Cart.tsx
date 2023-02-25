import React, { Fragment, useRef } from 'react'
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react'
import { ICart, useProductStore } from './store';
import { getDiscountCoupon, placeOrder } from './store/apireq';
import { calculateDiscount } from '../utils';

const Cart = () => {
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
                                            <CartProducts />
                                        </div>
                                        <CartFooter />
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
const CartFooter = () => {
    const toggleCart = useProductStore((state) => state.toggleCart);
    const subtotal = useProductStore((state) => state.subtotal);
    const total = useProductStore((state) => state.total);
    const discount = useProductStore((state) => state.discount);
    const discountCode = useProductStore((state) => state.discountCode);
    const setDiscount = useProductStore((state) => state.setDiscount);
    const cid = useProductStore((state) => state.cid);
    const cart = useProductStore((state) => state.cart);
    const reset = useProductStore((state) => state.reset);
    const showLoading = useRef<HTMLDivElement>(null);

    const checkout = () => {
        if (cart.length && showLoading && showLoading.current && showLoading.current.innerHTML === "Checkout") {
            showLoading.current.innerHTML = "Loading..."
            const data = {
                total,
                discount,
                discountCode,
                subtotal,
                cid,
                products: cart.map(c => ({
                    title: c.title,
                    qty: c.qty,
                    price: c.price
                }))
            }

            placeOrder(data)
                .then(resp => {
                    toast.success(`Your Order Placed Successfully`);
                    reset()
                })
                .catch(err => {
                    toast.error(`Something went wrong, Please try again`);
                }).finally(() => {
                    if (showLoading && showLoading.current) {
                        showLoading.current.innerHTML = "Checkout"
                    }
                })
        }
    }
    return (
        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Sub Total</p>
                <p>${subtotal ?? 0}</p>
            </div>
            <div className="flex justify-between text-base font-normal text-gray-900 py-1">
                <p>Discount</p>
                <p>-{discount ?? 0}% {discount && parseFloat(discount) > 0 ? `= -\$${calculateDiscount(discount, subtotal, true).toFixed(2)}` : ''}</p>
            </div>
            {discountCode && discountCode?.length > 0 &&
                <div className="flex justify-between text-base font-normal text-gray-900 py-1">
                    <p className='relative text-white text-xs bg-teal-600 py-1 px-2 rounded'>
                        {discountCode}
                        <svg
                            onClick={() => setDiscount("0", "")}
                            className="cursor-pointer text-white absolute h-4 w-3 -top-3 right-0 text-gray-900 bg-teal-600 rounded" x-description="Heroicon name: outline/x" xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </p>
                </div>
            }
            <div className="flex justify-between text-base font-normal text-gray-900 border-t py-2">
                <p>Total</p>
                <p>${total ?? 0}</p>
            </div>

            {!cid
                ? <SelectUser />
                : <>
                    <div className="mt-6">
                        {!discountCode && parseInt(total, 10) > 0 &&
                            <CouponCodeForm />
                        }
                    </div>
                    <div className="mt-6">
                        {cart.length > 0 && <div
                            ref={showLoading}
                            onClick={checkout}
                            className="cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                            Checkout
                        </div>}
                    </div>
                </>}
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
const CartProducts = () => {
    const removeFromCart = useProductStore((state) => state.removeFromCart);
    const products = useProductStore((state) => state.cart);

    const remove = (product: ICart) => {
        removeFromCart(product.id)
        toast.error(`${product.title} removed successfully from cart`);
    }

    return (
        <div className="mt-8">
            <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {products.map((product) => (
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
                                            onClick={() => remove(product)}
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
    const setDiscount = useProductStore((state) => state.setDiscount);
    const cid = useProductStore((state) => state.cid);
    const showLoading = useRef<HTMLButtonElement>(null);

    const getDC = () => {
        if (showLoading && showLoading.current && showLoading.current.innerHTML === "Get Coupon Code") {
            showLoading.current.innerHTML = "Loading..."
            getDiscountCoupon(cid)
                .then(resp => {
                    if (resp && resp.discount) {
                        toast.info(`${resp.discount}% Discount on this Order`);
                        setDiscount(resp.discount, resp.success)
                    }
                    else {
                        toast.error(`No Discount for this Order`);
                    }
                })
                .finally(() => {
                    if (showLoading && showLoading.current) {
                        showLoading.current.innerHTML = "Get Coupon Code"
                    }
                })
        }
    }

    return (
        <React.Fragment>
            <button
                ref={showLoading}
                className="items-center justify-center rounded-md border border-transparent bg-teal-600 px-3 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-700"
                onClick={getDC}
            >Get Coupon Code</button>
        </React.Fragment>
    )
}

const SelectUser = () => {
    const setCid = useProductStore((state) => state.setCid);
    return (
        <div>
            <div className='border-t py-3 text-medium'>Select User To Place Order</div>
            <div className="flex justify-center">
                <div className="w-96">
                    <button
                        onClick={() => setCid("1")}
                        type="button"
                        className="bg-indigo-200 block w-full cursor-pointer rounded-lg p-4 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0">
                        User 1
                    </button>
                    <button
                        onClick={() => setCid("2")}
                        type="button"
                        className="mt-1 bg-indigo-200 block w-full cursor-pointer rounded-lg p-4 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0">
                        User 2
                    </button>
                    <button
                        onClick={() => setCid("3")}
                        type="button"
                        className="mt-1 bg-indigo-200 block w-full cursor-pointer rounded-lg p-4 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0">
                        User 3
                    </button>
                    <button
                        onClick={() => setCid("4")}
                        type="button"
                        className="mt-1 bg-indigo-200 block w-full cursor-pointer rounded-lg p-4 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0">
                        User 4
                    </button>
                </div>
            </div>
        </div>
    )
}