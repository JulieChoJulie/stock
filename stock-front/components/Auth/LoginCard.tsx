import AuthCard from "./AuthCard";
import LoginForm from "./LoginForm";

const LoginCard = () => {
  return (
    <AuthCard loginform head="Login to your account" form={<LoginForm />} />
  );
};

export default LoginCard;
