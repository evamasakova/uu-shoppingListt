import {
  fetchMembers as apiFetchMembers,
  inviteMember as apiInviteMember,
  leaveList as apiLeaveList,
  removeMember as apiRemoveMember,
} from "../models/users";

// Helper to check successful status
const isSuccess = (res) => res?.status >= 200 && res?.status < 300;

// Fetch members of a list
export const fetchMembersService = async (listId, setMembers) => {
  const res = await apiFetchMembers(listId);
  if (res?.status >= 200 && res?.status < 300 && Array.isArray(res.payload)) {
    setMembers(res.payload);
  }
  return res;
};

// Invite a new member
// usersService.js
export const inviteMemberService = async (
  listId,
  formData,
  { setMembers, setUsers } = {}
) => {
  try {
    const res = await inviteMember(listId, formData); // <-- pass ID, not object
    if (isSuccess(res) && res.payload) {
      if (typeof setMembers === "function") {
        setMembers((prev) => [res.payload, ...(prev || [])]);
      }

      if (typeof setUsers === "function" && res.payload.userId) {
        setUsers((prev) =>
          (prev || []).map((u) =>
            u.id === res.payload.userId
              ? {
                  ...u,
                  memberLists: [...new Set([...(u.memberLists || []), listId])],
                }
              : u
          )
        );
      }
    }
    return res;
  } catch (e) {
    console.warn("Failed to invite member", e);
    return { status: 500, error: e };
  }
};

// Leave a list
export const leaveList = async (
  memberId,
  { setMembers, setCurrentUser, setUsers } = {}
) => {
  try {
    const res = await apiLeaveList(memberId);
    if (isSuccess(res)) {
      if (typeof setMembers === "function") {
        setMembers((prev) =>
          (prev || []).filter((m) => String(m.id) !== String(memberId))
        );
      }

      if (typeof setUsers === "function") {
        setUsers((prev) =>
          (prev || []).map((u) => ({
            ...u,
            memberLists: (u.memberLists || []).filter(
              (id) => id !== memberId && id !== String(memberId)
            ),
          }))
        );
      }

      if (typeof setCurrentUser === "function") {
        setCurrentUser((prev) => ({
          ...prev,
          memberLists: (prev.memberLists || []).filter(
            (id) => id !== memberId && id !== String(memberId)
          ),
        }));
      }
    }
    return res;
  } catch (e) {
    console.warn("Failed to leave list", e);
    return { status: 500, error: e };
  }
};

// Remove a member
export const removeMember = async (memberId, { setMembers, setUsers } = {}) => {
  try {
    const res = await apiRemoveMember(memberId);
    if (isSuccess(res)) {
      if (typeof setMembers === "function") {
        setMembers((prev) =>
          (prev || []).filter((m) => String(m.id) !== String(memberId))
        );
      }

      if (typeof setUsers === "function") {
        setUsers((prev) =>
          (prev || []).map((u) => ({
            ...u,
            memberLists: (u.memberLists || []).filter(
              (id) => id !== memberId && id !== String(memberId)
            ),
          }))
        );
      }
    }
    return res;
  } catch (e) {
    console.warn("Failed to remove member", e);
    return { status: 500, error: e };
  }
};
