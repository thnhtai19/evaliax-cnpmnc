import { Mail, MapPin, Phone } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/favicon.ico" alt="Logo" className="w-8 h-8 border-gray-50" />
              <span className="text-lg font-bold text-white">EvaliaX</span>
            </div>
            <p className="text-sm text-gray-400">
              Công cụ đánh giá hiệu suất nhân viên hiện đại cho các nhà quản lý chuyên nghiệp.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Sản phẩm</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-gray-400! hover:text-white! transition-colors">Tính năng</a></li>
              <li><a href="#how-it-works" className="text-gray-400! hover:text-white! transition-colors">Cách sử dụng</a></li>
              <li><a href="#" className="text-gray-400! hover:text-white! transition-colors">Bảng giá</a></li>
              <li><a href="#" className="text-gray-400! hover:text-white! transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Công ty</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400! hover:text-white! transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="text-gray-400! hover:text-white! transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400! hover:text-white! transition-colors">Tuyển dụng</a></li>
              <li><a href="#" className="text-gray-400! hover:text-white! transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:support@evaliax.com" className="text-gray-400! hover:text-white! transition-colors">
                  support@evaliax.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:+84123456789" className="text-gray-400! hover:text-white! transition-colors">
                  +84 (123) 456-789
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-sm text-gray-400">
              <p>© 2025 EvaliaX. All rights reserved.</p>
            </div>

            <div className="flex flex-wrap gap-6 md:justify-end text-sm">
              <a href="#" className="text-gray-400! hover:text-white! transition-colors">Chính sách bảo mật</a>
              <a href="#" className="text-gray-400! hover:text-white! transition-colors">Điều khoản dịch vụ</a>
              <a href="#" className="text-gray-400! hover:text-white! transition-colors">Cookie</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
