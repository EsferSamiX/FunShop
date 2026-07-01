import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

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
      </div>

      {/* Illustration */}
      <div className="flex justify-center z-10">
        <Link href="/products">
          <Image
            src="/main_logo.png"
            alt="FunShop illustration"
            width={200}
            height={200}
            className="object-contain opacity-90"
          />
        </Link>
      </div>
    </div>
  )
}
