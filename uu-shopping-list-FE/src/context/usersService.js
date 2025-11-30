import {
  fetchMembers as apiFetchMembers,
  inviteMember as apiInviteMember,
  leaveList as apiLeaveList,
  removeMember as apiRemoveMember,
} from "../models/users";

export const fetchMembers = async (listID, setMembers) => {
  const res = await apiFetchMembers(listID);
  if (res.status >= 200 && res.status < 300 && Array.isArray(res.payload)) {
    if (typeof setMembers === "function") setMembers(res.payload);
  }
  return res;
};

export const inviteMember = async (formData, { setMembers, setUsers } = {}) => {
  const res = await apiInviteMember(formData);
  if (res.status >= 200 && res.status < 300 && res.payload) {
    if (typeof setMembers === "function")
      setMembers((prev) => [res.payload, ...(prev || [])]);

    if (typeof setUsers === "function") {
      const newId = res.payload.id;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === res.payload.userId
            ? {
                ...u,
                memberLists: [
                  ...new Set([...(u.memberLists || []), formData.listId]),
                ],
              }
            : u
        )
      );
    }
  }
  return res;
};

export const leaveList = async (
  memberID,
  { setMembers, setCurrentUser, setUsers } = {}
) => {
  const res = await apiLeaveList(memberID);
  if (res.status >= 200 && res.status < 300) {
    if (typeof setMembers === "function")
      setMembers((prev) => (prev || []).filter((m) => !(m.id === memberID)));

    if (typeof setUsers === "function")
      setUsers((prev) =>
        prev.map((u) => ({
          ...u,
          memberLists: (u.memberLists || []).filter(
            (id) => id !== memberID && id !== String(memberID)
          ),
        }))
      );

    if (typeof setCurrentUser === "function")
      setCurrentUser((prev) => ({
        ...prev,
        memberLists: (prev.memberLists || []).filter(
          (id) => id !== memberID && id !== String(memberID)
        ),
      }));
  }
  return res;
};

export const removeMember = async (memberID, { setMembers, setUsers } = {}) => {
  const res = await apiRemoveMember(memberID);
  if (res.status >= 200 && res.status < 300) {
    if (typeof setMembers === "function")
      setMembers((prev) => (prev || []).filter((m) => !(m.id === memberID)));

    if (typeof setUsers === "function")
      setUsers((prev) =>
        prev.map((u) => ({
          ...u,
          memberLists: (u.memberLists || []).filter(
            (id) => id !== memberID && id !== String(memberID)
          ),
        }))
      );
  }
  return res;
};
