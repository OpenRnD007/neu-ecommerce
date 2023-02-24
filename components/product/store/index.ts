import { create } from 'zustand'

export interface IProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    thumbnail: string;
    rating: string;
    brand: string;
}

export interface ICart extends IProduct {
    qty?: number
}

export const useProductStore = create<{
    products: IProduct[];
    setProducts: (products: IProduct[]) => void;
    getProductInfo: (id: number) => IProduct;
    setLoader: (status: boolean) => void;

    cart: ICart[];
    showCart: boolean;
    addToCart: (id: number) => void;
    removeFromCart: (id: number) => void;
    toggleCart: () => void;
    cartCount: number;
    isloading: boolean;
}>((set, get) => ({

    products: [],

    setProducts: (result) => {
        set((state) => ({ "products": result }))
    },

    getProductInfo: (id: number) => get().products.find(product => product.id === id) || {} as IProduct,

    setLoader: (status: boolean) => {
        set((state) => ({ isloading: status }))
    },
    cart: [],
    showCart: false,
    addToCart: (id: number) => {
        const newC = get().cart
        const currentProduct = newC.find(item => item.id === id);
        if (currentProduct) {
            currentProduct.qty = currentProduct.qty ? currentProduct.qty + 1 : 1;
        } else {
            newC.push({ ...get().getProductInfo(id), qty: 1 })
        }
        console.log("add:newCart::", newC)
        set((state) => ({ cart: newC, cartCount: newC.reduce((a, b) => a + (b.qty ? b.qty : 0), 0) }))
    },

    removeFromCart: (id: number) => {
        let newCart = get().cart;
        newCart = newCart.filter(pinfo => pinfo.id !== id)
        console.log("rm:newCart::", newCart)
        set((state) => ({ cart: newCart, cartCount: newCart.reduce((a, b) => a + (b.qty ? b.qty : 0), 0) }))
    },

    toggleCart: () => {
        set((state) => ({ showCart: !state.showCart }))
    },
    cartCount: 0,
    isloading: false
}));