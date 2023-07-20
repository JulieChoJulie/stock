import AuthCard from "./AuthCard";
import SignupForm from "./SignupForm";

const SignupCard = () => {
  return (
    <AuthCard
      loginform={false}
      head="Sign up with email"
      form={<SignupForm />}
    />
  );
};

export default SignupCard;
