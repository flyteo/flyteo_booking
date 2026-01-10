import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/918975995125"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        fixed bottom-24 right-4 z-50
        w-14 h-14 rounded-full
        bg-green-500 text-white
        flex items-center justify-center
        shadow-2xl
        animate-pulse
        hover:scale-110
        transition-transform
      "
    >
      {/* WhatsApp SVG ICON */}
    <FaWhatsapp size={28} />
    </a>
  );
}
