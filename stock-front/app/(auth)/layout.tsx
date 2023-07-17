const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  // return (
  //     <div className="flex items-center justify-center h-full w-full">
  //         <div className="w-6/12">
  //         {children}
  //         </div>
  //     </div>
  // );
  return (
    <div className="min-h-full h-fit flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">{children}</div>
    </div>
  );
};

export default AuthLayout;
