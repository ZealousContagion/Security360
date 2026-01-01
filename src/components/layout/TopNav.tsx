import { Button } from "@/components/ui/Button"
import { Bell, Search, User, Menu } from "lucide-react"
import { Input } from "@/components/ui/Input"

interface TopNavProps {
    onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
    return (
        <header className="sticky top-0 z-40 w-full border-b glass">
            <div className="flex h-16 items-center gap-4 px-4 md:px-6">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>

                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial hidden sm:block">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search invoices..."
                                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                            />
                        </div>
                    </form>
                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                            <span className="sr-only">User profile</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
