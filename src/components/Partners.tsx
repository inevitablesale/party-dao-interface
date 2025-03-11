
import Image from "@/components/ui/image"

export const Partners = () => {
  const partners = [
    {
      name: "Canary Accountants",
      logo: "https://i.postimg.cc/XvvZrjLP/DALL-E-2025-02-13-22-32-46-A-minimalistic-modern-logo-featuring-a-stylized-canary-bird-icon-in-a.webp",
      url: "https://canary.accountants/"
    }
  ]

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          Our Partners
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-12">
          {partners.map((partner) => (
            <div key={partner.name} className="flex flex-col items-center gap-3">
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-50"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={200}
                  height={80}
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              </a>
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-500 hover:text-yellow-400 transition-colors hover:underline"
              >
                {partner.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
