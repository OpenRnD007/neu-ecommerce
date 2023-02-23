import type { NextPage } from 'next'
import Layout from '@/components/layout'
import Listing from '@/components/product/Listing'

const Home: NextPage = () => {
  return (
    <div className="w-full">
      <Layout />
      <Listing />
    </div>
  )
}

export default Home