const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute inset-0">
      <div
        className="h-full max-w-2xl mx-auto flex flex-col items-center 
      justify-center pb-20"
      >
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
