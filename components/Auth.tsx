import React, { useState } from 'react';
import Logo from './Logo';
import { Icons } from './Icon';
import { supabase } from '../utils/supabaseClient';

interface AuthProps {
  onLogin: (session: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only used for registration metadata if needed in future
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // onLogin will be triggered by the session state change listener in App.tsx 
        // usually, or we can pass the session up directly if we want explicit control.
        // But the App.tsx likely listens to onAuthStateChange. 
        // For now, to match the prop signature locally before refactoring App.tsx completely:
        if (data.session) onLogin(data.session);

      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          onLogin(data.session);
        } else if (data.user) {
          alert('Registration successful! Please check your email to verify your account.');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      alert(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Neumorphic Styles for #4F373B Theme
  const cardStyle = {
    background: '#4F373B',
    boxShadow: '20px 20px 60px #352528, -20px -20px 60px #69494e',
    borderRadius: '40px'
  };

  const inputStyle = {
    background: '#4F373B',
    boxShadow: 'inset 6px 6px 12px #352528, inset -6px -6px 12px #69494e',
    border: 'none',
    color: '#ECEDE5'
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#506467]">

      {/* Animated Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#352528] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#69494e] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-[20%] w-[50vw] h-[50vw] bg-[#3d4c4e] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div
        className="relative z-10 w-full max-w-md mx-4 transform transition-all duration-500"
      >
        {/* Neumorphic Card */}
        <div
          className="p-10 relative z-20"
          style={cardStyle}
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6 group">
              <div className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: '10px 10px 20px #352528, -10px -10px 20px #69494e',
                  background: '#4F373B'
                }}>
              </div>
              <Logo className="w-24 h-24 relative z-10 rounded-full" variant='icon' />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#ECEDE5] mb-1 drop-shadow-md text-center">
              orchestrio<span className="text-[#C16845]">.in</span>
            </h1>
            <p className="text-[#ECEDE5]/40 text-xs font-bold tracking-[0.2em] uppercase">
              Secure Prompt Vault
            </p>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-[#ECEDE5]/80">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-[#ECEDE5]/40 mt-2">
              {isLogin ? 'Sign in to access your vault' : 'Sign up to start secruing your prompts'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="group">
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ECEDE5]/30 group-focus-within:text-[#C16845] transition-colors">
                    <Icons.User size={18} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-2xl py-4 pl-14 pr-6 text-[#ECEDE5] placeholder-[#ECEDE5]/20 focus:outline-none transition-all"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            <div className="group">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ECEDE5]/30 group-focus-within:text-[#C16845] transition-colors">
                  <Icons.Bot size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full rounded-2xl py-4 pl-14 pr-6 text-[#ECEDE5] placeholder-[#ECEDE5]/20 focus:outline-none transition-all"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="group">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ECEDE5]/30 group-focus-within:text-[#C16845] transition-colors">
                  <Icons.Key size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-2xl py-4 pl-14 pr-6 text-[#ECEDE5] placeholder-[#ECEDE5]/20 focus:outline-none transition-all"
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 rounded-2xl font-bold text-[#ECEDE5] relative overflow-hidden group transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                background: '#4F373B',
                boxShadow: '8px 8px 16px #352528, -8px -8px 16px #69494e', // Outset shadow
              }}
            >
              <div className="absolute inset-0 bg-[#C16845] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <span className="relative z-10 group-hover:text-[#C16845] transition-colors flex items-center gap-2">
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                {!loading && <Icons.ArrowRight size={18} />}
              </span>
            </button>
          </form>

          {/* Toggle Footer */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold tracking-widest text-[#ECEDE5]/30 hover:text-[#C16845] uppercase transition-colors"
            >
              {isLogin ? "Create New Account" : "I have an account"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Auth;