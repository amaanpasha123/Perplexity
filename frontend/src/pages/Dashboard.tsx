import { createClient } from "@/lib/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";

const supabase = createClient();

export default function Dashboard() {
  const [user, setUser] = useState<User | null>();
    const navigate = useNavigate();

  useEffect(() => {
    async function getInfo() {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    }
    getInfo();
  }, []);

  return <div>
    {!user && <button onClick={()=> {
        navigate("/auth");
    }}>
        Sign in
        </button>}
    {user?.email}
    </div>;
}
