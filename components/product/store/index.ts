import { calculateDiscount } from '@/components/utils';
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
    cart: ICart[];
    showCart: boolean;
    cartCount: number;
    isloading: boolean;
    subtotal: string;
    total: string;
    discount: string;
    discountCode: string;
    cid: string;

    setProducts: (products: IProduct[]) => void;
    getProductInfo: (id: number) => IProduct;
    setLoader: (status: boolean) => void;
    addToCart: (id: number) => void;
    removeFromCart: (id: number) => void;
    setCid: (id: string) => void;
    toggleCart: () => void;
    setDiscount: (val: string, code: string) => void;
    reset: () => void;
}>((set, get) => ({

    products: [],
    cart: [],
    showCart: false,
    cartCount: 0,
    isloading: false,
    subtotal: "0",
    total: "0",
    discount: "0",
    discountCode: "",
    cid: "",

    setCid: (result) => {
        set((state) => ({ "cid": result }))
    },

    setProducts: (result) => {
        set((state) => ({ "products": result }))
    },

    getProductInfo: (id: number) => get().products.find(product => product.id === id) || {} as IProduct,

    setLoader: (status: boolean) => {
        set((state) => ({ isloading: status }))
    },

    addToCart: (id: number) => {
        const newC = get().cart
        const currentProduct = newC.find(item => item.id === id);
        if (currentProduct) {
            currentProduct.qty = currentProduct.qty ? currentProduct.qty + 1 : 1;
        } else {
            newC.push({ ...get().getProductInfo(id), qty: 1 })
        }
        console.log("add:newCart::", newC)
        const subtotal = newC.reduce((prev, current) => prev + (current.price * current.qty!), 0).toFixed(2)
        const total = (calculateDiscount(get().discount ?? "0", subtotal)).toFixed(2)
        set((state) => ({ cart: newC, subtotal, total, cartCount: newC.reduce((a, b) => a + (b.qty ? b.qty : 0), 0) }))
    },

    removeFromCart: (id: number) => {
        let newCart = get().cart;
        newCart = newCart.filter(pinfo => pinfo.id !== id)
        console.log("rm:newCart::", newCart)
        const subtotal = newCart.reduce((prev, current) => prev + (current.price * current.qty!), 0).toFixed(2)
        const total = (calculateDiscount(get().discount ?? "0", subtotal)).toFixed(2)
        set((state) => ({ cart: newCart, subtotal, total, cartCount: newCart.reduce((a, b) => a + (b.qty ? b.qty : 0), 0) }))
    },

    toggleCart: () => {
        set((state) => ({ showCart: !state.showCart }))
    },

    setDiscount: (val: string, discountCode: string) => {
        const subtotal = get().cart.reduce((prev, current) => prev + (current.price * current.qty!), 0).toFixed(2)
        const total = (calculateDiscount(val ? val : "0",subtotal)).toFixed(2)
        set((state) => ({ subtotal, total, discount: val, discountCode }))
    },

    reset: () => {
        set((state) => ({
            cart: [],
            showCart: false,
            cartCount: 0,
            subtotal: "0",
            total: "0",
            discount: "0",
            discountCode: "",
            cid: ""
        }))
    }
}));