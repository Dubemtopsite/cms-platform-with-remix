"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useRef } from "react";

interface EditorProps {
  editorType?: "FULL" | "QUESTION" | "OPTION" | "CORRECTION" | "COMMENT";
  onChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  label?: string;
  error?: string;
}

function GeneralEditor(props: EditorProps) {
  const editorConfig = useRef({
    toolbar: {
      items: [
        "bold",
        "italic",
        "link",
        "undo",
        "redo",
        "math",
        "uploadImage",
        "alignment",
        "highlight",
        "bulletedList",
        "numberedList",
      ],
    },
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "linkImage",
      ],
    },
    math: {
      engine: "mathjax",
      lazyLoad: undefined,
      outputType: "span",
      forceOutputType: false,
      enablePreview: true,
    },
    height: "600px",
    allowedContent: true,
  });

  const questionEditorConfig = useRef({
    toolbar: {
      items: [
        "bold",
        "underline",
        "italic",
        "undo",
        "redo",
        "alignment",
        "bulletedList",
        "numberedList",
        "math",
        "uploadImage",
      ],
    },
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "linkImage",
      ],
    },
    math: {
      engine: "mathjax",
      lazyLoad: undefined,
      outputType: "span",
      forceOutputType: false,
      enablePreview: true,
    },
    height: 400,
    allowedContent: true,
  });

  const optionEditorConfig = useRef({
    toolbar: {
      items: ["bold", "underline", "italic", "undo", "redo", "math"],
    },
    math: {
      engine: "mathjax",
      lazyLoad: undefined,
      outputType: "span",
      forceOutputType: false,
      enablePreview: true,
    },
    height: 100,
    allowedContent: true,
  });

  const correctionEditorConfig = useRef({
    toolbar: {
      items: [
        "bold",
        "italic",
        "undo",
        "redo",
        "math",
        "alignment",
        "uploadImage",
      ],
    },
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "linkImage",
      ],
    },
    math: {
      engine: "mathjax",
      lazyLoad: undefined,
      outputType: "span",
      forceOutputType: false,
      enablePreview: true,
    },
    height: 200,
    allowedContent: true,
  });

  const commentEditorConfig = useRef({
    toolbar: {
      items: [
        "bold",
        "italic",
        "undo",
        "redo",
        "math",
        "alignment",
        "uploadImage",
      ],
    },
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "linkImage",
      ],
    },
    math: {
      engine: "mathjax",
      lazyLoad: undefined,
      outputType: "span",
      forceOutputType: false,
      enablePreview: true,
    },
    height: 200,
    allowedContent: true,
  });

  const getEditorConfig = () => {
    switch (props.editorType) {
      case "FULL":
        return editorConfig.current;
      case "QUESTION":
        return questionEditorConfig.current;
      case "CORRECTION":
        return correctionEditorConfig.current;
      case "OPTION":
        return optionEditorConfig.current;
      case "COMMENT":
        return commentEditorConfig.current;
      default:
        return editorConfig.current;
    }
  };

  return (
    <div>
      {props.label && <p className="pb-2 text-sm">{props.label}</p>}
      <div className="editor-container editor-container_classic-editor">
        <CKEditor
          editor={ClassicEditor}
          config={{
            ...getEditorConfig(),
            shouldNotGroupWhenFull: true,
            placeholder:
              props.placeholder ?? "Type or paste your content here!",
          }}
          data={props.value}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          // onReady={(editor: any) => {
          //   // You can store the "editor" and use when it is needed.
          //   console.log("Editor is ready to use!", editor);
          // }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(_: any, editor: { getData: () => string }) => {
            if (props.onChange) props.onChange(editor.getData());
          }}
          //   onBlur={(event, editor) => {
          //     console.log("Blur.", editor);
          //   }}
          //   onFocus={(event, editor) => {
          //     console.log("Focus.", editor);
          //   }}
        />
      </div>
      {props.error && <p className="text-red-500 text-sm">{props.error}</p>}
    </div>
  );
}

export default GeneralEditor;
