import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import LoginForm from "./LoginForm";
import AuthHead from "./AuthHead";

const LoginCard = () => {
 return (
    <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <AuthHead
                heading="Login to your account"
                paragraph="Don't have an account yet?"
                linkName="Sign up"
                linkUrl="/sign-up"
            />
           </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
 )
};

export default LoginCard;