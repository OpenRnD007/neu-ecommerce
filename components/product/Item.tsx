import React from "react";
import { useProductStore } from "./store";

const Item = (props: { id: number }) => {
    const addToCart = useProductStore((state) => state.addToCart);
    const getProductInfo = useProductStore((state) => state.getProductInfo);
    const product = getProductInfo(props.id);

    return (
        <div className="relative drop-shadow rounded-lg border border-slate-300 p-3">
            {product && <React.Fragment>
                <div className="w-full h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden lg:h-60 lg:aspect-none">
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                    />
                </div>
                <div className="mt-4 flex justify-between">
                    <div className="">
                        <div className="text-sm h-20 text-gray-700 overflow-hidden text-ellipsis">
                            {product.title}, {product.description}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 border-t pt-2 border-slate-300 items-center justify-center w-full mt-4">
                    <p className="text-lg font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                    </p>
                    <button
                        onClick={() => {
                            addToCart(product.id);
                        }}
                        className={`h-10 px-2 font-semibold rounded-md bg-indigo-500 text-white whitespace-nowrap cursor-pointer disabled:opacity-75`}>
                        Add to cart
                    </button>
                </div>
            </React.Fragment>}
        </div>
    )
}

export default Item