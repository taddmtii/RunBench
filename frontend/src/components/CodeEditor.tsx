"use client"

import { useState } from "react";
import { Editor } from "@monaco-editor/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "../components/ui/button";

export default function CodeEditor() {
    const [language, setLanguage] = useState("python")
    const [code, setCode] = useState("")

    const LANGUAGES = [
        { label: "Python", value: "python"},
        { label: "Typescript", value: "typescript"},
        { label: "Javascript", value: "javascript"},
    ]

    return (
        <div className="flex flex-col items-center gap-2 p-4">
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
                                onClick={() => {setLanguage(lang.value)}}
                                >
                                {lang.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-900">
                <Editor 
                    height="90vh"
                    width="50vw"
                    value={code}
                    onChange={(value) => setCode(value || "")} 
                    defaultLanguage="python" 
                    language={language}
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
        </div>
    )
}