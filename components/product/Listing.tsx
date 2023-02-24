import { useEffect } from 'react';

import { useProductStore } from "./store";
import { Loading } from '../utils/Loading';
import Item from './Item'
import Cart from './Cart';
import { getAllProductApi } from './store/apireq';

const Listing = () => {
    const products = useProductStore((state) => state.products);
    const isloading: boolean = useProductStore((state) => state.isloading);
    const setLoader = useProductStore((state) => state.setLoader);
    const setProducts = useProductStore((state) => state.setProducts);

    useEffect(() => {
        setLoader(true);
        const controller = new AbortController();
        const signal = controller.signal;

        getAllProductApi(signal)
            .then((response) => setProducts(response.products))
            .finally(() => setLoader(false));

        return () => {
            //Cleanup if unmounted
            controller.abort();
        };
    }, [])

    return (
        <div className="bg-white">
            {isloading && <Loading />}
            <div className="max-w-2xl mx-auto py-8 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.length > 0 && products.map(product =>
                        <Item key={product.id} id={product.id} />
                    )}
                </div>
            </div>
            <Cart />
        </div>
    )
}

export default Listing