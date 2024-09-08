// app/myprofile/edit/page.tsx
import { notFound } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { searchUserByExternalId } from "@/actions/users/searchUsers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoTab from "./_components/BasicInfoTab";
import ContactSocialTab from "./_components/ContactSocialTab";
import InterestsSkillsTab from "./_components/InterestSkillsTab";
import BackButton from "@/components/BackButton";

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userExists = await searchUserByExternalId(user?.id!);

  if (!userExists) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex gap-2 items-center mb-4 h-20 md:h-36">
        <BackButton showtext={false} />
        <div>
          <h1 className="text-2xl font-bold ">Edit Profile</h1>
          <h3 className="text-sm text-muted-foreground ">
            Change your details from here, so that people can get connected to
            you easily.
          </h3>
        </div>
      </div>

      <div className="border-b-2 my-6" />
      <Tabs
        defaultValue="basic"
        className="w-full md:flex justify-between"
        orientation="vertical"
      >
        <div className="md:w-1/5 md:mr-6">
          <TabsList className="mb-4 md:bg-inherit grid grid-cols-3 md:grid-cols-1 md:h-[20vh]">
            <TabsTrigger value="basic" className="">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="contact" className="">
              Contact & Social
            </TabsTrigger>
            <TabsTrigger value="interests" className="">
              Interests & Skills
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="w-full h-full">
          <TabsContent value="basic">
            <BasicInfoTab user={userExists} />
          </TabsContent>

          <TabsContent value="contact" className="">
            <ContactSocialTab user={userExists} />
          </TabsContent>
          <TabsContent value="interests">
            <InterestsSkillsTab user={userExists} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default page;
