import { create } from "zustand";

type State = {
  UserId: string;
  UserName: string;
  UserEmail: string;
  NameOfUser: string;
  ProfilePicture: string;
};

type Action = {
  updateUserId: (UserId: State["UserId"]) => void;
  updateUserName: (UserName: State["UserName"]) => void;
  updateUserEmail: (UserEmail: State["UserEmail"]) => void;
  updateNameOfUser: (NameOfUser: State["NameOfUser"]) => void;
  updateProfilePicture: (ProfilePicture: State["ProfilePicture"]) => void;
};

const usePersonStore = create<State & Action>((set) => ({
  UserId: "",
  UserName: "",
  UserEmail: "",
  NameOfUser: "",
  ProfilePicture: "",
  updateUserId: (id) => set(() => ({ UserId: id })),
  updateUserName: (username) => set(() => ({ UserName: username })),
  updateUserEmail: (email) => set(() => ({ UserEmail: email })),
  updateNameOfUser: (name) => set(() => ({ UserEmail: name })),
  updateProfilePicture: (picture) => set(() => ({ UserEmail: picture })),
}));

export {usePersonStore}
