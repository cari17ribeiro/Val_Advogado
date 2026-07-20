'use client';
import { useState } from 'react';
import { LockKeyhole, MailCheck, UserPlus } from 'lucide-react';
import { resendConfirmation, saveSession, signIn, signUp } from '@/lib/supabase-rest';

export default function Login(){
  const [email,setEmail]=useState('admin@valadvogado.com.br');
  const [password,setPassword]=useState('ValAdmin@2026');
  const [msg,setMsg]=useState('');
  const [tone,setTone]=useState<'error'|'success'>('error');
  const [loading,setLoading]=useState(false);

  const enter=async(e:React.FormEvent)=>{
    e.preventDefault(); setLoading(true); setMsg('');
    try{const session=await signIn(email,password);saveSession(session);location.href='/admin'}
    catch(err:any){setTone('error');setMsg(err.message==='Invalid login credentials'?'Usuário inexistente, senha incorreta ou e-mail ainda não confirmado. Use â€œCriar usuário de testeâ€ primeiro.':err.message)}
    finally{setLoading(false)}
  };
  const create=async()=>{
    setLoading(true);setMsg('');
    try{
      const session=await signUp(email,password);
      if(session.access_token){saveSession(session);location.href='/admin';return}
      setTone('success');setMsg('Cadastro solicitado. Abra o e-mail de confirmação enviado pelo Supabase e depois clique em Entrar.');
    }catch(err:any){setTone('error');setMsg(err.message)}finally{setLoading(false)}
  };
  const resend=async()=>{setLoading(true);setMsg('');try{await resendConfirmation(email);setTone('success');setMsg('E-mail de confirmação reenviado.')}catch(err:any){setTone('error');setMsg(err.message)}finally{setLoading(false)}};

  return <main className="admin-login"><div className="login-orb one"/><div className="login-orb two"/><form onSubmit={enter}><div className="login-logo">VAL <span>ADMIN</span></div><small>Painel editorial</small><h1>Editar site e revista</h1><p>Entre para atualizar textos, fotos, enquadramentos e gerar a versão de impressão.</p><label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{msg&&<div className={`login-message ${tone}`}>{msg}</div>}<button disabled={loading}><LockKeyhole/> {loading?'Aguarde...':'Entrar'}</button><button type="button" className="secondary" onClick={create} disabled={loading}><UserPlus/> Criar usuário de teste</button><button type="button" className="secondary" onClick={resend} disabled={loading}><MailCheck/> Reenviar confirmação</button><footer>Teste: admin@valadvogado.com.br • ValAdmin@2026</footer></form></main>
}


