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
            <div className="mt-5 text-xs border-b border-[#002D74] py-4 text-[#002D74]">
              Forgot your password?
            </div>

            <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
              <p>Don&apos;t have an account?</p>
              <button
                type="button"
                className="py-2 px-5 bg-white border rounded-xl hover:scale-102 duration-300"
              >
                <Link href="/sign-up">Register</Link>
              </button>
            </div>
          </>
        ) : (
          <div className="mt-3 text-xs flex justify-between items-center py-4 text-[#002D74]">
            <p>Already have an account?</p>
            <button
              type="button"
              className="py-2 px-5 bg-white border rounded-xl hover:scale-102 duration-300"
            >
              <Link href="/sign-in">Sign in with email</Link>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthCard;
