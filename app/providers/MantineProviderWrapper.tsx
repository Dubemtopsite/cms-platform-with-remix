"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { mantimeTheme } from "~/theme/mantine-theme";

export default function MantineProviderWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MantineProvider theme={mantimeTheme}>
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}
