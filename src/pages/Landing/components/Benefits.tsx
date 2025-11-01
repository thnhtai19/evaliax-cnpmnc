import { TrendingUp, Shield, Lightbulb, Users } from 'lucide-react';

function Benefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Tiết kiệm thời gian",
      description: "Giảm thủ tục giấy tờ và tự động hóa quy trình đánh giá, tiết kiệm hàng giờ công mỗi kỳ đánh giá."
    },
    {
      icon: Users,
      title: "Phát triển nhân viên",
      description: "Cung cấp phản hồi liên tục giúp nhân viên phát triển kỹ năng và tăng hiệu quả công việc."
    },
    {
      icon: Shield,
      title: "Đánh giá công bằng",
      description: "Tạo môi trường đánh giá minh bạch và công bằng cho tất cả nhân viên trong tổ chức."
    },
    {
      icon: Lightbulb,
      title: "Quyết định dựa trên dữ liệu",
      description: "Sử dụng dữ liệu từ lịch sử đánh giá để đưa ra quyết định tuyển dụng, thăng chức chính xác."
    }
  ];

  return (
    <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Lợi ích cho doanh nghiệp
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nâng cao hiệu quả quản lý và tạo môi trường làm việc tích cực cho toàn bộ tổ chức
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 sm:p-12 border border-gray-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">80%</div>
              <p className="text-gray-600">Giảm thời gian đánh giá</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-600">Doanh nghiệp tin tưởng</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.9/5</div>
              <p className="text-gray-600">Đánh giá người dùng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Benefits;
