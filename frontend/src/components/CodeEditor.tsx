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

    const handleRunClick = async () => {
        const res = await fetch("/api/run", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({code: code})
        })
        if (!res.ok) {
            console.error("Something went wrong with Run.")
            return
        } 
        const data = await res.json();
        console.log(data)
    }

    const handleSubmitClick = async () => {

    }

    return (
        <div className="flex flex-col items-center justify-between gap-2 p-4">
            <div className="flex">
                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" />}>
                            {/* Needed to capitalize first letter of value and monaco only takes lowercase values */}
                            {language.charAt(0).toUpperCase() + language.slice(1)}
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
                <Button className="cursor-pointer" onClick={handleRunClick}>Run</Button>
                <Button className="bg-green-400 cursor-pointer" onClick={handleSubmitClick}>Submit</Button>
            </div>
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