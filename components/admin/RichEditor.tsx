'use client';

import { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Image, 
  Link, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Quote,
  Undo,
  Redo
} from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichEditor({ 
  value, 
  onChange, 
  placeholder = '내용을 입력하세요...', 
  className = '' 
}: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  // 에디터 명령 실행
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgSrc = e.target?.result as string;
        executeCommand('insertImage', imgSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  // 링크 삽입
  const insertLink = () => {
    const url = prompt('링크 URL을 입력하세요:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  // 에디터 내용 변경 처리
  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: '굵게' },
    { icon: Italic, command: 'italic', title: '기울임' },
    { icon: Underline, command: 'underline', title: '밑줄' },
    { icon: List, command: 'insertUnorderedList', title: '글머리 기호' },
    { icon: ListOrdered, command: 'insertOrderedList', title: '번호 매기기' },
    { icon: AlignLeft, command: 'justifyLeft', title: '왼쪽 정렬' },
    { icon: AlignCenter, command: 'justifyCenter', title: '가운데 정렬' },
    { icon: AlignRight, command: 'justifyRight', title: '오른쪽 정렬' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: '인용구' },
    { icon: Undo, command: 'undo', title: '실행 취소' },
    { icon: Redo, command: 'redo', title: '다시 실행' },
  ];

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* 툴바 */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((btn, index) => (
          <button
            key={index}
            type="button"
            onClick={() => executeCommand(btn.command, btn.value)}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title={btn.title}
          >
            <btn.icon className="w-4 h-4" />
          </button>
        ))}
        
        {/* 구분선 */}
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        
        {/* 이미지 업로드 */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="이미지 삽입"
        >
          <Image className="w-4 h-4" />
        </button>
        
        {/* 링크 삽입 */}
        <button
          type="button"
          onClick={insertLink}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="링크 삽입"
        >
          <Link className="w-4 h-4" />
        </button>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* 에디터 영역 */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        dangerouslySetInnerHTML={{ __html: value }}
        className={`min-h-[200px] p-4 focus:outline-none ${
          !value && !isEditorFocused ? 'text-gray-400' : ''
        }`}
        data-placeholder={placeholder}
        style={{
          WebkitUserSelect: 'text',
          MozUserSelect: 'text',
          msUserSelect: 'text',
          userSelect: 'text'
        }}
      />
      
      {/* 플레이스홀더 스타일 */}
      <style jsx>{`
        div[contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}