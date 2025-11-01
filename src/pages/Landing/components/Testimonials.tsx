import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Testimonials() {
  const navigate = useNavigate();
  
  const testimonials = [
    {
      name: "Nguyễn Văn An",
      title: "Giám đốc Nhân sự",
      company: "Tech Solutions Vietnam",
      avatar: "NA",
      rating: 5,
      text: "EvaliaX đã giúp chúng tôi tiết kiệm 40 giờ làm việc mỗi quý. Quy trình đánh giá trở nên minh bạch và công bằng hơn."
    },
    {
      name: "Trần Thị Bích",
      title: "Trưởng nhóm Marketing",
      company: "Creative Agency Plus",
      avatar: "TB",
      rating: 5,
      text: "Giao diện rất thân thiện, tôi có thể hoàn thành đánh giá trong 5 phút. Nhân viên của tôi cũng thích nhận phản hồi qua hệ thống này."
    },
    {
      name: "Đỗ Quốc Hưng",
      title: "Giám đốc Điều hành",
      company: "Manufacturing Corp",
      avatar: "DQ",
      rating: 5,
      text: "Báo cáo chi tiết và dữ liệu phân tích giúp chúng tôi đưa ra quyết định tuyển dụng và thăng chức chính xác hơn."
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Đánh giá từ người dùng
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hơn 500 doanh nghiệp đã tin tưởng EvaliaX để quản lý hiệu suất
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 text-lg mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                  <p className="text-xs text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-gray-600 mb-2">Đánh giá trung bình</p>
              <div className="flex items-end gap-4">
                <div className="text-5xl font-bold text-gray-900">4.9</div>
                <div className="flex gap-1 pb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Từ 500+ đánh giá</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-gray-600 mb-4">Hãy trở thành một phần của cộng đồng</p>
              <Button className='h-12 font-semibold' onClick={() => navigate('/auth/signin')}>
                Bắt đầu dùng thử miễn phí
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
