"use client";

import { useAuth } from "@/app/contexts/authContext";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function Navbar() {
    const { user, logout, isLoading } = useAuth();
    return (
        <nav className="container mx-auto grid grid-cols-3 items-center py-4">
        <Link href="/" className="font-bold text-xl">RunBench</Link>

        {!isLoading && user && (
          <div className="flex justify-self-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/problems" className="hover:text-foreground">Problems</Link>
          </div>
        )}

        {isLoading && (
          <Skeleton className="h-4 w-[120px] justify-self-end rounded-full" />
        )}
        {!isLoading && user && (
          <div className="flex items-center justify-self-end gap-1">
             <span className="text-xs text-muted-foreground">Logged in as {user.firstName}</span>
             <Button variant="ghost" size="icon-sm" className="cursor-pointer" onClick={logout} aria-label="Logout" title="Logout">
               <LogOut className="size-4" />
             </Button>
          </div>
         
        )}
        {!isLoading && !user && (
          <div className="col-start-3 flex items-center justify-self-end gap-4">
          <Link
            href="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
        )}
      </nav>
    )
}