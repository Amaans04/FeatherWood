import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PageLayout from '@/components/PageLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const inputClass =
  'rounded-none bg-[#FAFAF8] border-[#E8E4DF] text-[#1A1A1A] focus:border-[#8B7355] focus:ring-[#8B7355]';

export default function Auth() {
  const [location, navigate] = useLocation();
  const isLogin = location === '/login';
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signup, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({ title: 'Success', description: 'You have successfully logged in!' });
        navigate('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signup(formData.email, formData.password, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          orders: [],
        });
        toast({ title: 'Success', description: 'Your account has been created successfully!' });
        navigate('/');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      seo={{
        title: isLogin ? 'Login' : location === '/signup' ? 'Sign Up' : 'Account',
        description: isLogin
          ? 'Sign in to your FeatherWood account.'
          : 'Create your FeatherWood account to save designs and track orders.',
        canonical: location === '/signup' ? '/signup' : isLogin ? '/login' : '/auth',
        noIndex: true,
      }}
    >
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: isLogin ? 'Login' : 'Sign Up' },
        ]}
      />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-white border border-[#E8E4DF] overflow-hidden"
          >
            <div className="p-6 text-center border-b border-[#E8E4DF]">
              <p className="luxury-label mb-2">{isLogin ? 'Welcome Back' : 'Join Us'}</p>
              <h1 className="font-cormorant text-2xl md:text-3xl font-light text-[#1A1A1A]">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="text-[#6E6A66] mt-2 text-sm">
                {isLogin ? 'Sign in to continue' : 'Join FeatherWood today'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#6E6A66] text-xs uppercase tracking-wider">
                      Full Name
                    </Label>
                    <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#6E6A66] text-xs uppercase tracking-wider">
                      Phone Number
                    </Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-[#6E6A66] text-xs uppercase tracking-wider">
                      City
                    </Label>
                    <Input id="city" name="city" type="text" value={formData.city} onChange={handleChange} className={inputClass} required />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#6E6A66] text-xs uppercase tracking-wider">
                  Email
                </Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#6E6A66] text-xs uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A66] hover:text-[#1A1A1A]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#6E6A66] text-xs uppercase tracking-wider">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))
                      }
                      className="border-[#E8E4DF] data-[state=checked]:bg-[#1A1A1A] data-[state=checked]:text-white"
                    />
                    <Label htmlFor="rememberMe" className="text-[#6E6A66] text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password">
                    <span className="text-[#8B7355] text-sm hover:underline cursor-pointer">Forgot password?</span>
                  </Link>
                </div>
              )}

              <button type="submit" className="luxury-btn w-full disabled:opacity-50" disabled={loading}>
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>

              <div className="text-center">
                <p className="text-[#6E6A66] text-sm">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <Link href={isLogin ? '/signup' : '/login'}>
                    <span className="text-[#8B7355] hover:underline cursor-pointer">
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
