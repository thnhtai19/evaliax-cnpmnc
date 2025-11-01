import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();
  
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-0 h-full lg:h-screen h-auto-4xl flex flex-col items-center justify-center relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Giải pháp quản lý hiệu suất toàn diện
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Công cụ Đánh giá Hiệu suất Nhân viên
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Giúp Nhà quản lý và Trưởng nhóm dễ dàng theo dõi, đánh giá và cải thiện hiệu quả công việc của nhân viên. Quản lý hiệu suất không bao giờ dễ dàng như vậy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className='h-14' onClick={() => navigate('/auth/signin')}>
                <div className='font-bold'>Bắt đầu đánh giá ngay</div>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant='outline' className='h-14 flex items-center justify-center gap-2 px-8'>
                <Play className="w-5 h-5" />
               <div className='font-bold'>Xem demo</div>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 pt-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Không cần cài đặt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Bắt đầu miễn phí</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-400/40 to-indigo-600/40 rounded-2xl blur-3xl opacity-30 -z-10"></div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Hiệu suất tuần này</h3>
                  <p className="text-sm text-gray-500">Cập nhật lúc 09:20 AM</p>
                </div>

                <div className="relative pt-4">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 w-[78%] bg-linear-to-r from-blue-200 to-blue-600 rounded-full"></div>
                  </div>
                  <div className="mt-2 text-right text-sm text-gray-700 font-medium">78%</div>
                </div>

                <div className="flex justify-between items-center text-center">
                  <div>
                    <p className="text-2xl font-bold">124</p>
                    <p className="text-sm text-gray-500">Đánh giá</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">8.9</p>
                    <p className="text-sm text-gray-500">Điểm TB</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">12</p>
                    <p className="text-sm text-gray-500">Hoàn thành</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
