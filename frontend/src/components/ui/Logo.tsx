import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

const sizes = {
  sm: { width: 100, height: 28 },
  md: { width: 130, height: 36 },
  lg: { width: 160, height: 44 },
}

export default function Logo({ size = 'md', href = '/products' }: LogoProps) {
  const { width, height } = sizes[size]

  return (
    <Link href={href}>
      <Image
        src="/logo.png"
        alt="FunShop"
        width={width}
        height={height}
        priority
      />
    </Link>
  )
}
