import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Mail, Lock, BarChart2, User, ArrowRight, Shield, Database, TrendingUp, CheckCircle, Sparkles, Zap, Star, Heart, Target, Zap as Lightning, MousePointer, Wifi, Cpu, Zap as Bolt, Rocket, Zap as Thunder } from 'lucide-react';
import AuthBackground from '@/components/AuthBackground';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setAnimateElements(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      toast({
        title: "Success",
        description: "Your account has been created successfully.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthBackground>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section with enhanced animation */}
          <div className={`text-center mb-8 transition-all duration-1000 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl mb-4 shadow-2xl transition-all duration-1000 delay-200 ${animateElements ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
              <BarChart2 className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 transition-all duration-1000 delay-400 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Exovia Analytics
            </h1>
            <p className={`text-gray-300 text-sm transition-all duration-1000 delay-600 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Join the data revolution
            </p>
          </div>

          {/* Register Card with enhanced animations */}
          <Card 
            className={`backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl transition-all duration-1000 delay-300 ${animateElements ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center gap-2">
                <User className="w-6 h-6 text-blue-400 animate-pulse" />
                Create Account
              </CardTitle>
              <CardDescription className="text-center text-gray-300">
                Start your analytics journey today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`space-y-2 transition-all duration-700 delay-400 ${animateElements ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                  <Label htmlFor="name" className="text-gray-200 flex items-center gap-2">
                    <User className="w-4 h-4 animate-bounce" />
                    Full Name
                  </Label>
                  <div className="relative group">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 group-hover:border-blue-300"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <User className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className={`space-y-2 transition-all duration-700 delay-500 ${animateElements ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                  <Label htmlFor="email" className="text-gray-200 flex items-center gap-2">
                    <Mail className="w-4 h-4 animate-bounce" />
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 group-hover:border-blue-300"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Mail className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className={`space-y-2 transition-all duration-700 delay-600 ${animateElements ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                  <Label htmlFor="password" className="text-gray-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 animate-bounce" />
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 pr-10 group-hover:border-blue-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className={`space-y-2 transition-all duration-700 delay-700 ${animateElements ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                  <Label htmlFor="confirmPassword" className="text-gray-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 animate-bounce" />
                    Confirm Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 pr-10 group-hover:border-blue-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className={`transition-all duration-700 delay-800 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-blue-500/25" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Create Account
                        <ArrowRight className="w-4 h-4 animate-pulse" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <div className={`text-sm text-center text-gray-300 transition-all duration-700 delay-1000 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                Already have an account?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline">
                  Sign in here
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Feature Highlights with enhanced animations */}
          <div className={`mt-8 grid grid-cols-3 gap-4 transition-all duration-1000 delay-500 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 transition-all duration-500 delay-600 hover:scale-105 hover:bg-white/10 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Database className="w-6 h-6 text-blue-400 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-gray-300">Upload & Analyze</p>
            </div>
            <div className={`text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 transition-all duration-500 delay-700 hover:scale-105 hover:bg-white/10 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-gray-300">Smart Insights</p>
            </div>
            <div className={`text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 transition-all duration-500 delay-800 hover:scale-105 hover:bg-white/10 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-gray-300">Secure & Private</p>
            </div>
          </div>

          {/* Interactive Status Bar */}
          <div className={`mt-6 text-center transition-all duration-1000 delay-1200 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300">Ready to Launch</span>
              <Rocket className="w-3 h-3 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
};

export default Register; 