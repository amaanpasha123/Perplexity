import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
);

export default function Auth() {
  async function login(provider: "github" | "google") {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if(error){
        alert("Some Error is there in this");
    }else{
        alert("SingedIn");
    }
  }

  
  return (
    <div>
      <button onClick={() => login("Google")}>Login with Google</button>
      <button onClick={() => login("Github")}>Login with Github</button>
    </div>
  );
}
