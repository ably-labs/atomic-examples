import { SpaceMember } from "@ably/spaces";

export type Member = Omit<SpaceMember, "profileData"> & {
  profileData: { memberColor: string; memberName: string };
};

export const getCellStylesForMember = (
  cellMember: SpaceMember | null,
): string => {
  if (cellMember) {
    const memberColor = `${cellMember?.profileData?.memberColor}`;
    return `border-[${memberColor}] border-2`;
  }
  return "bg-white border-[0.25px] border-gray-350 hover:border-gray-325";
};
