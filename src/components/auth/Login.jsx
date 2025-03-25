import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { login, validateToken } from '../../services/api';
// import toast from 'react-hot-toast';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isValid = await validateToken();
      if (isValid) {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Token validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    // if (/^\d{0,10}$/.test(value)) {
    //   setPrn(value);
    // }
    setUsername(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all fields', {
        draggable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await login(username, password);
      // console.log(response);
      
      localStorage.setItem('user', JSON.stringify({
        username: response.username,
        role: response.role
      }));

      toast.success('Login successful!', {
        draggable: true,
      });

      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.', {
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isValidating) {
    return (
      // <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-700 to-red-500 flex items-center justify-center">
      //   <div className="bg-white p-8 rounded-lg shadow-md">
      //     <p className="text-gray-600">Validating session...</p>
      //   </div>
      // </div>
      <Loading />
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-700 to-red-500 flex items-center justify-center p-6">
      <div className="w-full max-w-[1200px] bg-white rounded-[32px] flex overflow-hidden shadow-2xl">
        {/* Left Section */}
        <div className="w-1/2 bg-black p-12 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-white/80 uppercase text-sm tracking-wider mb-4">A WISE QUOTE</p>
            <h1 className="text-white text-6xl font-serif mb-6 leading-tight">
              Get<br />Everything<br />You Want
            </h1>
            <p className="text-white/80 text-lg">
              You can get everything you want if you work hard,<br />
              trust the process, and stick to the plan.
            </p>
          </div>
          <div 
            className="absolute inset-0 z-0" 
            style={{
              background: 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2340&h=2340") center/cover',
              mixBlendMode: 'color',
              opacity: 0.8
            }}
          />
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-12 flex flex-col">
          <div className="flex justify-end mb-16">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              <span className="text-xl font-medium">TnP</span>
            </div>
          </div>

          <div className="max-w-md mx-auto w-full">
            <h2 className="text-4xl font-serif mb-4">Welcome Back</h2>
            <p className="text-gray-600 mb-8">
              Enter your Username and password to access your account
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  // inputMode="numeric"
                  // pattern="[0-9]*"
                  maxLength={10}
                  value={username}
                  onChange={handleInput}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Forgot Password
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;