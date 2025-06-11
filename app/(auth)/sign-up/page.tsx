import Image from "next/image";
import AuthForm from '@/components/AuthForm';
import Footer from '@/components/Footer';

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-16 py-8">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 items-center">
          {/* Left Side - Form */}
          <div className="w-full max-w-md">
            <AuthForm type="sign-up" />
          </div>

          {/* Right Side - Image */}
          <div className="hidden md:block w-full max-w-xl">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-2xl" />
              <Image
                src="/education-ai.webp"
                alt="AcharyaAI Education Platform"
                width={600}
                height={500}
                className="relative w-full h-auto"
              />
            </div>
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Join Our Learning Community</h2>
              <p className="text-muted-foreground">
                Get access to personalized courses, AI-powered assessments, and expert feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Page;