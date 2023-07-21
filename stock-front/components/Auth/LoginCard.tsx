import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

const LoginCard = () => {
  return (
    <AuthCard loginform head="Login to your account" form={<LoginForm />} />
  );
};

export default LoginCard;
