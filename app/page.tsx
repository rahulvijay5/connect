import ConnectUsersButton from "@/components/ConnectUsers";
import CreateNewUser from "@/components/CreateNewUser";
import { ModeToggle } from "@/components/ModeToggle";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Home() {
  // const isuserauth = isUserAuthenticated();
  const {isAuthenticated} = getKindeServerSession();

  const isUserAuthenticated = await isAuthenticated()
  return (
    <>
      <div className="min-h-screen flex-col flex-center gap-4">
        <ModeToggle />

        <LoginLink>Sign in</LoginLink>
        <RegisterLink>Sign up</RegisterLink>
        <LogoutLink>Log out</LogoutLink>


        <CreateNewUser/>
        <ConnectUsersButton id1="661c31c7b6bc3dec5889ef38" id2="661c3947b6bc3dec5889ef3b"/>
           
      </div>
      
      {/* {isAuthenticated} */}
      {/* <isUserAuthenticated/> */}
      
    </>
  );
}
