import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Password reset email sent! Check your inbox.');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF3E0]">
          <Card className="w-full max-w-md backdrop-blur-sm bg-[#FFF8E7] border border-[#E0C7B5] shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-[#EAD9C1] rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-[#6D4C41]" />
              </div>
              <CardTitle className="text-xl text-[#5D4037]">Check Your Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-[#5D4037]">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-[#8D6E63]">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-[#6D4C41] to-[#5D4037] hover:from-[#5D4037] hover:to-[#4E342E] text-white">
                <Link to="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF3E0]">
        <Card className="w-full max-w-md backdrop-blur-sm bg-[#FFF8E7] border border-[#E0C7B5] shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#5D4037]">Forgot Password</CardTitle>
            <p className="text-[#8D6E63]">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-[#5D4037]">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6D4C41] to-[#5D4037] hover:from-[#5D4037] hover:to-[#4E342E] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <div className="text-center">
                <Button variant="link" asChild className="text-[#6D4C41] hover:text-[#5D4037]">
                  <Link to="/login">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AnimatedBackground>
  );
};

export default ForgotPassword;
