"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { authClient, useAuth } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/auth";

function SignInForm(){
  const router=useRouter();const params=useSearchParams();const {user,isPending}=useAuth();const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [busy,setBusy]=useState(false);
  useEffect(()=>{if(!isPending&&user){const callback=params.get("callbackUrl");const safe=callback&&callback.startsWith("/")&&!callback.startsWith("//")?callback:dashboardPath(user.role);router.replace(safe);}},[isPending,user,params,router]);
  const submit=async(event:React.FormEvent)=>{event.preventDefault();setBusy(true);try{const result=await authClient.signIn.email({email:email.trim().toLowerCase(),password});if(result.error)throw new Error(result.error.message);toast.success("Welcome back to FixMate.");const user=result.data?.user as {role?:string}|undefined;const callback=params.get("callbackUrl");const safeCallback=callback&&callback.startsWith("/")&&!callback.startsWith("//")?callback:dashboardPath(user?.role);router.push(safeCallback);router.refresh();}catch(error){toast.error(error instanceof Error?error.message:"Sign in failed. Check your details.");}finally{setBusy(false);}};
  if(isPending||user)return <div className="auth-route-loader"><span className="loader-ring"/><p>Checking your account…</p></div>;
  return <section className="form-page"><div className="form-card"><div className="form-heading"><span className="eyebrow">WELCOME BACK</span><h1>Sign in to FixMate.</h1><p>Your repair updates and next steps are right where you left them.</p></div><form className="form-stack" onSubmit={submit}><div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="you@example.com"/></div><div className="field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="Your password"/></div><button className="button button-primary form-submit" disabled={busy}>{busy?"Signing in…":"Sign in"}<ArrowRight size={15}/></button></form><div className="form-divider" style={{marginTop:20}}>SECURE ACCOUNT ACCESS</div><p className="form-footnote"><LockKeyhole size={12} style={{verticalAlign:"-2px"}}/> Your account is protected by FixMate authentication.</p><p className="form-footnote">New to FixMate? <Link href="/sign-up">Create an account</Link></p></div></section>;
}
export default function SignInPage(){return <Suspense fallback={<div className="loading-block"><span className="loader-ring"/></div>}><SignInForm/></Suspense>;}
