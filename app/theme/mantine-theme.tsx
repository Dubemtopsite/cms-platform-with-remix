import {
  ActionIcon,
  Button,
  Container,
  createTheme,
  Modal,
  NumberInput,
  PasswordInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import InputClasses from "~/assets/theme-css/input.module.css";
import ButtonClasses from "~/assets/theme-css/button.module.css";
import { mantineCustomColor } from "./colors";
// import { DateInput } from "@mantine/dates";

export const mantimeTheme = createTheme({
  primaryColor: "brand",
  colors: mantineCustomColor,

  fontFamily: "Noto Sans, sans-serif",
  headings: { fontFamily: "Noto Sans, sans-serif" },
  components: {
    Container: Container.extend({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      classNames: (_) => ({
        root: "container mx-auto px-4 lg:px-0",
      }),
    }),
    Button: Button.extend({
      classNames: {
        ...ButtonClasses,
        label: "!text-sm font-normal",
      },
    }),
    ActionIcon: ActionIcon.extend({
      classNames: ButtonClasses,
    }),
    TextInput: TextInput.extend({
      classNames: {
        input: InputClasses.input,
        label: InputClasses.label,
      },
    }),
    NumberInput: NumberInput.extend({
      classNames: {
        input: InputClasses.input,
        label: InputClasses.label,
      },
    }),
    Textarea: Textarea.extend({
      classNames: {
        input: InputClasses.input,
        label: InputClasses.label,
      },
    }),
    Select: Select.extend({
      classNames: {
        input: InputClasses.input,
        label: InputClasses.label,
      },
      defaultProps: {
        scrollAreaProps: {
          type: "always",
          scrollbarSize: 10,
        },
      },
    }),
    PasswordInput: PasswordInput.extend({
      classNames: {
        input: InputClasses.input,
        innerInput: InputClasses.innerInput,
        label: InputClasses.label,
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        removeScrollProps: { allowPinchZoom: true },
        lockScroll: false,
      },
    }),
  },
});
