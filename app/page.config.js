import AddProduct from './pages/AddProduct';
import BecomeASeller from './pages/BecomeASeller';
import Browse from './pages/Browse';
import Home from './pages/Home';
import Map from './pages/Map';
import MyOrders from './pages/MyOrders';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import SellerDashboard from './pages/SellerDashboard';
// Заменяем старый импорт на новый клиентский лейаут
import LayoutClient from '@/components/LayoutClient'; 


export const PAGES = {
    "AddProduct": AddProduct,
    "BecomeASeller": BecomeASeller,
    "Browse": Browse,
    "Home": Home,
    "Map": Map,
    "MyOrders": MyOrders,
    "ProductDetails": ProductDetails,
    "Profile": Profile,
    "SellerDashboard": SellerDashboard,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    // Используем обновленный лейаут
    Layout: LayoutClient, 
};