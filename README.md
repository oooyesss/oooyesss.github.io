import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, Replace, Save, Undo, Redo, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdvancedTextEditor = () => {
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState('16px');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [isReplaceDialogOpen, setIsReplaceDialogOpen] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const visualEditorRef = useRef(null);
  const htmlEditorRef = useRef(null);

  useEffect(() => {
    if (visualEditorRef.current) {
      visualEditorRef.current.innerHTML = content;
    }
  }, [content]);

  const applyStyle = (style, value = null) => {
    document.execCommand(style, false, value);
    updateContent();
  };

  const handleChange = (setter) => (e) => setter(e.target.value);

  const changeColor = (e) => {
    const color = e.target.value;
    setTextColor(color);
    applyStyle('foreColor', color);
  };

  const changeFontSize = (e) => {
    const size = e.target.value;
    setFontSize(size);
    applyStyle('fontSize', size);
  };

  const batchReplace = (isHtmlEditor = false) => {
    const newContent = (isHtmlEditor ? htmlContent : visualEditorRef.current.innerHTML).replace(new RegExp(findText, 'g'), replaceText);
    setContent(newContent);
    setHtmlContent(newContent);
  };

  const updateContent = () => {
    if (visualEditorRef.current) {
      const newContent = visualEditorRef.current.innerHTML;
      setUndoStack([content, ...undoStack]);
      setRedoStack([]);
      setContent(newContent);
      setHtmlContent(newContent);
    }
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousContent = undoStack.shift();
      setRedoStack([content, ...redoStack]);
      setContent(previousContent);
      setHtmlContent(previousContent);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack.shift();
      setUndoStack([content, ...undoStack]);
      setContent(nextContent);
      setHtmlContent(nextContent);
    }
  };

  const insertImage = (url) => {
    if (visualEditorRef.current) {
      const imgHtml = `<img src="${url}" alt="Image" />`;
      const range = window.getSelection().getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createRange().createContextualFragment(imgHtml));
      updateContent();
    }
  };

  const DialogComponent = ({ title, value, onChange, onConfirm }) => (
    <Dialog open={isReplaceDialogOpen} onOpenChange={setIsReplaceDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsReplaceDialogOpen(true)}>{title === 'Insert Image' ? <Image size={16} /> : <Replace size={16} />}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder={title === 'Insert Image' ? "Image URL" : "Find"}
            value={value}
            onChange={onChange}
            className="w-full"
          />
        </div>
        <Button onClick={onConfirm}>{title === 'Insert Image' ? 'Insert' : 'Replace All'}</Button>
        <Button onClick={() => setIsReplaceDialogOpen(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="w-full max-w-4xl mx-auto h-screen flex flex-col">
      <div className="bg-gray-100 p-4 border-b">
        <div className="flex flex-wrap gap-2">
          {['bold', 'italic', 'underline', 'strikeThrough'].map((style) => (
            <Button key={style} onClick={() => applyStyle(style)}>
              {React.createElement({
                bold: <Bold size={16} />,
                italic: <Italic size={16} />,
                underline: <Underline size={16} />,
                strikeThrough: <Strikethrough size={16} />,
              }[style])}
            </Button>
          ))}
          {['justifyLeft', 'justifyCenter', 'justifyRight'].map((align) => (
            <Button key={align} onClick={() => applyStyle(align)}>
              {React.createElement({
                justifyLeft: <AlignLeft size={16} />,
                justifyCenter: <AlignCenter size={16} />,
                justifyRight: <AlignRight size={16} />,
              }[align])}
            </Button>
          ))}
          <Input
            type="color"
            value={textColor}
            onChange={changeColor}
            className="w-10 h-10 p-1 rounded"
          />
          <select value={fontSize} onChange={changeFontSize} className="border rounded p-2">
            {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 48, 64].map(size => (
              <option key={size} value={`${size}px`}>{size}px</option>
            ))}
          </select>
          <Button onClick={undo}><Undo size={16} /></Button>
          <Button onClick={redo}><Redo size={16} /></Button>
          <DialogComponent
            title="Find and Replace"
            value={findText}
            onChange={handleChange(setFindText)}
            onConfirm={() => batchReplace(false)}
          />
          <DialogComponent
            title="Insert Image"
            value={htmlContent}
            onChange={handleChange(setHtmlContent)}
            onConfirm={() => insertImage(htmlContent)}
          />
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <Tabs defaultValue="visual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual">Visual Editor</TabsTrigger>
            <TabsTrigger value="html">HTML Editor</TabsTrigger>
          </TabsList>
          <TabsContent value="visual">
            <div
              ref={visualEditorRef}
              className="min-h-[400px] p-2 border-r border-l"
              contentEditable
              onInput={updateContent}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </TabsContent>
          <TabsContent value="html">
            <Textarea
              ref={htmlEditorRef}
              value={htmlContent}
              onChange={handleChange(setHtmlContent)}
              className="min-h-[400px] font-mono w-full resize-none"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedTextEditor;
