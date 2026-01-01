export function Footer() {
    return (
        <footer className="bg-muted py-6 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Security 360. All rights reserved.
                </p>
                <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
                    <span>Contact: support@security360.com</span>
                    <span>|</span>
                    <span>+254 700 000 000</span>
                </div>
            </div>
        </footer>
    )
}
