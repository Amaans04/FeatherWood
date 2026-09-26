import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageLayout from '@/components/PageLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
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
        title: 'Password Reset Email Sent',
        description: 'Please check your email for instructions to reset your password.',
      });
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
        title: 'Forgot Password',
        description: 'Reset your FeatherWood account password.',
        canonical: '/forgot-password',
        noIndex: true,
      }}
    >
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Forgot Password' }]} />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-white border border-[#E8E4DF] overflow-hidden"
          >
            <div className="p-6 text-center border-b border-[#E8E4DF]">
              <p className="luxury-label mb-2">Account</p>
              <h1 className="font-cormorant text-2xl md:text-3xl font-light text-[#1A1A1A]">Reset Your Password</h1>
              <p className="text-[#6E6A66] mt-2 text-sm">
                Enter your email address to receive a password reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#6E6A66] text-xs uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-none bg-[#FAFAF8] border-[#E8E4DF] text-[#1A1A1A] focus:border-[#8B7355]"
                  required
                />
              </div>

              <button type="submit" className="luxury-btn w-full disabled:opacity-50" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <Link href="/login">
                  <span className="text-[#8B7355] text-sm hover:underline cursor-pointer">Back to Sign In</span>
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
