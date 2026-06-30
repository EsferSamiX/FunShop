import Image from 'next/image'
import Logo from '@/components/ui/Logo'

const features = [
  {
    icon: '🏷️',
    title: 'Exclusive Deals',
    desc: 'Access members-only offers and discounts.',
  },
  {
    icon: '🚚',
    title: 'Fast Delivery',
    desc: 'Quick and reliable delivery to your doorstep.',
  },
  {
    icon: '🔒',
    title: 'Secure & Safe',
    desc: 'Your data and payments are always protected.',
  },
]

interface AuthLeftPanelProps {
  subtitle: string
}

export default function AuthLeftPanel({ subtitle }: AuthLeftPanelProps) {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-[#EEF2FF] p-10 rounded-l-2xl relative overflow-hidden">
      <Logo size="md" />

      <div className="space-y-6 z-10">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Shop Smarter,
          </h2>
          <h2 className="text-4xl font-extrabold leading-tight">
            <span className="text-[#2563EB]">Live </span>
            <span className="text-[#EC4899]">Better</span>
          </h2>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{subtitle}</p>

        <ul className="space-y-4">
          {features.map(f => (
            <li key={f.title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Illustration */}
      <div className="flex justify-center z-10">
        <Image
          src="/main_logo.png"
          alt="FunShop illustration"
          width={200}
          height={200}
          className="object-contain opacity-90"
        />
      </div>
    </div>
  )
}
