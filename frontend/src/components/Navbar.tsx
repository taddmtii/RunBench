import { useAuth } from "@/app/contexts/authContext";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

export default function Navbar() {
    const { user, logout, isLoading } = useAuth();
    return (
        <nav className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-foreground">RunBench</span>
        </Link>

        {isLoading && (
          <Skeleton className="h-4 w-[120px] rounded-full" />
        )}
        {!isLoading && user && (
          <div className="flex items-center gap-2">
             <div className="font-bold">Welcome back, {user?.firstName}!</div>
             <Button variant="destructive" className="cursor-pointer" onClick={logout}>Logout</Button>
          </div>
         
        )}
        {!isLoading && !user && (
          <div className="flex items-center gap-4">
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