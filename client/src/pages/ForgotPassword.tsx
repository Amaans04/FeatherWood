import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for instructions to reset your password.",
        className: "bg-[#FFD700] text-black",
      });
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
        <title>Forgot Password | Featherwood</title>
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
                Reset Your Password
              </h1>
              <p className="text-[#C4C4C4] mt-2">
                Enter your email address to receive a password reset link
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#C4C4C4]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#222222] border-gray-800 text-white focus:border-[#FFD700] focus:ring-[#FFD700]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FFD700] hover:bg-[#D4AF37] text-black font-medium py-6"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <p className="text-[#C4C4C4]">
                  Remember your password?{' '}
                  <Link href="/login">
                    <span className="text-[#FFD700] hover:underline cursor-pointer">
                      Sign in
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