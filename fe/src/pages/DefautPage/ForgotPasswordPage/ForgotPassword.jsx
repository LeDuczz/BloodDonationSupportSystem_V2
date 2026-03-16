import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import OtpInput from '../../../components/OTPInput';


export default function ForgotPasswordPage() {
  const [account, setAccount] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  // Xác thực email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Xác thực số điện thoại
  const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  // Xác định loại tài khoản (email hoặc số điện thoại)
  const getAccountType = (account) => {
    if (validatePhone(account)) {
      return 'phone';
    } else if (validateEmail(account)) {
      return 'email';
    }
    return null;
  };

  // Xử lý quay lại trang đăng nhập
  const handleClickSignin = () => {
    navigate('/signin')
  };

  // Xử lý khôi phục mật khẩu bằng Google
  const handleRecoverWithGoogle = () => {
    // Xử lý khôi phục mật khẩu với Google ở đây
    alert('Khôi phục mật khẩu với Google');
  };

  // Xử lý gửi yêu cầu reset mật khẩu
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    const newErrors = {};
    const accountType = getAccountType(account);

    if (!account) {
      newErrors.account = 'Vui lòng nhập email hoặc số điện thoại';
    } else if (!accountType) {
      newErrors.account = 'Email hoặc số điện thoại không hợp lệ';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Xử lý thành công
        setIsSubmitted(true);
        
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu:', error);
        setErrors({ account: 'Có lỗi xảy ra, vui lòng thử lại' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Xử lý gửi lại mã
  const handleResendCode = () => {
    setIsSubmitted(false);
    setAccount('');
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Kiểm tra tin nhắn
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Chúng tôi đã gửi mã xác thực đến
            </p>
            <p className="mt-1 text-center text-lg font-semibold text-blue-600">
              {getAccountType(account) === 'phone' ? `Số điện thoại: ${account}` : `Email: ${account}`}
            </p>
          </div>
           <OtpInput/>
          <div className="mt-8 space-y-6">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="text-sm text-blue-700">
                <p className="font-medium">Hướng dẫn:</p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>
                    {getAccountType(account) === 'phone' 
                      ? 'Kiểm tra tin nhắn SMS trên điện thoại' 
                      : 'Kiểm tra hộp thư email của bạn'
                    }
                  </li>
                  <li>Nhập mã xác thực để tạo mật khẩu mới</li>
                  <li>Mã có hiệu lực trong 5 phút</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendCode}
                className="group relative flex w-full justify-center rounded-md border border-blue-600 bg-white py-2 px-4 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Gửi lại mã xác thực
              </button>

              <button
                onClick={handleClickSignin}
                className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập email hoặc số điện thoại để nhận mã xác thực
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                Email hoặc số điện thoại
              </label>
              <div className="mt-1">
                <input
                  id="account"
                  name="account"
                  type="text"
                  autoComplete="email tel"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className={`block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                    errors.account ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Email hoặc số điện thoại"
                  disabled={isLoading}
                />
              </div>
              {errors.account && (
                <p className="mt-2 text-sm text-red-600">{errors.account}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </span>
              ) : (
                <span className="flex items-center">
                  Gửi mã xác thực
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Bạn đã nhớ mật khẩu?</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleClickSignin}
              type="button"
              className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}