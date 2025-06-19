interface AuthHeaderProps {
    title?: string;
  }
  
  export default function AuthHeader({
    title = "Welcome to AcharyaAI",
  }: AuthHeaderProps) {
    return (
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-600">
          Your AI-powered interview preparation platform
        </p>
      </div>
    );
  }
  