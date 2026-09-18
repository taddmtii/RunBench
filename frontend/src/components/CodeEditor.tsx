"use client"

import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react"

export default function CodeEditor() {
    const editorRef = useRef(null)
    const [language, setLanguage] = useState(null)
    const [code, setCode] = useState("")
    
    const handleEditorChange = (value) => {
        setCode(value)
    }

    return (
        <Editor 
            height="400px"
            width="600px"
            value={code}
            onChange={handleEditorChange} 
            defaultLanguage="python" 
            defaultValue="// Write your code here" 
            options={{
                minimap: { enabled: false},
                fontSize: 14,
                fontFamily: "Fira Code",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
                formatOnPaste: true,
                lineNumbers: "on",
                tabSize: 2
            }}
            theme="vs-dark" 
        />
    )
}