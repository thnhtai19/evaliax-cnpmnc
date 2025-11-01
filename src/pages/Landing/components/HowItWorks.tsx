import { Button } from '@/components/ui/button';
import { LogIn, User, FileText, BarChart3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HowItWorks() {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: LogIn,
      number: "01",
      title: "Đăng nhập hệ thống",
      description: "Truy cập hệ thống EvaliaX bằng tài khoản công ty của bạn trong chỉ vài giây."
    },
    {
      icon: User,
      number: "02",
      title: "Chọn nhân viên và tiêu chí",
      description: "Lựa chọn nhân viên cần đánh giá và các tiêu chí đánh giá phù hợp với vai trò công việc."
    },
    {
      icon: FileText,
      number: "03",
      title: "Thực hiện đánh giá",
      description: "Hoàn thành đánh giá với giao diện trực quan và dễ sử dụng trong vài phút mà không gây căng thẳng."
    },
    {
      icon: BarChart3,
      number: "04",
      title: "Xem báo cáo & phân tích",
      description: "Nhận báo cáo chi tiết, biểu đồ tiến bộ và những insight hữu ích để hỗ trợ quyết định quản lý."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Cách sử dụng đơn giản
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chỉ 4 bước đơn giản để bắt đầu đánh giá hiệu suất nhân viên của bạn
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index}>
                <div className="flex gap-8 items-start">
                  <div className="flex-shrink-0 relative">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl blur-lg opacity-30"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <Icon className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <div className="text-5xl font-bold text-gray-200">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="ml-10 my-6 h-12 flex items-center">
                    <div className="w-1 h-full bg-gradient-to-b from-blue-400 to-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Button className="h-12 font-semibold" onClick={() => navigate('/auth/signin')}>
            Bắt đầu ngay bây giờ
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
