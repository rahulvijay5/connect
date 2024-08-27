import { Metadata } from "next"
import Image from "next/image"
import { SidebarNav } from "./components/sidebar-nav"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/ModeToggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TopRightIcon from "@/components/icons/page"



export const metadata: Metadata = {
  title: "Edit | My Profile",
  description: "View your profile and edit details of it.",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/myprofile/edit",
  },
  {
    title: "Account",
    href: "/myprofile/edit/account",
  },
  // {
  //   title: "Appearance",
  //   href: "/myprofile/edit/appearance",
  // },
  // {
  //   title: "Notifications",
  //   href: "/myprofile/edit/notifications",
  // },
  // {
  //   title: "Display",
  //   href: "/myprofile/edit/display",
  // },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="flex justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your profile and view account settings.
          </p>
        </div>
        <div className="flex gap-1">
            
        <ModeToggle/>
        <Link href={`/connections`}>
            <Button variant="outline" className="hover:text-sky-500 gap-1">
              My Connections
              <TopRightIcon />
            </Button>
          </Link>
        </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  )
}