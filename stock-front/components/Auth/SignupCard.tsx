import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignupForm from "./SignupForm";
import AuthHead from "./AuthHead";

const SignupCard = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <AuthHead
            heading="Sign up with email"
            paragraph="Already have an account? "
            linkName="Log in"
            linkUrl="/sign-in"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <SignupForm />
      </CardContent>
    </Card>
  );
};

export default SignupCard;
