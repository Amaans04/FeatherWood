import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "wouter";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <main className="flex-grow min-h-screen relative" data-barba="container">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;