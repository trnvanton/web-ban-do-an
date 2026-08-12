import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './contexts/AuthContext';

function ScrollToTop() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname, search]);

    return null;
}

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ShopDetail = lazy(() => import('./pages/ShopDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const Address = lazy(() => import('./pages/Address'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Recipes = lazy(() => import('./pages/Recipes'));
const Testimonial = lazy(() => import('./pages/Testimonial'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Loading() {
    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
            <div className="spinner-grow text-primary" role="status"></div>
        </div>
    );
}

// Trang yêu cầu đăng nhập
function RequireLogin({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <Loading />;
    if (!user) return <Navigate to="/dang-nhap" replace />;
    return children;
}

// Trang yêu cầu admin
function RequireAdmin({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <Loading />;
    if (!user) return <Navigate to="/dang-nhap" replace />;
    if (user.vai_tro !== 'admin') return <Navigate to="/" replace />;
    return children;
}

export default function App() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <Suspense fallback={<Loading />}>
            <ScrollToTop />
            {!isAdmin && <Navbar />}
            <div style={{ paddingTop: isAdmin ? '0px' : '90px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/san-pham/:id" element={<ShopDetail />} />
                    <Route path="/gio-hang" element={<RequireLogin><Cart /></RequireLogin>} />
                    <Route path="/thanh-toan" element={<RequireLogin><Checkout /></RequireLogin>} />
                    <Route path="/dang-nhap" element={<Login />} />
                    <Route path="/tai-khoan" element={<RequireLogin><Profile /></RequireLogin>} />
                    <Route path="/dia-chi" element={<RequireLogin><Address /></RequireLogin>} />
                    <Route path="/don-hang" element={<RequireLogin><MyOrders /></RequireLogin>} />
                    <Route path="/goi-y-mon-an" element={<Recipes />} />
                    <Route path="/cam-nhan" element={<Testimonial />} />
                    <Route path="/lien-he" element={<Contact />} />
                    <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            {!isAdmin && <Footer />}
        </Suspense>
    );
}
