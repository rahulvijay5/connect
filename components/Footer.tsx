// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Home, Search, Edit, Share, User } from "lucide-react";
// import clsx from "clsx";
// import { searchUserByExternalId } from "@/actions/users/searchUsers";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// const Footer = async () => {
//   const pathname = usePathname();
//   const { getUser } = await getKindeServerSession();
//   const user = await getUser();
//   const userexists = await searchUserByExternalId(user?.id!);

//   const links = [
//     { href: "/", label: "Home", icon: Home },
//     { href: "/myprofile/edit", label: "Search", icon: Search },
//     { href: "/updates", label: "Updates", icon: Edit },
//     {
//       href: `/${userexists?.username}?share=true`,
//       label: "Share",
//       icon: Share,
//     },
//     { href: "/myprofile", label: "Profile", icon: User },
//   ];

//   return (
//     <footer className="fixed bottom-0 w-full bg-inherit py-3">
//       <div className="flex justify-around items-center">
//         {links.map((link) => {
//           const isActive = pathname === link.href;

//           return (
//             <Link key={link.href} href={link.href}>
//               <a
//                 className={clsx(
//                   "relative flex flex-col items-center text-sm transition-all",
//                   {
//                     "text-blue-500": isActive,
//                     "text-gray-500": !isActive,
//                   }
//                 )}
//               >
//                 <div
//                   className={clsx("rounded-full p-2 transition-all", {
//                     "bg-blue-500 text-white": isActive,
//                     "bg-transparent": !isActive,
//                   })}
//                 >
//                   <link.icon className="w-6 h-6" />
//                 </div>
//                 <span
//                   className={clsx("mt-2 transition-opacity", {
//                     "opacity-100": isActive,
//                     "opacity-50": !isActive,
//                   })}
//                 >
//                   {link.label}
//                 </span>

//                 {isActive && (
//                   <div className="absolute -bottom-3 w-2 h-2 rounded-full bg-blue-500 transition-all"></div>
//                 )}
//               </a>
//             </Link>
//           );
//         })}
//       </div>
//     </footer>
//   );
// };

// export default Footer;
