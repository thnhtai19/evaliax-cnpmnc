import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/60 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/favicon.ico" alt="Logo" className="w-10 h-10 border-gray-50" />
          <span className="text-xl font-bold text-gray-900 hidden sm:inline">EvaliaX</span>
        </div>

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <a href="#features" className="text-gray-600! hover:text-gray-900! transition-colors">Tính năng</a>
          <a href="#benefits" className="text-gray-600! hover:text-gray-900! transition-colors">Lợi ích</a>
          <a href="#how-it-works" className="text-gray-600! hover:text-gray-900! transition-colors">Cách sử dụng</a>
          <a href="#testimonials" className="text-gray-600! hover:text-gray-900! transition-colors">Đánh giá</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant='ghost' className='h-10 font-semibold' onClick={() => navigate('/auth/signin')}>
            Đăng nhập
          </Button>
          <Button className='h-10 font-semibold' onClick={() => navigate('/auth/signin')}>
            Dùng thử miễn phí
          </Button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>


      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4">
          <div className="flex flex-col gap-4">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Tính năng</a>
            <a href="#benefits" className="text-gray-600 hover:text-gray-900">Lợi ích</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">Cách sử dụng</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Đánh giá</a>
            <Button variant='ghost' className='h-10 font-semibold' onClick={() => navigate('/auth/signin')}>
                Đăng nhập
              </Button>
            <Button className='h-10 font-semibold' onClick={() => navigate('/auth/signin')}>
              Dùng thử miễn phí
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
