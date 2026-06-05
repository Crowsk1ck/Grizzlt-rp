import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext({
  user: null,
  isAdmin: false,
  member: null,
  hasFamilyRole: false,
  loading: true,
  refreshUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) throw new Error('Auth API unavailable');
      const data = await response.json();
      setUser(data.user || null);
      setIsAdmin(Boolean(data.isAdmin));

      if (data.user) {
        const memberResponse = await fetch('/api/members/me');
        if (memberResponse.ok) {
          const memberData = await memberResponse.json();
          setMember(memberData.member || null);
        } else {
          setMember(null);
        }
      } else {
        setMember(null);
      }
    } catch {
      setUser(null);
      setIsAdmin(false);
      setMember(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  const familyRoleId = import.meta.env.VITE_ACCEPTED_ROLE_ID || '1390073033687044236';
  const hasFamilyRole = Boolean(member?.roles?.includes(familyRoleId));
  const value = useMemo(
    () => ({ user, isAdmin, member, hasFamilyRole, loading, refreshUser }),
    [user, isAdmin, member, hasFamilyRole, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
