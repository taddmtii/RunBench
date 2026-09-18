"use client"

import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "../components/ui/button";

export default function CodeEditor() {
    const [language, setLanguage] = useState("python")
    const [code, setCode] = useState("")
    
    const handleEditorChange = (value) => {
        setCode(value)
    }

    const LANGUAGES = [
        { label: "Python", value: "python" },
        { label: "Typescript", value: "typescript"}
    ]
    

    return (
        <div className="flex flex-col items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="outline">
                        {/* Needed to capitalize first letter of value and monaco only takes lowercase values */}
                        {language.charAt(0).toUpperCase() + language.slice(1)}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        {LANGUAGES.map((lang) => (
                            <DropdownMenuItem 
                                key={lang.value}
                                onClick={() => setLanguage(lang.value)}
                                >
                                {lang.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

        <Editor 
            height="90vh"
            width="50vw"
            value={code}
            onChange={handleEditorChange} 
            defaultLanguage="python" 
            language={language}
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
        </div>
    )
}