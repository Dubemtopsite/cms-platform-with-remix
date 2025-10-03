import { Card, Divider, SegmentedControl } from "@mantine/core";
import type { Route } from "./+types/login";
import { supabase } from "~/lib/supabase";
import { useEffect, useState } from "react";
import { LoginFormComponent } from "~/component/App/LoginForm";
import { SignupFormComponent } from "~/component/App/SignupForm";
import { prisma } from "~/lib/prisma";
import { createUUID } from "~/lib/utils";
import { useNavigate } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const userId = formData.get("user_id");

  try {
    const doUserExist = await prisma.platformUser.findFirst({
      where: {
        email: email as string,
        // supabaseUid: userId as string,
      },
    });

    if (doUserExist) {
      await prisma.platformUser.update({
        where: {
          email: email as string,
          user_id: doUserExist.user_id,
        },
        data: {
          supabaseUid: userId as string,
        },
      });
      return {
        error: false,
        message:
          "User already exist. Please ensure you have confirmed your password",
      };
    }

    await prisma.platformUser.create({
      data: {
        user_id: createUUID(),
        email: email as string,
        supabaseUid: userId as string,
        // updatedAt: new Date(),
      },
    });

    return {
      error: false,
      message:
        "User profile created successfully. Please check your email address for confirmation email.",
    };
  } catch (error) {
    return {
      error: true,
      message:
        (error as any).message || "Something went wrong. Please try again",
    };
  }
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const [currentForm, setCurrentForm] = useState("login");
  const navigate = useNavigate();

  const initUser = async () => {
    const doSessionExist = await supabase.auth.getSession();
    if (doSessionExist.data.session) {
      return navigate("/editor");
    }
  };

  useEffect(() => {
    initUser();
  }, []);

  return (
    <div className="min-h-screen w-full bg-brand-300">
      <title>Login</title>
      <main className="pt-[10%]">
        <Card className="max-w-[400px] mx-auto" radius={10}>
          <h5 className="text-center text-xl font-semibold pb-2 pt-1">
            Editor {currentForm === "login" ? "Login" : "Signup"} Page
          </h5>

          <Card.Section>
            <Divider />
          </Card.Section>

          <div className="pt-4">
            <SegmentedControl
              fullWidth
              value={currentForm}
              color="brand"
              onChange={setCurrentForm}
              data={[
                { label: "Login", value: "login" },
                { label: "Signup", value: "signup" },
              ]}
            />
          </div>
          {currentForm === "login" && <LoginFormComponent />}
          {currentForm === "signup" && (
            <SignupFormComponent
              switchTab={() => {
                setCurrentForm("login");
              }}
            />
          )}
        </Card>
      </main>
    </div>
  );
}
