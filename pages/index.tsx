import type { NextPage } from 'next'
import Layout from '@/components/layout'
import Listing from '@/components/product/Listing'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home: NextPage = () => {
  return (
    <div className="w-full">
      <Layout />
      <Listing />
      <ToastContainer position="bottom-center" />
    </div>
  )
}

export default Home