const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20 py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
