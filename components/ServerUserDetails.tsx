import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import Link from "next/link";

export async function isUserAuthenticated(){
    const {isAuthenticated} = getKindeServerSession();
    const userIsAuthenticated = await isAuthenticated();

    if (userIsAuthenticated) {
        return true;
    } else {
        return false
    }
}

export async function userDetails(){
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    console.log(user)
    if (!user) {
        return <div>User doesn't exists</div>;
    } else {
        return <div className="flex-center flex-col gap-2 p-4 border-dashed border-2 rounded-md">
            <div>
            {user.email}
            </div>
            <div className="flex-center  gap-2">
                {user.given_name} {user.family_name}
                {user.picture && <Image alt="profile image" height={40} className="rounded-full" width={40} src={user.picture}/>}
            </div>
            
        </div>
    }
}

export async function ServerUserDetails() {
    const {
        getAccessToken,
        getBooleanFlag,
        getFlag,
        getIdToken,
        getIntegerFlag,
        getOrganization,
        getPermission,
        getPermissions,
        getStringFlag,
        getUser,
        getUserOrganizations,
        isAuthenticated
    } = getKindeServerSession();

    console.log(await getAccessToken());
    console.log(await getBooleanFlag("bflag", false));
    console.log(await getFlag("flag", "x", "s"));
    console.log(await getIntegerFlag("iflag", 99));
    console.log(await getOrganization());
    console.log(await getPermission("eat:chips"));
    console.log(await getPermissions());
    console.log(await getStringFlag("sflag", "test"));
    console.log(await getUser());
    console.log(await getUserOrganizations());
    console.log(await isAuthenticated());
    return (
        <div className="container">
            <div className="card hero">
                <p className="text-display-1 hero-title">
                    Let’s start authenticating <br /> with KindeAuth
                </p>
                <p className="text-body-1 hero-tagline">Configure your app</p>

                <Link
                    href="https://kinde.com/docs/sdks/nextjs-sdk"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-light btn-big"
                >
                    Go to docs
                </Link>
            </div>
        </div>
    );
}