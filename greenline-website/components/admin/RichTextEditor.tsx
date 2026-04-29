"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState } from "react";
import { adminApi } from "@/lib/admin-api";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
  testId,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  testId: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      data-testid={testId}
      className={`px-2.5 py-1.5 border-2 border-ink font-display font-bold text-xs uppercase tracking-wider transition-all ${
        active
          ? "bg-ink text-bone shadow-none"
          : "bg-bone text-ink hover:bg-canopy hover:shadow-brutal hover:-translate-x-[1px] hover:-translate-y-[1px]"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(`Image upload failed: ${msg}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const setLink = () => {
    const previous = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL (leave blank to remove)", previous);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1.5 p-3 bg-bone-warm border-2 border-ink border-b-0">
      <ToolbarButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        testId="editor-toolbar-bold"
      >
        B
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        testId="editor-toolbar-italic"
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        testId="editor-toolbar-h2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        testId="editor-toolbar-h3"
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        testId="editor-toolbar-bullet"
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        testId="editor-toolbar-ordered"
      >
        1. List
      </ToolbarButton>
      <ToolbarButton
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        testId="editor-toolbar-quote"
      >
        ❝
      </ToolbarButton>
      <ToolbarButton
        title="Link"
        active={editor.isActive("link")}
        onClick={setLink}
        testId="editor-toolbar-link"
      >
        Link
      </ToolbarButton>
      <ToolbarButton
        title="Insert image"
        onClick={() => fileInputRef.current?.click()}
        testId="editor-toolbar-image"
      >
        {uploading ? "Uploading…" : "Image"}
      </ToolbarButton>
      <ToolbarButton
        title="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        testId="editor-toolbar-hr"
      >
        ━━
      </ToolbarButton>
      <ToolbarButton
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        testId="editor-toolbar-undo"
      >
        ↶
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        testId="editor-toolbar-redo"
      >
        ↷
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
        data-testid="editor-image-input"
      />
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({
        placeholder: "Write your post body here…",
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none p-6 min-h-[420px] bg-white border-2 border-ink focus:outline-none prose-headings:font-display prose-headings:font-bold prose-a:text-canopy-dark",
        "data-testid": "editor-content-area",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync if parent value resets (e.g., load new post)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="border-2 border-ink p-6 bg-white min-h-[420px] text-ink/40">
        Loading editor…
      </div>
    );
  }

  return (
    <div data-testid="rich-text-editor">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
