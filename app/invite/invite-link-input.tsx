"use client";

import { InputField, InputIcon, InputRoot } from "../components/invite-link";
import { Copy, Link } from "lucide-react";
import { IconButton } from "../components/icon-button";

interface InviteLinkInputProps {
  inviteLink: string;
}

export default function InviteLinkInput({ inviteLink }: InviteLinkInputProps) {
  function copyInviteLink() {
    navigator.clipboard.writeText(inviteLink);
  }

  return (
    <InputRoot>
      <InputIcon className="size-5">
        <Link />
      </InputIcon>
      <InputField readOnly defaultValue={inviteLink} />
      <IconButton className="-mr-2" onClick={copyInviteLink}>
        <Copy className="size-5" />
      </IconButton>
    </InputRoot>
  );
}
