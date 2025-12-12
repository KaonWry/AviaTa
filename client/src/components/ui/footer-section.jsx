import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Switch } from "./switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { useTheme } from "../../context/theme-context"
import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter, Plane } from "lucide-react"

function FooterSection() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert("Terima kasih telah berlangganan newsletter AviaTa!");
  };

  return (
    <footer className="relative border-t border-border bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter Section */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">AviaTa</h2>
            </div>
            <p className="mb-6 text-muted-foreground">
              Bergabunglah dengan newsletter kami untuk update terbaru dan penawaran eksklusif.
            </p>
            <form className="relative" onSubmit={handleNewsletterSubmit}>
              <Input
                type="email"
                placeholder="Masukkan email Anda"
                className="pr-12 backdrop-blur-sm"
                required
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Menu Cepat</h3>
            <nav className="space-y-2 text-sm">
              <a href="/" className="block transition-colors hover:text-primary">
                Beranda
              </a>
              <a href="/search" className="block transition-colors hover:text-primary">
                Cari Tiket
              </a>
              <a href="/tickets" className="block transition-colors hover:text-primary">
                E-Ticket Saya
              </a>
              <a href="/tracking" className="block transition-colors hover:text-primary">
                Tracking Penerbangan
              </a>
              <a href="/profile" className="block transition-colors hover:text-primary">
                Profil Saya
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Hubungi Kami</h3>
            <address className="space-y-2 text-sm not-italic text-muted-foreground">
              <p>Jl. Rawamangun Muka</p>
              <p>Jakarta Timur, 13220</p>
              <p>Telepon: (021) 123-4567</p>
              <p>Email: hello@aviata.id</p>
            </address>
          </div>

          {/* Social & Theme */}
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Ikuti Kami</h3>
            <div className="mb-6 flex space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ikuti kami di Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ikuti kami di Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ikuti kami di Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Terhubung di LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Sun className="h-4 w-4 text-yellow-500" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4 text-blue-400" />
              <Label htmlFor="dark-mode" className="text-sm text-muted-foreground">
                {isDarkMode ? "Mode Gelap" : "Mode Terang"}
              </Label>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 AviaTa. Hak cipta dilindungi.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
              Kebijakan Privasi
            </a>
            <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
              Syarat & Ketentuan
            </a>
            <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
              Pengaturan Cookie
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { FooterSection }
export default FooterSection
