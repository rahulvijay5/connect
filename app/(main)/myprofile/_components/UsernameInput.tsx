"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UsernameSchema } from "@/lib/zod-schema";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { appname_lowercase } from "@/lib/constants";
import { usePersonStore } from "@/app/store/globalstore";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const UsernameInputForm = () => {
  const [loading, setLoading] = useState("false");
  const router = useRouter();

  const form = useForm<z.infer<typeof UsernameSchema>>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const userDetails = useKindeBrowserClient();
  const user = userDetails.user;
  const updateUserName = usePersonStore((state) => state.updateUserName);
  const updateNameOfUser = usePersonStore((state) => state.updateNameOfUser);
  const updateUserEmail = usePersonStore((state) => state.updateUserEmail);
  const updateUserId = usePersonStore((state) => state.updateUserId);

  async function onSubmit(username: z.infer<typeof UsernameSchema>) {
    setLoading("true");
    const response = await fetch("/api/auth/success", {
      method: "POST",
      body: JSON.stringify(username),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading("false");

    if (response.ok) {
      updateUserName(username.username);
      updateNameOfUser(user?.given_name!);
      updateUserEmail(user?.email!);
      updateUserId(user?.id!);

      router.push("/myprofile");
    }

    // console.log(username);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 lg:w-1/4 md:1/2"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder={`${appname_lowercase}`} {...field} />
              </FormControl>
              <FormDescription>
                Usernames are short and easy to remember.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {loading ? (
          <Button type="submit" className="w-full xl:w-1/3">
            Submit
          </Button>
        ) : (
          <Button type="submit" disabled className="w-full">
            Getting your profile ready
            <span className="animate-spin ml-1">
              <Loader2Icon className="h-3 w-3" />
            </span>
          </Button>
        )}
      </form>
    </Form>
  );
};

export default UsernameInputForm;
