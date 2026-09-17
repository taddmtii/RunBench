import { useRef, useState } from "react";

export default function CodeEditor() {
    const editorRef = useRef(null)
    const [language, setLanguage] = useState(null)
    const [code, setCode] = useState("")
    
    
}