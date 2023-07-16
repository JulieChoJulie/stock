import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { FC } from "react";
import Link from "next/link";
import AuthHead from "./AuthHead";
import LoginGoogle from "./LoginGoogle";

type Props = {
  form: React.ReactNode;
  head: string;
  loginform: boolean;
};

const AuthCard: FC<Props> = ({ form, head, loginform }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <AuthHead heading={head} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {form}
        <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
          <hr className="border-gray-400" />
          <p className="text-center text-sm">OR</p>
          <hr className="border-gray-400" />
        </div>
        <LoginGoogle />
        {loginform ? (
          <>
            <div className="mt-5 text-xs border-b border-[#002D74] py-2 text-[#002D74]">
              Forgot your password?
            </div>

            <div className="mt-3 text-xs flex py-1 text-[#002D74]">
              <Link href="/sign-up" className="ml-1 text-blue-500">
                <p>Don&apos;t have an account?</p>
              </Link>
            </div>
          </>
        ) : (
          <div className="mt-3 text-xs flex justify-center items-center py-2 text-[#002D74]">
            <Link href="/sign-in" className="ml-1 text-blue-500">
              <p>Already have an account? </p>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthCard;
