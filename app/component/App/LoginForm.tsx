import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppModalToast } from "~/hook/useModalToast";
import { supabase } from "~/lib/supabase";
import { LoginValidator, type LoginRequestModel } from "~/validators";

export const LoginFormComponent = () => {
  const navigate = useNavigate();
  const { openModal } = useAppModalToast();
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: yupResolver(LoginValidator),
  });

  const handleSubmit = async (values: LoginRequestModel) => {
    setIsRequestProcessing(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error || data === null || data.user === null) {
        throw new Error(
          error
            ? error.message
            : "Something went wrong while processing login request. Please try again later."
        );
      }
      await supabase.auth.setSession(data.session);
      navigate("/editor");
    } catch (error) {
      openModal({
        title: "Error",
        message: (error as any).message ?? "Something went wrong",
      });
    } finally {
      setIsRequestProcessing(false);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => handleSubmit(values))}
      className="flex flex-col gap-4 mt-2 mb-2"
      inert={isRequestProcessing}
    >
      <TextInput
        label="Email"
        type="email"
        placeholder="Enter your email address"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        key={form.key("password")}
        {...form.getInputProps("password")}
      />

      <Button
        type="submit"
        variant="filled"
        className="!w-full"
        loading={isRequestProcessing}
      >
        Login to continue
      </Button>
    </form>
  );
};
