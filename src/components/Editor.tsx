import React, { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Link as LinkIcon,
} from 'lucide-react';
import { uploadImage } from '../lib/supabase';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: attributes => ({
          width: attributes.width,
          style: `width: ${attributes.width}; cursor: nw-resize;`,
        }),
      },
    };
  },
});

const Editor = ({ content, onChange }: EditorProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [resizing, setResizing] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [startWidth, setStartWidth] = React.useState(0);
  const [selectedImage, setSelectedImage] = React.useState<HTMLImageElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Placeholder.configure({
        placeholder: 'Commencez à écrire...',
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Subscript,
      Superscript,
      Link,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none bg-background text-foreground',
      },
      handleDOMEvents: {
        mousedown: (view, event) => {
          const target = event.target as HTMLElement;
          if (target.tagName === 'IMG') {
            const image = target as HTMLImageElement;
            setSelectedImage(image);
            setResizing(true);
            setStartX(event.pageX);
            setStartWidth(image.width);
            event.preventDefault();
            return true;
          }
          return false;
        },
        mousemove: (view, event) => {
          if (resizing && selectedImage) {
            const currentX = event.pageX;
            const diffX = currentX - startX;
            const newWidth = Math.max(100, startWidth + diffX);
            selectedImage.style.width = `${newWidth}px`;
            event.preventDefault();
          }
          return false;
        },
        mouseup: () => {
          if (resizing) {
            setResizing(false);
            setSelectedImage(null);
          }
          return false;
        },
        mouseleave: () => {
          if (resizing) {
            setResizing(false);
            setSelectedImage(null);
          }
          return false;
        },
      },
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      try {
        const imageUrl = await uploadImage(file);
        editor?.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image:', error);
      }
    }
  };

  const buttons = [
    {
      icon: <Heading1 className="h-5 w-5" />,
      title: 'Titre 1',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleHeading({ level: 1 }).run();
      },
      isActive: () => editor?.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 className="h-5 w-5" />,
      title: 'Titre 2',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleHeading({ level: 2 }).run();
      },
      isActive: () => editor?.isActive('heading', { level: 2 }),
    },
    {
      icon: <Bold className="h-5 w-5" />,
      title: 'Gras',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleBold().run();
      },
      isActive: () => editor?.isActive('bold'),
    },
    {
      icon: <Italic className="h-5 w-5" />,
      title: 'Italique',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleItalic().run();
      },
      isActive: () => editor?.isActive('italic'),
    },
    {
      icon: <UnderlineIcon className="h-5 w-5" />,
      title: 'Souligné',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleUnderline().run();
      },
      isActive: () => editor?.isActive('underline'),
    },
    {
      icon: <List className="h-5 w-5" />,
      title: 'Liste à puces',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleBulletList().run();
      },
      isActive: () => editor?.isActive('bulletList'),
    },
    {
      icon: <ListOrdered className="h-5 w-5" />,
      title: 'Liste numérotée',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleOrderedList().run();
      },
      isActive: () => editor?.isActive('orderedList'),
    },
    {
      icon: <AlignLeft className="h-5 w-5" />,
      title: 'Aligner à gauche',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().setTextAlign('left').run();
      },
      isActive: () => editor?.isActive({ textAlign: 'left' }),
    },
    {
      icon: <AlignCenter className="h-5 w-5" />,
      title: 'Centrer',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().setTextAlign('center').run();
      },
      isActive: () => editor?.isActive({ textAlign: 'center' }),
    },
    {
      icon: <AlignRight className="h-5 w-5" />,
      title: 'Aligner à droite',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().setTextAlign('right').run();
      },
      isActive: () => editor?.isActive({ textAlign: 'right' }),
    },
    {
      icon: <SubscriptIcon className="h-5 w-5" />,
      title: 'Indice',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleSubscript().run();
      },
      isActive: () => editor?.isActive('subscript'),
    },
    {
      icon: <SuperscriptIcon className="h-5 w-5" />,
      title: 'Exposant',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleSuperscript().run();
      },
      isActive: () => editor?.isActive('superscript'),
    },
    {
      icon: <ImageIcon className="h-5 w-5" />,
      title: 'Insérer une image',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        imageInputRef.current?.click();
      },
    },
    {
      icon: <TableIcon className="h-5 w-5" />,
      title: 'Insérer un tableau',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      },
    },
    {
      icon: <LinkIcon className="h-5 w-5" />,
      title: 'Insérer un lien',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        const url = window.prompt('URL du lien:');
        if (url) {
          editor?.chain().focus().setLink({ href: url }).run();
        }
      },
    },
  ];

  return (
    <div className="border rounded-lg overflow-hidden border-border">
      <div className="bg-card border-b border-border p-2 flex flex-wrap gap-2">
        {buttons.map((button, index) => (
          <button
            key={index}
            onMouseDown={button.action}
            className={`p-2 rounded ${
              button.isActive?.() 
                ? 'bg-primary/10 text-primary' 
                : 'text-foreground hover:bg-muted'
            }`}
            title={button.title}
            type="button"
          >
            {button.icon}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default Editor;