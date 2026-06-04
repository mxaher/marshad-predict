import { FC } from 'hono/jsx';
import Layout from '../layout';

interface LoginPageProps {
  lang: 'ar' | 'en';
  error?: string;
  mode?: 'login' | 'register';
  departments?: string[] | { ar: string; en: string }[];
}

const LoginPage: FC<LoginPageProps> = ({ lang, error, mode, departments }) => {
  const isLogin = mode !== 'register';

  return (
    <Layout lang={lang} title={lang === 'ar' ? (isLogin ? 'دخول' : 'تسجيل') : (isLogin ? 'Login' : 'Register')}>
      <div class="max-w-md mx-auto mt-12">
        <div class="bg-card-bg border border-card-border rounded-2xl p-8 shadow-xl">
          <div class="text-center mb-6">
            <span class="text-4xl">⚽</span>
            <h2 class="text-2xl font-bold text-white mt-2">
              {isLogin
                ? (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')
                : (lang === 'ar' ? 'إنشاء حساب' : 'Create Account')}
            </h2>
            <p class="text-gray-400 text-sm mt-1">
              {lang === 'ar' ? 'كأس العالم 2026 — توقع النتائج واربح!' : 'World Cup 2026 — Predict & Win!'}
            </p>
          </div>

          {error && (
            <div class="bg-red-600/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form action={isLogin ? '/login' : '/register'} method="post" class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">
                {lang === 'ar' ? 'اسم المستخدم' : 'Username'}
              </label>
              <input
                type="text"
                name="username"
                required
                class="w-full bg-darkbg border border-card-border rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-all"
                placeholder={lang === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
              />
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-1">
                {lang === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                name="password"
                required
                minlength={6}
                class="w-full bg-darkbg border border-card-border rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-all"
                placeholder={lang === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">
                    {lang === 'ar' ? 'الاسم المعروض' : 'Display Name'}
                  </label>
                  <input
                    type="text"
                    name="display_name"
                    required
                    class="w-full bg-darkbg border border-card-border rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-all"
                    placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                  />
                </div>

                <div>
                  <label class="block text-sm text-gray-400 mb-1">
                    {lang === 'ar' ? 'القسم' : 'Department'}
                  </label>
                  <select
                    name="department"
                    required
                    class="w-full bg-darkbg border border-card-border rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all"
                  >
                    <option value="">{lang === 'ar' ? 'اختر القسم' : 'Select department'}</option>
                    {(departments || [
                      { ar: 'المالية', en: 'Finance' },
                      { ar: 'الأصول العقارية', en: 'Real Estate' },
                      { ar: 'الاستراتيجية', en: 'Strategy' },
                      { ar: 'التقنية', en: 'IT' },
                      { ar: 'الأمن السيبراني', en: 'Cybersecurity' },
                      { ar: 'رأس المال البشري', en: 'Human Capital' },
                      { ar: 'الاستثمار', en: 'Investment' },
                      { ar: 'المشاريع', en: 'Projects' },
                      { ar: 'إدارة المرافق', en: 'Facilities Management' },
                    ]).map(d => (
                      <option value={typeof d === 'string' ? d : d.en}>{typeof d === 'string' ? d : (lang === 'ar' ? d.ar : d.en)}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              class="w-full bg-primary hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors text-lg"
            >
              {isLogin
                ? (lang === 'ar' ? 'دخول' : 'Sign In')
                : (lang === 'ar' ? 'تسجيل' : 'Register')}
            </button>
          </form>

          <div class="mt-4 text-center text-sm">
            {isLogin ? (
              <p class="text-gray-500">
                {lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                <a href="/register" class="text-accent hover:text-yellow-400">
                  {lang === 'ar' ? 'سجل الآن' : 'Register here'}
                </a>
              </p>
            ) : (
              <p class="text-gray-500">
                {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                <a href="/login" class="text-accent hover:text-yellow-400">
                  {lang === 'ar' ? 'سجل دخول' : 'Sign in'}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
