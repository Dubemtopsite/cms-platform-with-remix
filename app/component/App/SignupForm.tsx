import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { useAppModalToast } from "~/hook/useModalToast";
import { supabase } from "~/lib/supabase";
import { RegisterValidator, type RegisterRequestModel } from "~/validators";

export const SignupFormComponent = ({
  switchTab,
}: {
  switchTab: () => void;
}) => {
  const fetcher = useFetcher();
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);

  const { openModal } = useAppModalToast();
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validate: yupResolver(RegisterValidator),
  });

  useEffect(() => {
    handleFetcherRequest();
  }, [fetcher]);

  const handleFetcherRequest = () => {
    if (fetcher.state === "idle" && fetcher.data && fetcher.data.error) {
      openModal({
        title: "Signup Error",
        message: fetcher.data.message,
      });
    } else if (
      fetcher.state === "idle" &&
      fetcher.data &&
      !fetcher.data.error
    ) {
      openModal({
        title: "Signup Success",
        message: fetcher.data.message,
      });
      switchTab();
    }
  };

  const handleSubmit = async (values: RegisterRequestModel) => {
    setIsRequestProcessing(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
          },
        },
      });
      if (error || data === null || data.user === null) {
        throw new Error(
          error
            ? error.message
            : "Something went wrong while signing up. Please try again."
        );
      }

      if (!data.user.identities || data.user.identities.length === 0) {
        throw new Error(
          "User already exist. Please try another email or proceed to sign in"
        );
      }

      await fetcher.submit(
        { email: values.email, user_id: data.user.id },
        { method: "post" }
      );
    } catch (error) {
      openModal({
        title: "Signup Error",
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
        label="First name"
        placeholder="Enter your first name"
        key={form.key("first_name")}
        {...form.getInputProps("first_name")}
      />
      <TextInput
        label="Last name"
        placeholder="Enter your last name"
        key={form.key("last_name")}
        {...form.getInputProps("last_name")}
      />
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

      <PasswordInput
        label="Confirm password"
        placeholder="Re-enter your password"
        key={form.key("confirm_password")}
        {...form.getInputProps("confirm_password")}
      />

      <Button
        type="submit"
        variant="filled"
        className="!w-full"
        loading={isRequestProcessing}
      >
        Sign up to continue
      </Button>
    </form>
  );
};
