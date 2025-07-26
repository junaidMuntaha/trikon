import { Link } from 'react-router-dom'
import {
  Video,
  FileText,
  Calendar,
  UserCheck,
} from 'lucide-react' // Lucide icons (optional)

const CourseCard = ({ course }) => {
  const price = course?.price ?? 0
  const discountedPrice = Math.floor(price * 1.2)
  const discountPercent = price
    ? Math.round(((discountedPrice - price) / discountedPrice) * 100)
    : 0

  return (
    <div className="course-card flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300">
      <div className="relative">
        <img
          src={course?.thumbnail_url || '/placeholder.jpg'}
          alt={course?.title || 'কোর্স শিরোনাম'}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        <div className="absolute top-4 left-3 right-3 flex justify-between items-center">
          <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {course?.department || 'ডিপার্টমেন্ট'}
          </span>
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              {discountPercent}% ছাড়
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 my-1">
          <Link
            to={`/course/${course?.id}`}
            className="hover:text-indigo-600 transition-colors"
          >
            {course?.title || 'কোর্সের নাম'}
          </Link>
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-gray-600 text-sm my-3 py-3 border-y">
          <div>
            <Video className="mx-auto text-indigo-400 mb-1" size={18} />
            <p>{course?.total_classes ?? 0} ক্লাস</p>
          </div>
          <div>
            <FileText className="mx-auto text-indigo-400 mb-1" size={18} />
            <p>{course?.total_exams ?? 0} পরীক্ষা</p>
          </div>
          <div>
            <Calendar className="mx-auto text-indigo-400 mb-1" size={18} />
            <p>{course?.duration ?? 0} মাস</p>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-2 text-center mb-4 text-sm font-semibold text-indigo-800">
          <UserCheck className="inline-block text-indigo-500 mr-1" size={16} />
          {course?.enrolled ?? 0} জন ভর্তি হয়েছে
        </div>

        <div className="flex items-baseline gap-2 justify-center mb-4">
          <span className="text-2xl font-bold text-gray-900">৳{price}</span>
          {price > 0 && (
            <span className="text-md font-medium text-gray-400 line-through">
              ৳{discountedPrice}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Link
            to={`/course/${course?.id}`}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-center py-2.5 rounded-lg font-semibold"
          >
            কোর্স বিবরণ
          </Link>
          <Link
            to={`/course/${course?.id}#enroll`}
            className="bg-indigo-600 text-white hover:bg-indigo-700 text-center py-2.5 rounded-lg font-semibold"
          >
            ভর্তি হোন
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
