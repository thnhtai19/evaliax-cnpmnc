import { Clock, CheckCircle, BarChart3, Target } from 'lucide-react';

function Features() {
  const features = [
    {
      icon: Clock,
      title: "Đánh giá linh hoạt theo chu kỳ",
      description: "Lựa chọn thời gian đánh giá phù hợp: 2 tuần, tháng, quý hoặc năm. Hoàn toàn tùy chỉnh theo nhu cầu công ty.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Target,
      title: "Tiêu chí đánh giá đa dạng",
      description: "Chọn từ hơn 50 tiêu chí đánh giá hoặc tạo tiêu chí riêng phù hợp với mục tiêu công việc từng vị trí.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: BarChart3,
      title: "Lịch sử và phân tích chi tiết",
      description: "Lưu trữ toàn bộ lịch sử đánh giá và xem biểu đồ tiến bộ của nhân viên theo thời gian một cách trực quan.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: CheckCircle,
      title: "Báo cáo và hỗ trợ quyết định",
      description: "Tạo báo cáo chi tiết, so sánh hiệu suất giữa các nhân viên và đội ngũ để hỗ trợ ra quyết định quản lý.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tất cả những gì bạn cần để quản lý hiệu suất nhân viên một cách hiệu quả và chuyên nghiệp
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
