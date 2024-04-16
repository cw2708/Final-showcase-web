import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import Layout from './components/Layout.tsx'
import Dashboard from './components/Dashboard.tsx'
import Favourites from './components/Favourites.tsx'
import Detector from './components/Detector.tsx'
import ProductPage from './components/ProductPage.tsx'
export default createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<App />} />
    <Route path="/Dashboard" element={<Dashboard />} />
    <Route path="/Favourites" element={<Favourites />} />
    <Route path="/Detector" element={<Detector />} />
    <Route path="/ProductPage/:id" element={<ProductPage />} />
  </Route>,
)
