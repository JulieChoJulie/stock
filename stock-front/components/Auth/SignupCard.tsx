import AuthCard from "@/components/auth/AuthCard"
import SignupForm from "@/components/auth/SignupForm"

const SignupCard = () => {
  return (
    <AuthCard
      loginform={false}
      head="Sign up with email"
      form={<SignupForm />}
    />
  )
}

export default SignupCard
