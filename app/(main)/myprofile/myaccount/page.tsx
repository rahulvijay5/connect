// // File: app/myprofile/myaccount/page.tsx
// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { ChevronRight, ChevronLeft, Lock } from 'lucide-react'
// import axios from 'axios'

// const EditProfile = () => {
//   const router = useRouter()
//   const [step, setStep] = useState(0)
//   const [formData, setFormData] = useState({
//     mobileNumber: '',
//     interests: '',
//     address: '',
//   })

//   const steps = [
//     {
//       title: 'Mobile Number',
//       description: 'Enter your mobile number for secure communication',
//       field: 'mobileNumber',
//       type: 'tel',
//     },
//     {
//       title: 'Interests',
//       description: 'Share your interests to connect with like-minded people',
//       field: 'interests',
//       type: 'text',
//     },
//     {
//       title: 'Address',
//       description: 'Provide your address for location-based connections',
//       field: 'address',
//       type: 'textarea',
//     },
//   ]

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async () => {
//     try {
//       await axios.post('/api/user/updateprofile', formData)
//       router.push('/myprofile')
//     } catch (error) {
//       console.error('Error updating profile:', error)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900">
//       <Card className="w-[350px] max-w-full">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">Edit Your Profile</CardTitle>
//           <CardDescription>Your privacy is our priority. Your data is always kept secure and never shared.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex items-center justify-center mb-4">
//               <Lock className="text-blue-500 dark:text-blue-400" size={24} />
//             </div>
//             <Label htmlFor={steps[step].field}>{steps[step].title}</Label>
//             {steps[step].type === 'textarea' ? (
//               <Textarea
//                 id={steps[step].field}
//                 name={steps[step].field}
//                 placeholder={steps[step].description}
//                 value={formData[steps[step].field as keyof typeof formData]}
//                 onChange={handleInputChange}
//               />
//             ) : (
//               <Input
//                 type={steps[step].type}
//                 id={steps[step].field}
//                 name={steps[step].field}
//                 placeholder={steps[step].description}
//                 value={formData[steps[step].field as keyof typeof formData]}
//                 onChange={handleInputChange}
//               />
//             )}
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button
//             variant="outline"
//             onClick={() => setStep(step - 1)}
//             disabled={step === 0}
//           >
//             <ChevronLeft className="mr-2 h-4 w-4" /> Back
//           </Button>
//           {step < steps.length - 1 ? (
//             <Button onClick={() => setStep(step + 1)}>
//               Next <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           ) : (
//             <Button onClick={handleSubmit}>Submit</Button>
//           )}
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

// export default EditProfile

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, Lock, Shield } from "lucide-react";
import { updateProfile } from "@/actions/users/updateUserProfile";
import { Calendar } from "@nextui-org/calendar";

const socialPlatforms = [
  "facebook",
  "instagram",
  "twitter",
  "linkedIn",
  "gitHub",
  "behance",
  "tiktok",
  "snapchat",
  "website",
];

const interests = [
  "Technology",
  "Sports",
  "Music",
  "Art",
  "Travel",
  "Food",
  "Fashion",
  "Photography",
  "Reading",
  "Gaming",
];

const hobbies = [
  "Cooking",
  "Gardening",
  "Hiking",
  "Painting",
  "Dancing",
  "Writing",
  "Yoga",
  "Cycling",
  "Meditation",
  "Volunteering",
];

type FormDataKeys =
  | "birthdate"
  | "currentLocation"
  | "hometown"
  | "profession"
  | "bio"
  | "phone"
  | "address"
  | "interests"
  | "hobbies"
  | "socialLinks";

const EditProfile = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    birthdate: null,
    currentLocation: "",
    hometown: "",
    profession: "",
    bio: "",
    phone: "",
    address: "",
    interests: [] as string[],
    hobbies: [] as string[],
    socialLinks: {} as Record<string, string>,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (
    field: FormDataKeys,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field]) // Ensure the field is an array
        ? checked
          ? [...prev[field], value]
          : prev[field].filter((item: string) => item !== value)
        : [], // Default to an empty array if not an array
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateProfile(formData);
      router.push("/myprofile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const steps = [
    {
      title: "Welcome",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center space-y-4"
        >
          <Shield className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Your Privacy Matters</h1>
          <p className="text-xl">
            We keep your data secure and never share it without your permission.
          </p>
        </motion.div>
      ),
    },
    {
      title: "Basic Info",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="birthdate">Birthdate</Label>
            {/* <Calendar
              mode="single"
              selected={formData.birthdate || undefined} // Ensure birthdate is not null
              onSelect={(date) => handleInputChange("birthdate", date)}
              className="rounded-md border"
            /> */}
            <Calendar
              focusedValue={formData.birthdate || undefined} // Ensure birthdate is not null
              onSelect={(date) => handleInputChange("birthdate", date)}
              className="rounded-md border"
              aria-label="Date (Show Month and Year Picker)"
              showMonthAndYearPickers
            />
          </div>
          <div>
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) => handleInputChange("profession", e.target.value)}
              placeholder="What do you do?"
            />
          </div>
        </motion.div>
      ),
    },
    {
      title: "Location",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="currentLocation">Current Location</Label>
            <Input
              id="currentLocation"
              value={formData.currentLocation}
              onChange={(e) =>
                handleInputChange("currentLocation", e.target.value)
              }
              placeholder="Where are you based?"
            />
          </div>
          <div>
            <Label htmlFor="hometown">Hometown</Label>
            <Input
              id="hometown"
              value={formData.hometown}
              onChange={(e) => handleInputChange("hometown", e.target.value)}
              placeholder="Where are you from?"
            />
          </div>
        </motion.div>
      ),
    },
    {
      title: "Bio",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself"
              rows={5}
            />
          </div>
        </motion.div>
      ),
    },
    {
      title: "Contact Details",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Your phone number"
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Your address"
              rows={3}
            />
          </div>
        </motion.div>
      ),
    },
    {
      title: "Interests",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {interests.map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={interest}
                  checked={formData.interests.includes(interest)}
                  onCheckedChange={(checked) =>
                    handleArrayInputChange(
                      "interests",
                      interest,
                      checked as boolean
                    )
                  }
                />
                <Label htmlFor={interest}>{interest}</Label>
              </div>
            ))}
          </div>
        </motion.div>
      ),
    },
    {
      title: "Hobbies",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {hobbies.map((hobby) => (
              <div key={hobby} className="flex items-center space-x-2">
                <Checkbox
                  id={hobby}
                  checked={formData.hobbies.includes(hobby)}
                  onCheckedChange={(checked) =>
                    handleArrayInputChange("hobbies", hobby, checked as boolean)
                  }
                />
                <Label htmlFor={hobby}>{hobby}</Label>
              </div>
            ))}
          </div>
        </motion.div>
      ),
    },
    {
      title: "Social Links",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <div>
            Add Social Links so that people do remain connected to you
            throughout.
          </div>
          {socialPlatforms.map((platform) => (
            <div key={platform}>
              <Label htmlFor={platform}>{platform}</Label>
              <Input
                id={platform}
                value={formData.socialLinks[platform] || ""}
                onChange={(e) =>
                  handleSocialLinkChange(platform, e.target.value)
                }
                placeholder={`Your ${platform} URL`}
              />
            </div>
          ))}
        </motion.div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full max-w-3xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6">{steps[step].title}</h2>
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
