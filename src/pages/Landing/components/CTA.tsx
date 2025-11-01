import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-700 to-blue-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Sẵn sàng nâng cao hiệu quả quản lý?
            </h2>

            <p className="text-xl text-blue-100 leading-relaxed">
              Hãy bắt đầu dùng thử EvaliaX miễn phí hôm nay. Không cần nhập thông tin thẻ tín dụng.
            </p>

            <div className="space-y-3">
              {[
                "Truy cập đầy đủ tất cả tính năng",
                "Hỗ trợ nhân viên lên đến 50 người",
                "Hỗ trợ khách hàng 24/7",
                "Nâng cấp hoặc hủy bất cứ lúc nào"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-white text-lg">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className='h-14 font-semibold'>
                Dùng thử miễn phí
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant='outline' className='h-14 font-semibold bg-white'>
                Liên hệ tư vấn
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-500 bg-opacity-10 backdrop-blur-md rounded-xl p-8 shadow-2xl">
              <p className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Gói Cơ bản</p>
              <div className="text-5xl font-bold text-white mb-2">
                0 VND
                <span className="text-2xl text-blue-100 ml-2">/tháng</span>
              </div>
              <p className="text-blue-100 mb-8">Dùng thử trong 30 ngày đầu tiên</p>

              <div className="space-y-4 mb-8 pb-8 border-b border-white border-opacity-20">
                <div className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>Đánh giá nhân viên không giới hạn</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>Lưu trữ lịch sử đánh giá</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>Báo cáo và phân tích cơ bản</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>Hỗ trợ email 24/7</span>
                </div>
              </div>

              <Button variant='outline' className='w-full h-14 font-semibold bg-white'>
                Bắt đầu ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
