import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import EntryAnimation from "@/components/EntryAnimation";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Furniture from "@/pages/Furniture";
import Cart from "@/pages/Cart";
import Auth from "@/pages/Auth";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Orders from "@/pages/Orders";
import OrderDetails from "@/pages/OrderDetails";
import Checkout from "@/pages/Checkout";
import ManageOrders from "@/pages/ManageOrders";
import StoreLocator from "@/pages/StoreLocator";
import HomeCalculator from "@/pages/HomeCalculator";
import KitchenCalculator from "@/pages/KitchenCalculator";
import WardrobeCalculator from "@/pages/WardrobeCalculator";
import FurnitureCategory from "@/pages/FurnitureCategory";
import FurnitureProductDetail from "@/pages/FurnitureProductDetail";
import DesignIdeas from "@/pages/DesignIdeas";
import DesignIdeasDetail from "@/pages/DesignIdeasDetail";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Projects from "@/pages/Projects";
import Profile from "@/pages/Profile";
import ProjectDetail from "@/pages/ProjectDetail";
import UserInfo from "@/pages/UserInfo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CartProvider } from "@/contexts/CartContext";
import { AnimationProvider } from "@/contexts/AnimationContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import ForgotPassword from "@/pages/ForgotPassword";

function App() {
  return (
    <LoadingProvider>
      <AnimationProvider>
        <CartProvider>
          <Toaster />
          <EntryAnimation />
          <ScrollToTop />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/furniture" component={Furniture} />
            <Route path="/furniture/:categoryId" component={FurnitureCategory} />
            <Route path="/furniture/:categoryId/:productId" component={FurnitureProductDetail} />
            <Route path="/cart" component={Cart} />
            <Route path="/auth" component={Auth} />
            <Route path="/login" component={Auth} />
            <Route path="/signup" component={Auth} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/store-locator" component={StoreLocator} />
            <Route path="/home-interior-price-calculator" component={HomeCalculator} />
            <Route path="/kitchen-price-calculator" component={KitchenCalculator} />
            <Route path="/wardrobe-price-calculator" component={WardrobeCalculator} />
            <Route path="/design-ideas" component={DesignIdeas} />
            <Route path="/design-ideas/:id" component={DesignIdeasDetail} />
            <Route path="/services" component={Services} />
            <Route path="/services/:id" component={ServiceDetail} />
            <Route path="/projects" component={Projects} />
            <Route path="/projects/:id" component={ProjectDetail} />
            <Route path="/user-info" component={UserInfo} />
            <Route path="/orders" component={Orders} />
            <Route path="/orders/:id" component={OrderDetails} />
            <ProtectedRoute path="/profile" component={Profile} />
            <ProtectedRoute path="/checkout" component={Checkout} />
            <AdminRoute path="/admin/orders" component={ManageOrders} />
            <Route path="/forgot-password" component={ForgotPassword} />
          </Switch>
        </CartProvider>
      </AnimationProvider>
    </LoadingProvider>
  );
}

export default App;
