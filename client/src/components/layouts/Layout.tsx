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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 lg:pt-20" data-barba="container">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;