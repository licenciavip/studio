export default function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container flex items-center justify-center h-16 px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Poolera. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
