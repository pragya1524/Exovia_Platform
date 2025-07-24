import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import AuthBackground from '@/components/AuthBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setAnimateElements(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthBackground>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className={`text-center mb-8 transition-all duration-1000 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 shadow-2xl rounded-2xl overflow-hidden transition-all duration-1000 delay-200 ${animateElements ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
              <img 
                src="/FullLogo_NoBuffer.png" 
                alt="Exovia Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-2 transition-all duration-1000 delay-400 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Exovia Analytics
            </h1>
            <p className={`text-gray-600 text-sm transition-all duration-1000 delay-600 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Transform your data into insights
            </p>
          </div>

          <Card 
            className={`bg-[#FFF8E7]/90 border-[#EEDFC5] shadow-lg rounded-2xl transition-all duration-1000 delay-300 ${animateElements ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
          >
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-[#5D4037] flex items-center justify-center gap-2">
                <User className="w-6 h-6 text-orange-400" />
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`space-y-2 transition-all duration-700 delay-400 ${animateElements ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                  <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white border-[#EEDFC5] text-[#5D4037] placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                <div className={`space-y-2 transition-all duration-700 delay-600 ${animateElements ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                  <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white border-[#EEDFC5] text-[#5D4037] placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-300 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-[#5D4037] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className={`text-right transition-all duration-700 delay-700 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <Link to="/forgot-password" className="text-sm text-orange-400 hover:text-orange-500 transition-colors duration-200 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <div className={`transition-all duration-700 delay-800 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <div className={`text-sm text-center text-gray-600 transition-all duration-700 delay-1000 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                Don't have an account?{' '}
                <Link to="/register" className="text-orange-400 hover:text-orange-500 font-semibold transition-colors duration-200 hover:underline">
                  Create one now
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthBackground>
  );
};

export default Login;

