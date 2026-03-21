import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Auth from './pages/Auth';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetails />} />
          <Route path="login" element={<Auth mode="login" />} />
          <Route path="register" element={<Auth mode="register" />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
