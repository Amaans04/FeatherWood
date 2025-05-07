import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export default function Auth() {
  const [location, navigate] = useLocation();
  const isLogin = location === '/login';
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signup, login, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Success",
          description: "You have successfully logged in!",
          className: "bg-[#FFD700] text-black",
        });
        navigate('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await signup(formData.email, formData.password, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          orders: []
        });
        toast({
          title: "Success",
          description: "Your account has been created successfully!",
          className: "bg-[#FFD700] text-black",
        });
        navigate('/');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Sign Up'} | FeatherWood</title>
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-[#151515] py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-[#1A1A1A] rounded-lg shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0A0A0A] p-6 text-center border-b border-gray-800">
              <h1 className="font-playfair text-2xl md:text-3xl font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-[#C4C4C4] mt-2">
                {isLogin ? 'Sign in to continue' : 'Join FeatherWood today'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#C4C4C4]">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-[#222222] border-gray-800 text-white focus:border-[#FFD700] focus:ring-[#FFD700]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#C4C4C4]">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-[#222222] border-gray-800 text-white focus:border-[#FFD700] focus:ring-[#FFD700]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-[#C4C4C4]">City</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      className="bg-[#222222] border-gray-800 text-white focus:border-[#FFD700] focus:ring-[#FFD700]"
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#C4C4C4]">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-[#222222] border-gray-800 text-white focus:border-[#FFD700] focus:ring-[#FFD700]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#C4C4C4]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-[#222222] border-gray-800 text-white focus:border-[#FFD700] focus:ring-[#FFD700] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C4C4C4] hover:text-[#FFD700]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#C4C4C4]">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="bg-[#222222] border-gray-800 text-white focus:border-[#FFD700] focus:ring-[#FFD700] pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C4C4C4] hover:text-[#FFD700]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))}
                      className="border-gray-800 data-[state=checked]:bg-[#FFD700] data-[state=checked]:text-black"
                    />
                    <Label htmlFor="rememberMe" className="text-[#C4C4C4] text-sm">Remember me</Label>
                  </div>
                  <Link href="/forgot-password">
                    <span className="text-[#FFD700] text-sm hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#FFD700] hover:bg-[#D4AF37] text-black font-medium py-6"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>

              <div className="text-center">
                <p className="text-[#C4C4C4]">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <Link href={isLogin ? '/signup' : '/login'}>
                    <span className="text-[#FFD700] hover:underline cursor-pointer">
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
} 