"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaImage,
  FaUndo,
  FaRedo,
  FaLink,
} from "react-icons/fa";

const Tiptap = ({ value, onChange }) => {
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    immediatelyRender: false,
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  // ✅ Image upload handler
  const handleImageUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <label htmlFor="content" className="form-label">
        Content
      </label>

      <div className="editor-container">
        {/* Toolbar */}
        <div className="toolbar">
          <button onClick={() => editor.chain().focus().toggleBold().run()}>
            <FaBold />
          </button>

          <button onClick={() => editor.chain().focus().toggleItalic().run()}>
            <FaItalic />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <FaUnderline />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FaListUl />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FaListOl />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <FaQuoteRight />
          </button>

          <button type="button" onClick={() => fileInputRef.current.click()}>
            <FaImage />
          </button>

          {/* Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />

          <button
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href;
              const url = prompt("Enter URL", previousUrl);

              if (url === null) return;

              if (url === "") {
                editor.chain().focus().unsetLink().run();
                return;
              }

              editor.chain().focus().setLink({ href: url }).run();
            }}
          >
            <FaLink />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            Left
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            Center
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            Right
          </button>

          <button onClick={() => editor.chain().focus().undo().run()}>
            <FaUndo />
          </button>

          <button onClick={() => editor.chain().focus().redo().run()}>
            <FaRedo />
          </button>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default Tiptap;
